<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'booking_date' => 'date',
        'fee' => 'float',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'confirmed' => 'success',
            'completed' => 'primary',
            'cancelled' => 'danger',
            default => 'warning',
        };
    }

    public function getStatusLabelBnAttribute(): string
    {
        return match ($this->status) {
            'confirmed' => 'অনুমোদিত',
            'completed' => 'সম্পন্ন',
            'cancelled' => 'বাতিল',
            default => 'অপেক্ষমান',
        };
    }
}
