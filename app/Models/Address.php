<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'full_address',
        'city',
        'postal_code',
        'is_default',
    ];

    /**
     * Relasi balik ke User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}