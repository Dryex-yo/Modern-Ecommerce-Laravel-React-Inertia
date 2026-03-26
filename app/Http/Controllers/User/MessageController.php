<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\MessageReply;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        // Get all messages for the logged-in user
        $user = Auth::user();
        
        $messages = Message::where('customer_id', $user->id)
            ->with('replies')
            ->latest()
            ->get()
            ->map(function ($message) {
                // Combine original message dengan replies
                $allMessages = collect([
                    [
                        'id' => 'original_' . $message->id,
                        'sender' => 'customer',
                        'text' => $message->message,
                        'time' => $message->created_at->format('H:i'),
                        'timestamp' => $message->created_at->toIso8601String(),
                        'created_at' => $message->created_at
                    ]
                ])->concat($message->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'sender' => $reply->sender,
                        'text' => $reply->reply,
                        'time' => $reply->created_at->format('H:i'),
                        'timestamp' => $reply->created_at->toIso8601String(),
                        'is_read' => $reply->is_read,
                        'created_at' => $reply->created_at
                    ];
                }))->sortBy('created_at')->values();

                return [
                    'id' => $message->id,
                    'customer_id' => $message->customer_id,
                    'customer_name' => $message->customer_name,
                    'customer_email' => $message->customer_email,
                    'status' => $message->status,
                    'last_message' => $message->message,
                    'timestamp' => $message->created_at->diffForHumans(),
                    'unread' => $message->replies->where('sender', 'admin')->where('is_read', false)->count(),
                    'messages' => $allMessages->toArray()
                ];
            });

        return Inertia::render('User/Messages/Index', [
            'messages' => $messages
        ]);
    }

    public function store(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $message = Message::where('id', $id)
                ->where('customer_id', $user->id)
                ->firstOrFail();

            $validated = $request->validate([
                'reply' => 'required|string|min:3|max:5000'
            ]);

            // Create customer reply
            MessageReply::create([
                'message_id' => $message->id,
                'reply' => $validated['reply'],
                'sender' => 'customer',
                'is_read' => false
            ]);

            // Update status ke responded jika masih pending
            if ($message->status === 'pending') {
                $message->update(['status' => 'responded']);
            }

            return back()->with('success', 'Balasan terkirim!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengirim balasan: ' . $e->getMessage());
        }
    }

    // Mark admin replies as read
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $message = Message::where('id', $id)
                ->where('customer_id', $user->id)
                ->firstOrFail();

            // Mark all admin replies as read for this message
            $message->replies()
                ->where('sender', 'admin')
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 422);
        }
    }

    // Get latest messages untuk polling real-time
    public function getLatest(Request $request)
    {
        $user = Auth::user();
        
        $messages = Message::where('customer_id', $user->id)
            ->with('replies')
            ->latest()
            ->get()
            ->map(function ($message) {
                $allMessages = collect([
                    [
                        'id' => 'original_' . $message->id,
                        'sender' => 'customer',
                        'text' => $message->message,
                        'timestamp' => $message->created_at->toIso8601String(),
                        'created_at' => $message->created_at
                    ]
                ])->concat($message->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'sender' => $reply->sender,
                        'text' => $reply->reply,
                        'timestamp' => $reply->created_at->toIso8601String(),
                        'is_read' => $reply->is_read,
                        'created_at' => $reply->created_at
                    ];
                }))->sortBy('created_at')->values();

                return [
                    'id' => $message->id,
                    'customer_id' => $message->customer_id,
                    'customer_name' => $message->customer_name,
                    'customer_email' => $message->customer_email,
                    'status' => $message->status,
                    'last_message' => $message->message,
                    'timestamp' => $message->created_at->diffForHumans(),
                    'unread' => $message->replies->where('sender', 'admin')->where('is_read', false)->count(),
                    'messages' => $allMessages->toArray()
                ];
            });

        return response()->json([
            'success' => true,
            'messages' => $messages->values()->toArray(),
            'timestamp' => now()
        ]);
    }

    // Get unread count untuk notification badge
    public function getUnreadCount()
    {
        $user = Auth::user();

        $unreadCount = Message::where('customer_id', $user->id)
            ->whereHas('replies', function ($query) {
                $query->where('sender', 'admin')->where('is_read', false);
            })
            ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount
        ]);
    }
}
