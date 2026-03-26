<?php

namespace App\Http\Controllers\Admin;

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
        // Fetch semua messages dari database dengan replies
        $messages = Message::with('replies', 'customer')
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
                    'unread' => $message->replies->where('sender', 'customer')->count(),
                    'messages' => $allMessages->toArray()
                ];
            });

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages
        ]);
    }

    public function createFromWidget(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|min:3|max:5000',
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
            ]);

            // Check if customer already has an open conversation
            $existingMessage = Message::where('customer_email', $validated['customer_email'])
                ->whereIn('status', ['pending', 'responded'])
                ->first();

            if ($existingMessage) {
                // Add reply to existing message
                MessageReply::create([
                    'message_id' => $existingMessage->id,
                    'reply' => $validated['message'],
                    'sender' => 'customer'
                ]);

                return response()->json([
                    'success' => true,
                    'message_id' => $existingMessage->id,
                    'status' => 'added_to_existing'
                ]);
            } else {
                // Create new message
                $message = Message::create([
                    'customer_id' => Auth::id() ?? null, // Include if user is logged in
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'message' => $validated['message'],
                    'status' => 'pending'
                ]);

                return response()->json([
                    'success' => true,
                    'message_id' => $message->id,
                    'status' => 'created'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function store(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'reply' => 'required|string|min:3|max:5000'
            ]);

            $message = Message::findOrFail($id);

            // Create admin reply
            MessageReply::create([
                'message_id' => $message->id,
                'admin_id' => Auth::id(),
                'reply' => $validated['reply'],
                'sender' => 'admin'
            ]);

            // Update status to responded jika masih pending
            if ($message->status === 'pending') {
                $message->update(['status' => 'responded']);
            }

            return back()->with('success', 'Balasan terkirim!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengirim balasan: ' . $e->getMessage());
        }
    }

    public function close(Request $request, $id)
    {
        try {
            $message = Message::findOrFail($id);
            $message->update(['status' => 'closed']);

            return back()->with('success', 'Chat ditutup!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menutup chat: ' . $e->getMessage());
        }
    }

    // Mark customer messages as read
    public function markAsRead(Request $request, $id)
    {
        try {
            $message = Message::findOrFail($id);

            // Mark all customer replies as read for this message
            $message->replies()
                ->where('sender', 'customer')
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

    // Polling endpoint untuk real-time updates
    public function getLatest(Request $request)
    {
        $lastCheck = $request->input('last_check');
        
        $messages = Message::with('replies', 'customer')
            ->when($lastCheck, function ($query) use ($lastCheck) {
                $query->where('updated_at', '>', $lastCheck);
            })
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
                    'unread' => $message->replies->where('sender', 'customer')->count(),
                    'messages' => $allMessages->toArray()
                ];
            });

        return response()->json([
            'success' => true,
            'messages' => $messages->values()->toArray(),
            'timestamp' => now()
        ]);
    }

    // Get chat history untuk user/guest
    public function getHistory(Request $request)
    {
        try {
            $email = $request->query('email');
            
            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email diperlukan'
                ], 400);
            }

            // Cari conversation berdasarkan email
            $message = Message::where('customer_email', $email)
                ->whereIn('status', ['pending', 'responded'])
                ->with('replies')
                ->latest()
                ->first();

            if (!$message) {
                // Belum ada conversation
                return response()->json([
                    'success' => true,
                    'conversation' => null,
                    'messages' => []
                ]);
            }

            // Format messages untuk display
            $allMessages = collect([
                [
                    'id' => 'original_' . $message->id,
                    'sender' => 'customer',
                    'text' => $message->message,
                    'time' => $message->created_at->format('H:i'),
                    'timestamp' => $message->created_at->toIso8601String()
                ]
            ])->concat($message->replies->map(function ($reply) {
                return [
                    'id' => 'reply_' . $reply->id,
                    'sender' => $reply->sender,
                    'text' => $reply->reply,
                    'time' => $reply->created_at->format('H:i'),
                    'timestamp' => $reply->created_at->toIso8601String()
                ];
            }))->sortBy('timestamp')->values();

            return response()->json([
                'success' => true,
                'conversation' => [
                    'id' => $message->id,
                    'customer_name' => $message->customer_name,
                    'customer_email' => $message->customer_email,
                    'status' => $message->status,
                    'messages' => $allMessages->toArray()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Check untuk admin replies (polling dari user)
    public function checkReplies(Request $request)
    {
        try {
            $email = $request->query('email');
            
            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email diperlukan'
                ], 400);
            }

            // Cari latest conversation
            $message = Message::where('customer_email', $email)
                ->whereIn('status', ['pending', 'responded'])
                ->with('replies')
                ->latest()
                ->first();

            if (!$message) {
                return response()->json([
                    'success' => true,
                    'messages' => []
                ]);
            }

            // Format messages
            $allMessages = collect([
                [
                    'id' => 'original_' . $message->id,
                    'sender' => 'customer',
                    'text' => $message->message,
                    'time' => $message->created_at->format('H:i'),
                    'timestamp' => $message->created_at->toIso8601String()
                ]
            ])->concat($message->replies->map(function ($reply) {
                return [
                    'id' => 'reply_' . $reply->id,
                    'sender' => $reply->sender,
                    'text' => $reply->reply,
                    'time' => $reply->created_at->format('H:i'),
                    'timestamp' => $reply->created_at->toIso8601String()
                ];
            }))->sortBy('timestamp')->values();

            return response()->json([
                'success' => true,
                'messages' => [[
                    'id' => $message->id,
                    'customer_name' => $message->customer_name,
                    'customer_email' => $message->customer_email,
                    'status' => $message->status,
                    'messages' => $allMessages->toArray()
                ]]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
