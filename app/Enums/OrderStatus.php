<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending    = 'pending';
    case Confirmed  = 'confirmed';
    case Processing = 'processing';
    case Shipped    = 'shipped';
    case Delivered  = 'delivered';
    case Cancelled  = 'cancelled';
    case Returned   = 'returned';

    /** কোন স্ট্যাটাস থেকে কোনটিতে যাওয়া যাবে */
    public function allowedNext(): array
    {
        return match ($this) {
            self::Pending    => [self::Confirmed, self::Cancelled],
            self::Confirmed  => [self::Processing, self::Cancelled],
            self::Processing => [self::Shipped, self::Cancelled],
            self::Shipped    => [self::Delivered, self::Returned],
            self::Delivered  => [self::Returned],
            self::Cancelled, self::Returned => [],
        };
    }

    public function canMoveTo(self $to): bool
    {
        return in_array($to, $this->allowedNext(), true);
    }

    /** বাতিল বা ফেরত হলে কারণ উল্লেখ বাধ্যতামূলক */
    public function requiresReason(): bool
    {
        return in_array($this, [self::Cancelled, self::Returned], true);
    }

    /** স্টক ফেরত দেওয়ার নিয়ম */
    public function restoresStock(): bool
    {
        return in_array($this, [self::Cancelled, self::Returned], true);
    }
}