<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dispute extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'deadline_at'                => 'datetime',
        'resolved_at'                => 'datetime',
        'escalated_to_superadmin_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Dispute $dispute) {
            if (empty($dispute->ticket_number)) {
                $dispute->ticket_number = 'DSP-' . now()->format('Ymd') . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
            }
            if (empty($dispute->deadline_at)) {
                // Bangladesh Digital Commerce Guideline 2021: 72 hours resolution window
                $dispute->deadline_at = now()->addHours(72);
            }
        });
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function isExpired(): bool
    {
        return $this->status === 'open' && now()->isAfter($this->deadline_at);
    }

    public function getHoursRemainingAttribute(): int
    {
        if ($this->status !== 'open' || empty($this->deadline_at)) {
            return 0;
        }
        return (int) max(0, now()->diffInHours($this->deadline_at, false));
    }
}
