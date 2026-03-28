<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $order_id
 * @property string $transaction_id
 * @property string $order_ref
 * @property decimal $amount
 * @property string|null $payment_method
 * @property string $status
 * @property array|null $midtrans_response
 * @property string|null $snap_url
 * @property \Illuminate\Support\Carbon|null $expired_at
 * @property \Illuminate\Support\Carbon|null $settled_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Order $order
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'transaction_id',
        'order_ref',
        'amount',
        'payment_method',
        'status',
        'midtrans_response',
        'snap_url',
        'expired_at',
        'settled_at',
    ];

    protected $casts = [
        'midtrans_response' => 'array',
        'amount' => 'decimal:2',
        'expired_at' => 'datetime',
        'settled_at' => 'datetime',
    ];

    /**
     * Get the user that owns the transaction
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order associated with the transaction
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Check if transaction is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if transaction is settled
     */
    public function isSettled(): bool
    {
        return $this->status === 'settlement';
    }

    /**
     * Check if transaction is denied
     */
    public function isDenied(): bool
    {
        return $this->status === 'deny';
    }

    /**
     * Check if transaction is expired
     */
    public function isExpired(): bool
    {
        return $this->status === 'expire';
    }
}
