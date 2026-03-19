import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingBag, LogOut, Home, User, ShoppingCart } from 'lucide-react';

export default function UserLayout({ children, user }) {
    // Ambil data 'settings' dan 'cart_count' dari HandleInertiaRequests.php
    const { settings, cart_count } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            {/* --- TOP NAVBAR --- */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-16 py-4 flex justify-between items-center sticky top-0 z-50">
                
                {/* Logo Section Dinamis */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform overflow-hidden">
                            {settings?.shop_logo ? (
                                <img src={settings.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingBag size={22} />
                            )}
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-800 uppercase italic">
                            {settings?.shop_name || 'SOFT SHOP'}
                        </span>
                    </Link>
                </div>

                {/* Navigasi Utama */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Home size={16} /> Home
                    </Link>
                    
                    {/* Menu Cart dengan Badge Angka Dinamis */}
                    <Link href={route('cart.index')} className="relative group text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <div className="relative">
                            <ShoppingCart size={18} />
                            {cart_count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-bounce shadow-sm">
                                    {cart_count}
                                </span>
                            )}
                        </div>
                        Cart
                    </Link>

                    <Link href={route('dashboard')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <User size={16} /> My Account
                    </Link>
                </div>

                {/* Profil & Logout */}
                <div className="flex items-center gap-5">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-black text-slate-800 leading-none">{user?.name}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                            {user?.role || 'Member'}
                        </p>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-sm"
                    >
                        <LogOut size={18} />
                        <span className="text-xs font-bold hidden md:block">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Konten Halaman */}
            <main className="animate-in fade-in duration-500">
                {children}
            </main>

            {/* --- FOOTER Dinamis --- */}
            <footer className="mt-20 border-t border-slate-100 bg-white py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
                        {settings?.shop_logo ? (
                             <img src={settings.shop_logo} alt="Logo" className="w-5 h-5 grayscale object-contain" />
                        ) : (
                            <ShoppingBag size={18} className="text-slate-400" />
                        )}
                        <span className="font-bold text-slate-400 uppercase tracking-widest">
                            {settings?.shop_name}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        &copy; 2026 {settings?.shop_name}. Premium Shopping Experience.
                    </p>
                </div>
            </footer>
        </div>
    );
}