<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $message_id
 * @property int|null $admin_id
 * @property string $reply
 * @property bool $is_read
 * @property string $sender
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $admin
 * @property-read \App\Models\Message $message
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereMessageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereReply($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereSender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageReply whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MessageReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'admin_id',
        'reply',
        'sender',
        'is_read'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
