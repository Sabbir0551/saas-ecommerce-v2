<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Blacklist;
use App\Models\Item;
use App\Models\ItemVariant;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        protected SmsService $smsService
    ) {}

    /**
     * Create Order with pessimistic inventory locking, duplicate prevention, and archetype adaptation.
     * $items = [['item_id' => 1, 'variant_id' => 2, 'quantity' => 1], ...]
     */
    public function create(array $data, array $items, ?string $idempotencyKey = null): Order
    {
        if ($idempotencyKey && $existing = Order::where('idempotency_key', $idempotencyKey)->first()) {
            return $existing;
        }

        $this->assertNotBlacklisted($data);

        // Normalize items array input to support item_id, product_id, variant_id, item_variant_id
        $normalizedItems = collect($items)->map(function ($item) {
            $itemId = $item['item_id'] ?? $item['product_id'] ?? null;
            $variantId = $item['item_variant_id'] ?? $item['variant_id'] ?? $item['product_variant_id'] ?? null;
            return [
                'item_id'    => $itemId,
                'variant_id' => $variantId,
                'quantity'   => (int) ($item['quantity'] ?? 1),
            ];
        })->filter(fn ($i) => !empty($i['item_id']))->values()->all();

        $archetype = tenant('archetype') ?? 'physical_store';
        $isPhysical = in_array($archetype, ['physical_store', 'commerce', 'food_menu'], true);
        $isService  = in_array($archetype, ['service_booking', 'service'], true);
        $isListing  = in_array($archetype, ['listing_inquiry', 'lead_gen', 'lead'], true);

        $order = DB::transaction(function () use ($data, $normalizedItems, $idempotencyKey, $archetype, $isPhysical, $isService, $isListing) {
            $subtotal = 0;
            $lines = [];
            $useItemModel = Schema::hasTable('items');

            $itemIds = collect($normalizedItems)->pluck('item_id')->filter()->sort()->values();
            $variantIds = collect($normalizedItems)->pluck('variant_id')->filter()->sort()->values();

            // Load records with pessimistic locking
            if ($useItemModel) {
                $catalogItems = Item::whereIn('id', $itemIds)->lockForUpdate()->get()->keyBy('id');
                $catalogVariants = ItemVariant::whereIn('id', $variantIds)->lockForUpdate()->get()->keyBy('id');
            } else {
                $catalogItems = Product::whereIn('id', $itemIds)->lockForUpdate()->get()->keyBy('id');
                $catalogVariants = ProductVariant::whereIn('id', $variantIds)->lockForUpdate()->get()->keyBy('id');
            }

            $allReadyToShip = true;

            foreach ($normalizedItems as $row) {
                $record = $catalogItems[$row['item_id']] ?? null;
                $variant = !empty($row['variant_id']) ? ($catalogVariants[$row['variant_id']] ?? null) : null;
                $qty = (int) $row['quantity'];

                if (!$record || !$record->is_active || $qty < 1) {
                    throw ValidationException::withMessages(['items' => 'অবৈধ প্রোডাক্ট সিলেক্ট করা হয়েছে']);
                }

                // Check ready-to-ship status
                if ($useItemModel && isset($record->is_ready_to_ship) && !$record->is_ready_to_ship) {
                    $allReadyToShip = false;
                }

                if ($variant) {
                    if ($isPhysical && $variant->stock_quantity < $qty) {
                        throw ValidationException::withMessages([
                            'items' => "{$record->name} ({$variant->title})-এর পর্যাপ্ত স্টক নেই",
                        ]);
                    }

                    $unitPrice = (int) round(($variant->price ?: ($record->sale_price ?: $record->price)) * 100);

                    if ($isPhysical) {
                        $variant->decrement('stock_quantity', $qty);
                    }
                } else {
                    if ($isPhysical && $record->stock_quantity < $qty) {
                        throw ValidationException::withMessages([
                            'items' => "{$record->name}-এর পর্যাপ্ত স্টক নেই",
                        ]);
                    }

                    $unitPrice = (int) round(($record->sale_price ?: $record->price) * 100);

                    if ($isPhysical) {
                        $record->decrement('stock_quantity', $qty);
                    }
                }

                $lineTotal = $unitPrice * $qty;
                $subtotal += $lineTotal;

                $lines[] = [
                    'item_id'            => $useItemModel ? $record->id : null,
                    'item_variant_id'    => ($useItemModel && $variant) ? $variant->id : null,
                    'product_id'         => $record->id,
                    'product_variant_id' => $variant?->id,
                    'product_name'       => $record->name,
                    'variant'            => $variant?->title,
                    'unit_price'         => $unitPrice,
                    'quantity'           => $qty,
                    'line_total'         => $lineTotal,
                ];
            }

            // Shipping Calculation
            $shipping = $isPhysical ? $this->shippingFee($data['district'] ?? null) : 0;
            $discount = 0;
            $total = max(0, $subtotal - $discount + $shipping);

            // Digital Commerce Guideline: Check if advance limit of 10% applies
            $category = tenant('business_category') ?? 'default';
            $isCustomMade = in_array($category, ['tailors', 'furniture', 'printing_press'], true) || !$allReadyToShip;
            $advanceAllowed = $isCustomMade ? 10 : 100;

            $paymentMethod = $data['payment_method'] ?? 'cod';
            $paidAt = in_array($paymentMethod, ['bkash', 'sslcommerz'], true) ? now() : null;
            $handoverDeadline = $paidAt ? now()->addHours(48) : null;

            $order = Order::create([
                ...$data,
                'idempotency_key'         => $idempotencyKey,
                'order_number'            => $this->nextNumber($archetype),
                'subtotal'                => $subtotal,
                'discount'                => $discount,
                'shipping_fee'            => $shipping,
                'is_ready_to_ship'        => !$isCustomMade,
                'advance_percent_allowed' => $advanceAllowed,
                'paid_at'                 => $paidAt,
                'handover_deadline_at'    => $handoverDeadline,
            ]);

            $order->forceFill([
                'total'  => $total,
                'status' => OrderStatus::Pending,
            ])->save();

            $order->items()->createMany($lines);

            $order->histories()->create([
                'from_status' => null,
                'to_status'   => OrderStatus::Pending->value,
                'reason'      => $isService 
                    ? 'Initial appointment booking placed' 
                    : ($isListing ? 'Initial property / vehicle inquiry submitted' : 'Initial order placed'),
            ]);

            return $order;
        });

        // Trigger transactional confirmation SMS
        $amountFormatted = number_format($order->total / 100, 2);
        if ($isService) {
            $smsText = "প্রিয় {$order->customer_name}, আপনার অ্যাপয়েন্টমেন্ট #{$order->order_number} সফলভাবে গৃহীত হয়েছে। ফি: ৳{$amountFormatted}। চেম্বারে উপস্থিত হওয়ার জন্য অনুরোধ করা হচ্ছে।";
        } elseif ($isListing) {
            $smsText = "প্রিয় {$order->customer_name}, আপনার ইনকোয়ারি #{$order->order_number} সফলভাবে জমা হয়েছে। শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।";
        } else {
            $smsText = "প্রিয় {$order->customer_name}, আপনার অর্ডার #{$order->order_number} সফলভাবে গৃহীত হয়েছে। মোট বিল: ৳{$amountFormatted}";
        }

        $this->smsService->send($order->customer_phone, $smsText);

        return $order;
    }

    /**
     * Change order status with audit history, stock restoration, and compliance timestamp tracking.
     */
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

            $archetype = tenant('archetype') ?? 'physical_store';
            $isPhysical = in_array($archetype, ['physical_store', 'commerce', 'food_menu'], true);
            $useItemModel = Schema::hasTable('items');

            // Inventory restoration on Cancelled or Returned
            if ($isPhysical && $to->restoresStock()) {
                foreach ($order->items as $orderItem) {
                    if ($useItemModel && $orderItem->item_variant_id) {
                        ItemVariant::whereKey($orderItem->item_variant_id)->increment('stock_quantity', $orderItem->quantity);
                    } elseif ($useItemModel && $orderItem->item_id) {
                        Item::whereKey($orderItem->item_id)->increment('stock_quantity', $orderItem->quantity);
                    } elseif ($orderItem->product_variant_id) {
                        ProductVariant::whereKey($orderItem->product_variant_id)->increment('stock_quantity', $orderItem->quantity);
                    } elseif ($orderItem->product_id) {
                        Product::whereKey($orderItem->product_id)->increment('stock_quantity', $orderItem->quantity);
                    }
                }
            }

            // Compliance timestamps
            $extraFills = ['status' => $to];
            if ($to === OrderStatus::Shipped && empty($order->courier_handed_over_at)) {
                $extraFills['courier_handed_over_at'] = now();
            }

            if ($to === OrderStatus::Cancelled && str_contains(strtolower((string) $reason), 'supply')) {
                $extraFills['cannot_supply_at'] = now();
                $extraFills['refund_deadline_at'] = now()->addHours(72);
            }

            $order->forceFill($extraFills)->save();

            $order->histories()->create([
                'from_status' => $from->value,
                'to_status'   => $to->value,
                'reason'      => $reason,
                'changed_by'  => $userId,
            ]);

            return $order;
        });

        // Trigger SMS notification
        $this->sendStatusSms($updatedOrder, $to, $reason);

        return $updatedOrder;
    }

    /**
     * Mark order as "Cannot Supply" and initiate 72h refund protocol per Digital Commerce Guidelines 2021.
     */
    public function markCannotSupply(Order $order, string $reason, ?int $userId = null): Order
    {
        return DB::transaction(function () use ($order, $reason, $userId) {
            $order->forceFill([
                'cannot_supply_at'   => now(),
                'refund_deadline_at' => now()->addHours(72),
                'status'             => OrderStatus::Cancelled,
            ])->save();

            $order->histories()->create([
                'from_status' => $order->status->value,
                'to_status'   => OrderStatus::Cancelled->value,
                'reason'      => "Cannot supply goods: {$reason} (72h refund timeline initiated)",
                'changed_by'  => $userId,
            ]);

            $smsText = "প্রিয় {$order->customer_name}, দুঃখিত যে পণ্য সরবরাহ সম্ভব হচ্ছে না ({$reason})। আপনার প্রদত্ত অগ্রিম টাকা আগামী ৭২ ঘণ্টার মধ্যে ফেরত দেওয়া হবে। অর্ডার #{$order->order_number}";
            $this->smsService->send($order->customer_phone, $smsText);

            return $order;
        });
    }

    /**
     * Send status-based transactional SMS notifications.
     */
    protected function sendStatusSms(Order $order, OrderStatus $to, ?string $reason = null): void
    {
        $phone = $order->customer_phone;
        $orderNo = $order->order_number;
        $amount = number_format($order->total / 100, 2);
        $archetype = tenant('archetype') ?? 'physical_store';
        $isService = in_array($archetype, ['service_booking', 'service'], true);

        if ($isService) {
            $message = match ($to) {
                OrderStatus::Confirmed => "প্রিয় {$order->customer_name}, আপনার অ্যাপয়েন্টমেন্ট #{$orderNo} কনফার্ম করা হয়েছে। চেম্বার ফি: ৳{$amount}",
                OrderStatus::Cancelled => "দুঃখিত, আপনার অ্যাপয়েন্টমেন্ট #{$orderNo} বাতিল করা হয়েছে।" . ($reason ? " কারণ: {$reason}" : ""),
                default => null,
            };
        } else {
            $message = match ($to) {
                OrderStatus::Confirmed  => "প্রিয় {$order->customer_name}, আপনার অর্ডার #{$orderNo} কনফার্ম করা হয়েছে। মোট প্রদেয়: ৳{$amount}",
                OrderStatus::Processing => "আপনার অর্ডার #{$orderNo} প্রসেসিং শুরু হয়েছে। দ্রুতই পার্সেল রেডি করা হচ্ছে।",
                OrderStatus::Shipped    => "আপনার অর্ডার #{$orderNo} কুরিয়ারে পাঠানো হয়েছে।" . ($order->tracking_id ? " ট্র্যাকিং আইডি: {$order->tracking_id} ({$order->courier})" : ""),
                OrderStatus::Delivered  => "আপনার অর্ডার #{$orderNo} সফলভাবে ডেলিভারি সম্পন্ন হয়েছে। ধন্যবাদ আমাদের সাথে থাকার জন্য!",
                OrderStatus::Cancelled  => "দুঃখিত, আপনার অর্ডার #{$orderNo} বাতিল করা হয়েছে।" . ($reason ? " কারণ: {$reason}" : ""),
                OrderStatus::Returned   => "আপনার অর্ডার #{$orderNo} রিটার্ন হিসেবে চিহ্নিত হয়েছে।" . ($reason ? " কারণ: {$reason}" : ""),
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
        // Inside Dhaka: 60 BDT = 6000 paisa, Outside Dhaka: 120 BDT = 12000 paisa
        return (is_string($district) && str_contains(strtolower($district), 'dhaka') && !str_contains(strtolower($district), 'outside')) 
            ? 6000 
            : 12000;
    }

    protected function nextNumber(string $archetype = 'physical_store'): string
    {
        $isService = in_array($archetype, ['service_booking', 'service'], true);
        $isListing = in_array($archetype, ['listing_inquiry', 'lead_gen', 'lead'], true);

        $prefix = $isService ? 'APT-' : ($isListing ? 'INQ-' : 'ORD-');
        return $prefix . now()->format('Ymd') . '-' . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
    }
}