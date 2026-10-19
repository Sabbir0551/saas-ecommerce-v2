<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'status' => OrderStatus::class,
        'payment_status' => PaymentStatus::class,
    ];

    protected static function booted(): void
    {
        static::saving(function (Order $order) {
            // যদি subtotal বা shipping_fee নাল থাকে, ডিফল্ট ০
            $order->subtotal = $order->subtotal ?? 0;
            $order->shipping_fee = $order->shipping_fee ?? 6000;
            $order->discount = $order->discount ?? 0;

            // total সবসময় নিশ্চিত করা
            if (empty($order->total) || $order->total == 0) {
                $order->total = max(0, ($order->subtotal + $order->shipping_fee) - $order->discount);
            }

            if (empty($order->status)) {
                $order->status = OrderStatus::Pending;
            }
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeFilter(Builder $q, array $f): Builder
    {
        return $q
            ->when($f['status'] ?? null, fn ($q, $v) => $q->where('status', $v))
            ->when($f['payment_status'] ?? null, fn ($q, $v) => $q->where('payment_status', $v))
            ->when($f['district'] ?? null, fn ($q, $v) => $q->where('district', $v))
            ->when($f['from'] ?? null, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($f['to'] ?? null, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($f['q'] ?? null, function ($q, $v) {
                $q->where(function ($q) use ($v) {
                    $q->where('order_number', 'like', "{$v}%")
                      ->orWhere('customer_phone', 'like', "{$v}%")
                      ->orWhere('customer_name', 'like', "%{$v}%");
                });
            });
    }
}