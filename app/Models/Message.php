<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $customer_id
 * @property string $customer_name
 * @property string $customer_email
 * @property string $message
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $customer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MessageReply> $replies
 * @property-read int|null $replies_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCustomerEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'customer_name',
        'customer_email',
        'message',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function replies()
    {
        return $this->hasMany(MessageReply::class)->oldest();
    }
}
