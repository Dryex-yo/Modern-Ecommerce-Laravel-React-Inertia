import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingBag, LogOut, Home, User, ShoppingCart, ChevronDown, Settings, Shield, Sparkles, MessageCircle } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';
import ChatWidget from '@/Components/ChatWidget';

export default function UserLayout({ children }) {
    // Ambil user langsung dari usePage().props.auth agar selalu sinkron dengan state global
    const { auth, settings, cart_count } = usePage().props;
    const user = auth.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    // Polling untuk unread message count
    useEffect(() => {
        if (!user?.id) return;

        const checkUnreadMessages = async () => {
            try {
                const response = await fetch(route('user.messages.unread-count'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setUnreadMessages(result.unread_count);
                    }
                }
            } catch (error) {
                console.error('Error checking unread messages:', error);
            }
        };

        checkUnreadMessages();
        const interval = setInterval(checkUnreadMessages, 3000); // Check setiap 3 detik
        return () => clearInterval(interval);
    }, [user?.id]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            {/* --- TOP NAVBAR --- */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-16 py-4 flex justify-between items-center sticky top-0 z-50">
                
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6 overflow-hidden">
                            {settings?.shop_logo ? (
                                <img src={settings.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingBag size={22} />
                            )}
                        </div>
                        <span className="font-black text-xl tracking-tighter text-slate-800 uppercase italic">
                            {settings?.shop_name || 'DRYSHOP'}
                        </span>
                    </Link>
                </div>

                {/* Navigasi Utama */}
                <div className="hidden lg:flex items-center gap-10">
                    <NavLink href="/" icon={<Home size={16} />} label="Home" />
                    <Link href={route('cart.index')} className="relative group text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <div className="relative">
                            <ShoppingCart size={18} />
                            {cart_count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-pulse shadow-sm">
                                    {cart_count}
                                </span>
                            )}
                        </div>
                        Cart
                    </Link>
                    <Link href={route('user.messages.index')} className="relative group text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <div className="relative">
                            <MessageCircle size={18} />
                            {unreadMessages > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-pulse shadow-sm">
                                    {unreadMessages}
                                </span>
                            )}
                        </div>
                        Messages
                    </Link>
                    <NavLink href={route('dashboard')} icon={<User size={16} />} label="My Dashboard" />
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                    <ThemeToggle minimal />
                    <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 pl-4 pr-2 py-1.5 bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                    >
                        <div className="text-right hidden sm:block">
                            {/* Gunakan display_name jika ada, fallback ke name */}
                            <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-tight">
                                {user?.display_name || user?.name}
                            </p>
                            <p className="text-[9px] font-bold text-blue-500 tracking-[0.15em] uppercase mt-1 italic opacity-80">
                                {user?.role || 'Buyer'}
                            </p>
                        </div>
                        
                        {/* Avatar Box - Connected to Backend Storage */}
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-blue-200 transition-all">
                            {user?.avatar_url ? (
                                <img 
                                    // KEY penting agar React me-render ulang image saat URL berubah (misal: upload baru)
                                    key={user.avatar_url}
                                    src={user.avatar_url} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    // Menangani jika link gambar rusak/404 agar tidak blank
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff`;
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black italic text-xs uppercase">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/80 border border-slate-50 p-3 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                {/* Mobile Name Header */}
                                <div className="px-4 py-3 mb-2 border-b border-slate-50 md:hidden">
                                    <p className="text-xs font-black text-slate-900 uppercase">{user?.display_name || user?.name}</p>
                                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{user?.role}</p>
                                </div>

                                <div className="space-y-1">
                                    <DropdownLink href={route('profile.edit')} icon={<Settings size={16} />} label="Account Settings" />
                                    <DropdownLink href={route('user.messages.index')} icon={<MessageCircle size={16} />} label="My Messages" badge={unreadMessages} color="text-blue-500" />
                                    
                                    {user?.role === 'admin' && (
                                        <DropdownLink href="/admin/dashboard" icon={<Shield size={16} />} label="Admin Panel" color="text-emerald-500" />
                                    )}

                                    <div className="h-px bg-slate-50 my-2 mx-2"></div>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 rounded-[1.2rem] text-slate-600 hover:text-red-600 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                            <LogOut size={14} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Logout System</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    </div>
                </div>
            </nav>

            {/* Konten Halaman */}
            <main className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                {children}
            </main>

            {/* Chat Widget */}
            <ChatWidget />

            {/* --- FOOTER --- */}
            <footer className="mt-24 border-t border-slate-100 bg-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center items-center gap-3 mb-6 grayscale opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-default">
                        {settings?.shop_logo ? (
                            <img src={settings.shop_logo} alt="Logo" className="w-6 h-6 object-contain" />
                        ) : (
                            <ShoppingBag size={20} className="text-slate-900" />
                        )}
                        <span className="font-black text-slate-900 uppercase tracking-[0.3em] text-xs italic">
                            {settings?.shop_name || 'DRYSHOP'}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        &copy; 2026 {settings?.shop_name} &bull; Engineered for Excellence
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Sub-komponen tetap sama
function NavLink({ href, icon, label }) {
    return (
        <Link href={href} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2 group">
            <span className="group-hover:scale-110 transition-transform">{icon}</span>
            {label}
        </Link>
    );
}

function DropdownLink({ href, icon, label, color = "text-blue-500", badge = 0 }) {
    return (
        <Link 
            href={href}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-[1.2rem] text-slate-600 hover:text-slate-900 transition-all group relative"
        >
            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:${color} transition-all shadow-sm`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest flex-1">{label}</span>
            {badge > 0 && (
                <span className="ml-2 flex-shrink-0 w-5 h-5 bg-red-600 text-white rounded-full text-[8px] font-black flex items-center justify-center animate-pulse">
                    {badge}
                </span>
            )}
        </Link>
    );
}