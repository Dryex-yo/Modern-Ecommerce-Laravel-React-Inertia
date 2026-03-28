<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * @property int $id
 * @property int $user_id
 * @property string $order_number
 * @property numeric $total_price
 * @property string $status
 * @property string $shipping_address
 * @property string|null $shipping_method
 * @property numeric $shipping_cost
 * @property string|null $payment_method
 * @property string|null $tracking_number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $items
 * @property-read int|null $items_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereOrderNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereShippingAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereShippingCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereShippingMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereTotalPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereTrackingNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereUserId($value)
 * @mixin \Eloquent
 */
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'order_number', 
        'total_price', 
        'status', 
        'shipping_address',
        'shipping_method',
        'shipping_cost',
        'payment_method',
        'tracking_number'
    ];

    // Relasi: Order ini milik siapa?
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Satu order punya banyak item barang
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relasi: Satu order punya banyak transaksi pembayaran
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}