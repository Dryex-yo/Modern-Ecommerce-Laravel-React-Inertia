import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const TimestampDisplay = ({ timestamp }) => {
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
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, [timestamp]);

    return <span>{displayTime || '...'}</span>;
};

export default function ChatWidget() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [customerEmail, setCustomerEmail] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [chatStatus, setChatStatus] = useState('open');

    // Load history messages when widget opens
    useEffect(() => {
        if (isOpen) {
            loadChatHistory();
        }
    }, [isOpen]);

    // Polling untuk admin replies
    useEffect(() => {
        if (!isOpen || !conversationId || !customerEmail) return;

        const pollReplies = async () => {
            try {
                const response = await fetch(`/api/messages/check-replies?email=${encodeURIComponent(customerEmail)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.messages && data.messages.length > 0) {
                        const conversationData = data.messages[0];
                        
                        // Check status
                        if (conversationData?.status) {
                            setChatStatus(conversationData.status);
                        }
                        
                        // Find new messages/replies
                        const newMessages = conversationData?.messages || [];
                        setMessages(prev => {
                            // Create a Set of existing message texts to avoid duplicates
                            const existingTexts = new Set(prev.map(m => m.text));
                            const existingIds = new Set(prev.map(m => m.id));
                            
                            // Only add messages that:
                            // 1. Don't have matching ID (from backend)
                            // 2. Don't have exact same text (to avoid duplicates from loadChatHistory)
                            const newOnes = newMessages.filter(m => 
                                !existingIds.has(m.id) && !existingTexts.has(m.text)
                            );
                            
                            return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
                        });
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        const interval = setInterval(pollReplies, 2000); // Poll setiap 2 detik untuk real-time
        return () => clearInterval(interval);
    }, [isOpen, conversationId, customerEmail]);

    const loadChatHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const email = auth?.user?.email || localStorage.getItem('guestEmail') || 'guest@example.com';
            setCustomerEmail(email);

            const response = await fetch(`/api/messages/history?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.conversation) {
                    setConversationId(data.conversation.id);
                    
                    // Capture status
                    if (data.conversation.status) {
                        setChatStatus(data.conversation.status);
                    }
                    
                    // Format messages untuk ditampilkan
                    const formattedMessages = data.conversation.messages || [];
                    if (formattedMessages.length === 0) {
                        // Greeting jika belum ada messages
                        setMessages([{
                            id: 'greeting',
                            text: 'Halo! 👋 Ada yang bisa kami bantu?',
                            sender: 'bot',
                            timestamp: new Date()
                        }]);
                    } else {
                        setMessages(formattedMessages);
                    }
                } else {
                    // Baru pertama kali
                    setMessages([{
                        id: 'greeting',
                        text: 'Halo! 👋 Ada yang bisa kami bantu?',
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                }
            }
        } catch (error) {
            console.error('Error loading history:', error);
            setMessages([{
                id: 'greeting',
                text: 'Halo! 👋 Ada yang bisa kami bantu?',
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoadingHistory(false);
        }
    };;

    const handleSendMessage = async () => {
        if (inputValue.trim()) {
            const userMessageText = inputValue;
            
            setInputValue('');
            setIsLoading(true);

            try {
                // Get CSRF token
                let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                
                if (!token && typeof window !== 'undefined' && window.Laravel) {
                    token = window.Laravel.csrfToken;
                }

                if (!token) {
                    throw new Error('CSRF token tidak ditemukan. Refresh halaman dan coba lagi.');
                }

                const endpoint = route('messages.create-from-widget');
                
                const email = auth?.user?.email || customerEmail || 'guest@example.com';
                const name = auth?.user?.name || localStorage.getItem('guestName') || 'Guest User';

                // Store untuk guest
                if (!auth?.user) {
                    localStorage.setItem('guestEmail', email);
                    localStorage.setItem('guestName', name);
                }
                
                const payload = {
                    message: userMessageText,
                    customer_name: name,
                    customer_email: email,
                };
                
                // Submit message ke backend
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': token,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                const responseData = await response.json();

                if (response.ok && responseData.success) {
                    setConversationId(responseData.message_id);
                    setCustomerEmail(email);

                    // Load fresh messages from backend setelah send
                    await loadChatHistory();
                    
                    if (responseData.status === 'created') {
                        // Hanya tampilkan pesan penerimaan untuk conversation baru
                        setMessages(prev => [...prev, {
                            id: `bot_${Date.now()}`,
                            text: 'Pesan Anda telah diterima! 📨 Admin kami akan segera merespon.',
                            sender: 'bot',
                            timestamp: new Date()
                        }]);
                    }
                    setIsLoading(false);
                } else {
                    const errorMsg = responseData.error || responseData.message || 'Gagal mengirim pesan';
                    throw new Error(errorMsg);
                }
            } catch (error) {
                console.error('❌ Error:', error.message);
                setMessages(prev => [...prev, {
                    id: `error_${Date.now()}`,
                    text: `Maaf, ada kesalahan: ${error.message}`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-lg shadow-blue-200 flex items-center justify-center hover:scale-110 transition-all active:scale-95 z-40 animate-bounce"
            >
                <MessageCircle size={28} fill="currentColor" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-80' : 'w-96'}`}>
            {/* Chat Container */}
            <div className={`bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col transition-all ${isMinimized ? 'h-auto' : 'h-[600px]'}`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-tight">Live Chat Support</h3>
                        <p className="text-[9px] text-blue-100 font-bold mt-1">Powered by AI • Admin Assistant</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white custom-scrollbar">
                            {isLoadingHistory ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin">
                                        <MessageCircle size={32} className="text-slate-300" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {chatStatus === 'closed' && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                                            <p className="text-[11px] font-bold text-amber-700 text-center">
                                                ℹ️ Percakapan ini telah ditutup oleh admin
                                            </p>
                                        </div>
                                    )}
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' || msg.sender === 'customer' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                                        >
                                            <div
                                                className={`max-w-xs px-4 py-3 rounded-2xl ${
                                                    msg.sender === 'user' || msg.sender === 'customer'
                                                        ? 'bg-blue-600 text-white rounded-br-none'
                                                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                                }`}
                                            >
                                                <p className="text-[12px] font-medium leading-relaxed">{msg.text}</p>
                                                <p className={`text-[9px] font-bold mt-1 ${msg.sender === 'user' || msg.sender === 'customer' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    <TimestampDisplay timestamp={msg.timestamp || msg.created_at} />
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-none">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {chatStatus === 'closed' ? (
                            <div className="p-4 border-t border-amber-200 bg-amber-50 text-center">
                                <p className="text-[10px] font-black text-amber-700 uppercase">
                                    Chat Ditutup
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 border-t border-slate-100 bg-white">
                                <div className="flex gap-2">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Tulis pesan Anda..."
                                        rows="2"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-[12px] font-medium resize-none disabled:opacity-50"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold mt-2 text-center">
                                    💬 Respons rata-rata dalam 5 menit
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
