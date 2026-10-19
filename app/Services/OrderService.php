<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Blacklist;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * SmsService ডিপেন্ডেন্সি ইনজেকশন
     */
    public function __construct(
        protected SmsService $smsService
    ) {}

    /**
     * অর্ডার তৈরি: স্টক লক, ডুপ্লিকেট রোধ এবং ভ্যারিয়েন্ট স্টক সাপোর্ট
     * $items = [['product_id' => 1, 'variant_id' => 2, 'quantity' => 1], ...]
     */
    public function create(array $data, array $items, ?string $idempotencyKey = null): Order
    {
        if ($idempotencyKey && $existing = Order::where('idempotency_key', $idempotencyKey)->first()) {
            return $existing;
        }

        $this->assertNotBlacklisted($data);

        $archetype = tenant('archetype') ?? 'commerce';

        $order = DB::transaction(function () use ($data, $items, $idempotencyKey, $archetype) {
            $subtotal = 0;
            $lines = [];

            // ডেডলক এড়াতে সাজিয়ে লক করা
            $productIds = collect($items)->pluck('product_id')->filter()->sort()->values();
            $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            $variantIds = collect($items)->pluck('variant_id')->filter()->sort()->values();
            $variants = ProductVariant::whereIn('id', $variantIds)->lockForUpdate()->get()->keyBy('id');

            foreach ($items as $item) {
                $product = $products[$item['product_id']] ?? null;
                $variant = !empty($item['variant_id']) ? ($variants[$item['variant_id']] ?? null) : null;
                $qty = (int) $item['quantity'];

                if (!$product || !$product->is_active || $qty < 1) {
                    throw ValidationException::withMessages(['items' => 'অবৈধ প্রোডাক্ট সিলেক্ট করা হয়েছে']);
                }

                // ভ্যারিয়েন্ট থাকলে ভ্যারিয়েন্টের স্টক ও দাম যাচাই
                if ($variant) {
                    if ($archetype === 'commerce' && $variant->stock_quantity < $qty) {
                        throw ValidationException::withMessages([
                            'items' => "{$product->name} ({$variant->title})-এর পর্যাপ্ত স্টক নেই",
                        ]);
                    }

                    $price = (int) round(($variant->price ?: ($product->sale_price ?: $product->price)) * 100);

                    if ($archetype === 'commerce') {
                        $variant->decrement('stock_quantity', $qty);
                    }
                } else {
                    // শুধুমাত্র ফিজিক্যাল কমার্সের ক্ষেত্রে স্টক যাচাই ও ডিক্রিমেন্ট হবে
                    if ($archetype === 'commerce' && $product->stock_quantity < $qty) {
                        throw ValidationException::withMessages([
                            'items' => "{$product->name}-এর পর্যাপ্ত স্টক নেই",
                        ]);
                    }

                    $price = (int) round(($product->sale_price ?: $product->price) * 100);

                    if ($archetype === 'commerce') {
                        $product->decrement('stock_quantity', $qty);
                    }
                }

                $lineTotal = $price * $qty;
                $subtotal += $lineTotal;

                $lines[] = [
                    'product_id'         => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name'       => $product->name,
                    'variant'            => $variant?->title,
                    'unit_price'         => $price,
                    'quantity'           => $qty,
                    'line_total'         => $lineTotal,
                ];
            }

            // সার্ভিসের জন্য শিপিং ফি শূন্য (০)
            $shipping = ($archetype === 'commerce') ? $this->shippingFee($data['district'] ?? null) : 0;
            $discount = 0;
            $total = $subtotal - $discount + $shipping;

            $order = Order::create([
                ...$data,
                'idempotency_key' => $idempotencyKey,
                'order_number'    => $this->nextNumber($archetype),
                'subtotal'        => $subtotal,
                'discount'        => $discount,
                'shipping_fee'    => $shipping,
            ]);

            $order->forceFill([
                'total'  => $total,
                'status' => OrderStatus::Pending,
            ])->save();

            $order->items()->createMany($lines);

            $order->histories()->create([
                'from_status' => null,
                'to_status'   => OrderStatus::Pending->value,
                'reason'      => ($archetype === 'service') ? 'Initial appointment booking placed' : 'Initial order placed',
            ]);

            return $order;
        });

        // কাস্টমারকে প্রাথমিক কনফার্মেশন SMS
        $amountFormatted = number_format($order->total / 100, 2);
        $smsText = ($archetype === 'service')
            ? "প্রিয় {$order->customer_name}, আপনার অ্যাপয়েন্টমেন্ট #{$order->order_number} সফলভাবে গৃহীত হয়েছে। ফি: ৳{$amountFormatted}। চেম্বারে উপস্থিত হওয়ার জন্য অনুরোধ করা হচ্ছে।"
            : "প্রিয় {$order->customer_name}, আপনার অর্ডার #{$order->order_number} সফলভাবে গৃহীত হয়েছে। মোট বিল: ৳{$amountFormatted}";

        $this->smsService->send($order->customer_phone, $smsText);

        return $order;
    }

    /** স্ট্যাটাস পরিবর্তন + অডিট হিস্ট্রি + স্টক পুনরুদ্ধার + SMS নোটিফিকেশন */
    public function changeStatus(Order $order, OrderStatus $to, ?int $userId, ?string $reason = null): Order
    {
        $updatedOrder = DB::transaction(function () use ($order, $to, $userId, $reason) {
            $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();
            $from = $order->status;

            if (!$from->canMoveTo($to)) {
                throw new DomainException("স্ট্যাটাস {$from->value} থেকে {$to->value}-এ পরিবর্তন গ্রহণযোগ্য নয়");
            }

            if ($to->requiresReason() && blank($reason)) {
                throw ValidationException::withMessages(['reason' => 'স্ট্যাটাস বাতিল বা ফেরতের ক্ষেত্রে কারণ লিখতে হবে']);
            }

            $archetype = tenant('archetype') ?? 'commerce';

            // স্টক পুনরুদ্ধার (শুধুমাত্র কমার্সের জন্য)
            if ($archetype === 'commerce' && $to->restoresStock()) {
                foreach ($order->items as $item) {
                    if ($item->product_variant_id) {
                        ProductVariant::whereKey($item->product_variant_id)->increment('stock_quantity', $item->quantity);
                    } elseif ($item->product_id) {
                        Product::whereKey($item->product_id)->increment('stock_quantity', $item->quantity);
                    }
                }
            }

            $order->forceFill(['status' => $to])->save();

            $order->histories()->create([
                'from_status' => $from->value,
                'to_status'   => $to->value,
                'reason'      => $reason,
                'changed_by'  => $userId,
            ]);

            return $order;
        });

        // ট্রানজ্যাকশন সফল হওয়ার পর স্বয়ংক্রিয় SMS পাঠানো
        $this->sendStatusSms($updatedOrder, $to, $reason);

        return $updatedOrder;
    }

    /** স্ট্যাটাসভিত্তিক SMS নোটিফিকেশন প্রেরক */
    protected function sendStatusSms(Order $order, OrderStatus $to, ?string $reason = null): void
    {
        $phone = $order->customer_phone;
        $orderNo = $order->order_number;
        $amount = number_format($order->total / 100, 2);
        $archetype = tenant('archetype') ?? 'commerce';

        if ($archetype === 'service') {
            $message = match ($to) {
                OrderStatus::Confirmed => "প্রিয় {$order->customer_name}, আপনার অ্যাপয়েন্টমেন্ট #{$orderNo} কনফার্ম করা হয়েছে। চেম্বার ফি: ৳{$amount}",
                OrderStatus::Cancelled => "দুঃখিত, আপনার অ্যাপয়েন্টমেন্ট #{$orderNo} বাতিল করা হয়েছে।" . ($reason ? " কারণ: {$reason}" : ""),
                default => null,
            };
        } else {
            $message = match ($to) {
                OrderStatus::Confirmed => "প্রিয় {$order->customer_name}, আপনার অর্ডার #{$orderNo} কনফার্ম করা হয়েছে। মোট প্রদেয়: ৳{$amount}",
                OrderStatus::Processing => "আপনার অর্ডার #{$orderNo} প্রসেসিং শুরু হয়েছে। দ্রুতই পার্সেল রেডি করা হচ্ছে।",
                OrderStatus::Shipped => "আপনার অর্ডার #{$orderNo} কুরিয়ারে পাঠানো হয়েছে।" . ($order->tracking_id ? " ট্র্যাকিং আইডি: {$order->tracking_id} ({$order->courier})" : ""),
                OrderStatus::Delivered => "আপনার অর্ডার #{$orderNo} সফলভাবে ডেলিভারি সম্পন্ন হয়েছে। ধন্যবাদ আমাদের সাথে থাকার জন্য!",
                OrderStatus::Cancelled => "দুঃখিত, আপনার অর্ডার #{$orderNo} বাতিল করা হয়েছে।" . ($reason ? " কারণ: {$reason}" : ""),
                OrderStatus::Returned => "আপনার অর্ডার #{$orderNo} রিটার্ন হিসেবে চিহ্নিত হয়েছে।" . ($reason ? " কারণ: {$reason}" : ""),
                default => null,
            };
        }

        if ($message) {
            $this->smsService->send($phone, $message);
        }
    }

    protected function assertNotBlacklisted(array $data): void
    {
        $phone = $data['customer_phone'] ?? '';
        $ip = $data['ip_address'] ?? '';

        $hit = Blacklist::where('type', 'phone')->where('value', $phone)->exists()
            || ($ip && Blacklist::where('type', 'ip')->where('value', $ip)->exists());

        if ($hit) {
            throw ValidationException::withMessages(['customer_phone' => 'এই তথ্য দিয়ে অর্ডার গ্রহণ সম্ভব হচ্ছে না']);
        }
    }

    protected function shippingFee(?string $district): int
    {
        return ($district === 'Dhaka') ? 6000 : 12000; // পয়সায়: ৬০ টাকা = ৬০০০
    }

    protected function nextNumber(string $archetype = 'commerce'): string
    {
        $prefix = ($archetype === 'service') ? 'APT-' : 'ORD-';
        return $prefix . now()->format('Ymd') . '-' . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
    }
}