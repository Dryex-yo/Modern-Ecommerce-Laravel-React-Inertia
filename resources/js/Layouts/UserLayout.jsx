import { Link, router } from '@inertiajs/react';
import { ShoppingBag, LogOut, Home, User, ShoppingCart, Heart } from 'lucide-react';

export default function UserLayout({ children, user }) {
    
    // Fungsi untuk menangani Logout
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
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                            <ShoppingBag size={22} />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-800">SoftShop</span>
                    </Link>
                </div>

                {/* Main Navigation Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link 
                        href="/" 
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                        <Home size={16} /> Home
                    </Link>
                    <Link 
                        href={route('cart.index')} 
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 relative"
                    >
                        <ShoppingCart size={16} /> 
                        Cart
                    </Link>
                    <Link 
                        href={route('dashboard')} 
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                        <User size={16} /> My Account
                    </Link>
                </div>

                {/* User Actions Section */}
                <div className="flex items-center gap-5">
                    {/* User Profile Info (Desktop Only) */}
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-black text-slate-800 leading-none">{user.name}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                            {user.role}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-[1px] bg-slate-100 hidden sm:block mx-1"></div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="group p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center gap-2"
                        title="Logout"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold hidden md:block">Logout</span>
                    </button>
                </div>
            </nav>

            {/* --- MAIN PAGE CONTENT --- */}
            <main className="animate-in fade-in duration-500">
                {children}
            </main>

            {/* --- SIMPLE FOOTER --- */}
            <footer className="mt-20 border-t border-slate-100 bg-white py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
                        <ShoppingBag size={18} className="text-slate-400" />
                        <span className="font-bold text-slate-400">SoftShop</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        &copy; 2026 SoftShop E-Commerce. Hak Cipta Dilindungi.
                    </p>
                    <div className="mt-4 flex justify-center gap-6">
                        <a href="#" className="text-xs font-bold text-slate-300 hover:text-blue-500 transition-colors">Terms</a>
                        <a href="#" className="text-xs font-bold text-slate-300 hover:text-blue-500 transition-colors">Privacy</a>
                        <a href="#" className="text-xs font-bold text-slate-300 hover:text-blue-500 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}