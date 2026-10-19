<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreModule extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_enabled' => 'boolean',
        'settings' => 'array',
    ];

    /**
     * নির্দিষ্ট মডিউল কি সক্রিয় আছে?
     */
    public static function isEnabled(string $key): bool
    {
        return static::where('module_key', $key)->where('is_enabled', true)->exists();
    }
}
