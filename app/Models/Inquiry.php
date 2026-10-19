<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'contacted' => 'info',
            'closed' => 'success',
            default => 'warning',
        };
    }

    public function getStatusLabelBnAttribute(): string
    {
        return match ($this->status) {
            'contacted' => 'যোগাযোগ করা হয়েছে',
            'closed' => 'সম্পন্ন / ক্লোজড',
            default => 'নতুন ইনকোয়ারি',
        };
    }
}
