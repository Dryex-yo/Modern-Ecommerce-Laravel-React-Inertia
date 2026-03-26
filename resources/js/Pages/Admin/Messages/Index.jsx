import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { MessageSquare, Send, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const TimeDisplay = ({ timestamp }) => {
    const [displayTime, setDisplayTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            if (!timestamp) return;
            
            const msgTime = new Date(timestamp);
            const now = new Date();
            const diffMinutes = Math.floor((now - msgTime) / 60000);
            
            if (diffMinutes < 1) {
                setDisplayTime('Baru saja');
            } else if (diffMinutes < 60) {
                setDisplayTime(`${diffMinutes}m lalu`);
            } else {
                setDisplayTime(msgTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 30000); // Update setiap 30 detik
        return () => clearInterval(interval);
    }, [timestamp]);

    return <span>{displayTime || 'Sedang dimuat...'}</span>;
};

export default function MessagesIndex() {
    const { auth } = usePage().props;
    const { messages: initialMessages } = usePage().props;
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState(initialMessages || []);
    const [isPolling, setIsPolling] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        reply: ''
    });

    // Polling untuk real-time updates
    useEffect(() => {
        const pollMessages = async () => {
            try {
                const response = await fetch(route('messages.get-latest'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.messages && result.messages.length > 0) {
                        // Update messages dengan smart merge
                        setMessages(prevMessages => {
                            return result.messages.map(newMsg => {
                                const existingMsg = prevMessages.find(m => m.id === newMsg.id);
                                if (existingMsg) {
                                    // Merge replies jika ada perubahan
                                    return {
                                        ...existingMsg,
                                        ...newMsg,
                                        messages: newMsg.messages // Always update messages array
                                    };
                                }
                                return newMsg;
                            });
                        });
                        
                        // If current selected chat is updated, refresh it
                        if (selectedChat) {
                            const updated = result.messages.find(m => m.id === selectedChat);
                            if (updated) {
                                // Keep selection valid if chat still exists
                                setSelectedChat(selectedChat);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        const interval = setInterval(pollMessages, 2000); // Poll setiap 2 detik untuk real-time
        return () => clearInterval(interval);
    }, [selectedChat]);

    // Mark as read when opening chat
    useEffect(() => {
        if (selectedChat) {
            fetch(route('admin.messages.mark-as-read', selectedChat), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                }
            }).catch(console.error);
        }
    }, [selectedChat]);

    const activeChat = selectedChat ? messages.find(c => c.id === selectedChat) : null;

    const handleSendReply = (e) => {
        e.preventDefault();
        
        if (data.reply.trim() && activeChat) {
            post(route('admin.messages.store', activeChat.id), {
                onSuccess: () => {
                    setData('reply', '');
                    // Don't reload - let polling handle it
                    // Just keep the chat selected and let polling update messages
                }
            });
        }
    };

    const handleCloseChat = () => {
        if (activeChat && confirm('Yakin ingin menutup percakapan ini?')) {
            post(route('admin.messages.close', activeChat.id), {
                onSuccess: () => {
                    setSelectedChat(null);
                    // Don't reload - let polling handle it
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase">
                    <Clock size={12} /> Menunggu
                </span>;
            case 'responded':
                return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase">
                    Di Respon
                </span>;
            case 'closed':
                return <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">
                    ✓ Selesai
                </span>;
            default:
                return null;
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Messages - Customer Support" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chat List */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-800 uppercase">Conversations</h3>
                            <button
                                onClick={() => window.location.reload()}
                                title="Refresh"
                                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                            >
                                <RefreshCw size={18} className="text-slate-600" />
                            </button>
                        </div>
                        
                        {messages.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 text-[10px] font-bold uppercase">Belum ada pesan</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {messages.map((chat) => {
                                    // Count unread customer messages (from polling updates)
                                    const unreadCount = chat.messages?.filter(m => 
                                        m.sender === 'customer' && !m.is_read
                                    ).length || 0;
                                    
                                    return (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat.id)}
                                        className={`w-full p-4 rounded-[1.5rem] transition-all text-left border-2 ${
                                            selectedChat === chat.id
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="font-black text-slate-800 text-[12px] truncate">{chat.customer_name}</p>
                                                <p className="text-slate-600 text-[10px] font-medium mt-1 line-clamp-1">{chat.last_message}</p>
                                                <p className="text-slate-400 text-[9px] font-bold mt-2">{chat.customer_email}</p>
                                            </div>
                                            {unreadCount > 0 && (
                                                <span className="flex-shrink-0 w-5 h-5 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-[9px] font-bold mt-2">{chat.timestamp}</p>
                                    </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Detail */}
                <div className="lg:col-span-2">
                    {activeChat ? (
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black uppercase">{activeChat.customer_name}</h3>
                                    <p className="text-[10px] text-blue-100 font-bold mt-1">{activeChat.customer_email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(activeChat.status)}
                                    {activeChat.status !== 'closed' && (
                                        <button
                                            onClick={handleCloseChat}
                                            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[9px] font-black uppercase transition-all"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white custom-scrollbar">
                                {activeChat.messages && activeChat.messages.length > 0 ? (
                                    activeChat.messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}
                                        >
                                            <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                                                msg.sender === 'customer'
                                                    ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                                                    : 'bg-blue-600 text-white rounded-tr-none'
                                            }`}>
                                                <p className="text-[12px] font-medium">{msg.text}</p>
                                                <p className={`text-[9px] font-bold mt-1 ${msg.sender === 'customer' ? 'text-slate-400' : 'text-blue-100'}`}>
                                                    <TimeDisplay timestamp={msg.timestamp || msg.created_at} />
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-[10px] font-bold text-center">Belum ada pesan</p>
                                )}
                            </div>

                            {/* Input Area */}
                            {activeChat.status !== 'closed' ? (
                                <form onSubmit={handleSendReply} className="p-6 border-t border-slate-100 bg-white">
                                    <div className="flex gap-3">
                                        <textarea
                                            value={data.reply}
                                            onChange={(e) => setData('reply', e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply(e);
                                                }
                                            }}
                                            placeholder="Tulis balasan..."
                                            rows="2"
                                            disabled={processing}
                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-[12px] font-medium resize-none disabled:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    {errors.reply && <p className="text-red-600 text-[10px] font-bold mt-2">{errors.reply}</p>}
                                </form>
                            ) : (
                                <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-emerald-700 text-center text-[10px] font-bold uppercase">
                                    ✓ Percakapan Ini Telah Ditutup
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm h-[700px] flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                                <MessageSquare size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-bold text-[12px] uppercase tracking-widest">
                                Pilih percakapan untuk memulai
                            </p>
                            {messages.length === 0 && (
                                <p className="text-slate-400 text-[10px] font-medium mt-4">Atau tunggu customer mengirim pesan...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
