<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Product মডেলটি এখন ইউনিফাইড Item মডেলের উপর ভিত্তি করে কাজ করে।
 * এতে কোনো ব্রেকিং চেঞ্জ ছাড়াই পুরাতন কোড ও অর্ডারসমূহ স্বয়ংক্রিয়ভাবে কাজ করবে।
 */
class Product extends Item
{
    protected $table = 'items';

    /**
     * পূর্বের 'specs' এক্সেসরকে নতুন 'item_attributes' এর সাথে সিন্ক করা
     */
    public function getSpecsAttribute()
    {
        return $this->item_attributes;
    }

    public function setSpecsAttribute($value)
    {
        $this->attributes['item_attributes'] = is_array($value) ? json_encode($value) : $value;
    }

    /**
     * ভ্যারিয়েন্ট রিলেশনশিপ (ব্যাকওয়ার্ড কম্প্যাটিবিলিটি)
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ItemVariant::class, 'item_id');
    }

    /**
     * ক্যাটাগরি রিলেশনশিপ (ব্যাকওয়ার্ড কম্প্যাটিবিলিটি)
     */
    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_item', 'item_id', 'category_id');
    }
}