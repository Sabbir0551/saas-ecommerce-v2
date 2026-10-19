<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends ItemVariant
{
    protected $table = 'item_variants';

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'item_id');
    }

    public function getProductIdAttribute()
    {
        return $this->item_id;
    }

    public function setProductIdAttribute($value)
    {
        $this->attributes['item_id'] = $value;
    }
}