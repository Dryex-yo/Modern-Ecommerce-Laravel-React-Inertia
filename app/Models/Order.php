<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'order_number', 
        'total_price', 
        'status', 
        'shipping_address'
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
}