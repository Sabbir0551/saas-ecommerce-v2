<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'images' => 'array',
        'item_attributes' => 'array',
        'custom_fields' => 'array',
        'seo_metadata' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'float',
        'sale_price' => 'float',
        'stock_quantity' => 'integer',
        'completeness_score' => 'integer',
    ];

    /**
     * ইউটিউব বা ফেসবুক ভিডিও লিঙ্ক থেকে সরাসরি এমবেডযোগ্য iframe URL তৈরি
     */
    public function getEmbedVideoUrlAttribute(): ?string
    {
        if (blank($this->video_url)) {
            return null;
        }

        $url = trim($this->video_url);

        if (str_contains($url, 'youtu.be/')) {
            $parts = explode('youtu.be/', $url);
            $id = explode('?', $parts[1] ?? '')[0];
            return "https://www.youtube.com/embed/{$id}?autoplay=1";
        }

        if (str_contains($url, 'watch?v=')) {
            parse_str(parse_url($url, PHP_URL_QUERY) ?? '', $query);
            $id = $query['v'] ?? null;
            return $id ? "https://www.youtube.com/embed/{$id}?autoplay=1" : null;
        }

        if (str_contains($url, 'facebook.com') || str_contains($url, 'fb.watch')) {
            return "https://www.facebook.com/plugins/video.php?href=" . urlencode($url) . "&show_text=false&autoplay=true";
        }

        return $url;
    }

    /**
     * পণ্যটিতে ভিডিও আছে কিনা যাচাই
     */
    public function getHasVideoAttribute(): bool
    {
        return !empty($this->video_path) || !empty($this->video_url);
    }

    /**
     * ভিডিওর ধরন নির্ধারণ (file অথবা embed)
     */
    public function getVideoTypeAttribute(): ?string
    {
        if (!empty($this->video_path)) {
            return 'file';
        }
        if (!empty($this->video_url)) {
            return 'embed';
        }
        return null;
    }

    /**
     * ভিডিওর চূড়ান্ত প্লেয়ার ইউআরএল
     */
    public function getVideoSourceUrlAttribute(): ?string
    {
        if (!empty($this->video_path)) {
            return asset('storage/' . $this->video_path);
        }
        return $this->embed_video_url;
    }

    /**
     * তথ্য পূর্ণতা স্কোর গণনা (Completeness Meter 0-100%)
     */
    public function calculateCompletenessScore(): int
    {
        $score = 0;

        // ধাপ ১: মৌলিক আবশ্যিক তথ্য (সর্বোচ্চ ৫০ পয়েন্ট)
        if (!blank($this->name)) $score += 15;
        if (!blank($this->price)) $score += 10;
        if (!empty($this->images)) $score += 15;
        if ($this->category_id) $score += 10;

        // বিবরণ
        if (!blank($this->description)) $score += 15;

        // ধাপ ২: প্রিসেট বিশেষ ফিল্ড (সর্বোচ্চ ২০ পয়েন্ট)
        if (!empty($this->item_attributes)) {
            $filledAttrs = count(array_filter($this->item_attributes));
            if ($filledAttrs > 0) {
                $score += min(20, $filledAttrs * 5);
            }
        }

        // ধাপ ৩: এসইও ও কাস্টম ফিল্ড / ভ্যারিয়েন্ট (সর্বোচ্চ ১৫ পয়েন্ট)
        if (!empty($this->seo_metadata['meta_title']) || !empty($this->seo_metadata['meta_description'])) {
            $score += 10;
        }
        if (!blank($this->video_url) || !empty($this->custom_fields)) {
            $score += 5;
        }

        return min(100, $score);
    }

    /**
     * সেভ করার সময় স্বয়ংক্রিয়ভাবে পূর্ণতা স্কোর আপডেট করা
     */
    protected static function booted()
    {
        static::saving(function (Item $item) {
            $item->completeness_score = $item->calculateCompletenessScore();
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_item', 'item_id', 'category_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ItemVariant::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function bookingSlots(): HasMany
    {
        return $this->hasMany(BookingSlot::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_hidden', false);
    }

    public function allReviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getAverageRatingAttribute(): float
    {
        return round((float) $this->reviews()->avg('rating') ?: 5.0, 1);
    }

    public function getTotalReviewsCountAttribute(): int
    {
        return $this->reviews()->count();
    }
}
