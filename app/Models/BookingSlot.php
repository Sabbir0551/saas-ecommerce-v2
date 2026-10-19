<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingSlot extends Model
{
    protected $guarded = [];

    protected $casts = [
        'day_of_week' => 'integer',
        'capacity' => 'integer',
        'is_active' => 'boolean',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function getDayNameBnAttribute(): string
    {
        $days = [
            0 => 'রবিবার',
            1 => 'সোমবার',
            2 => 'মঙ্গলবার',
            3 => 'বুধবার',
            4 => 'বৃহস্পতিবার',
            5 => 'শুক্রবার',
            6 => 'শনিবার',
        ];

        return $days[$this->day_of_week] ?? '';
    }
}
