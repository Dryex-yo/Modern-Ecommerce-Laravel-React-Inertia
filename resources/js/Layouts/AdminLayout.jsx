import React, { useState, useEffect } from 'react';
import SidebarItem from '@/Components/SidebarItem';
import { 
    LayoutGrid, 
    Package, 
    ShoppingCart, 
    LogOut,
    BarChart3,
    Receipt,
    FileText,
    Settings,
    Search,
    AlertTriangle,
    Bell,
    ChevronRight,
    Loader2,
    Menu,
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';


export default function AdminLayout({ children, user }) {
    // Destructuring sekaligus dari usePage
    const { notifications, settings } = usePage().props;
    const logoUrl = settings?.shop_logo || '/default-logo.png';
    
    // State untuk Search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hitung total notifikasi
    const pendingOrders = notifications?.pending_orders_count || 0;
    const lowStock = notifications?.low_stock_count || 0;
    const totalNotif = pendingOrders + lowStock;

    // Logic untuk Global Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length > 2) {
                setIsSearching(true);
                axios.get(route('api.search', { q: searchTerm }))
                    .then(res => {
                        setSearchResults(res.data);
                        setIsSearching(false);
                    })
                    .catch(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 300); // Tunggu 300ms setelah user berhenti mengetik

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const getHeaderTitle = () => {
        if (route().current('products.*')) return 'Products Management';
        if (route().current('orders.*')) return 'Customer Orders';
        if (route().current('analytics.*')) return 'Business Analytics';
        if (route().current('transactions.*')) return 'Transaction Logs';
        if (route().current('reports.*')) return 'Financial Reports';
        if (route().current('settings.*')) return 'System Settings';
        if (route().current('dashboard')) return 'Dashboard Overview';
        return 'Admin Panel';
    };
    
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* --- SIDEBAR --- */}
            <aside className={`
                        fixed top-6 bottom-6 z-50 transition-all duration-300
                        w-[18rem] bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col border border-slate-100
                        /* MOBILE: Sembunyikan ke kiri luar layar */
                        ${isMobileMenuOpen ? 'left-6' : '-left-full'} 
                        /* DESKTOP: Munculkan di posisi biasa */
                        md:left-6 
            `}>
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                        {settings?.shop_logo ? (
                            <img 
                                key={settings.shop_logo}
                                src={settings.shop_logo}
                                alt="Logo"  
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.src = '/images/default-logo.png'; }}
                            />
                        ) : (
                            <LayoutGrid className="text-blue-600" />
                        )}
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none uppercase truncate w-32">
                        <span>{settings.shop_name}</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Admin Panel</p>
                    </div>
                </div>

               <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* --- MAIN MENU --- */}
                    <div className="pb-2">
                        <p className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Main Menu</p>
                    </div>
                    <SidebarItem icon={<LayoutGrid size={20}/>} label="Overview" href={route('dashboard')} active={route().current('dashboard')} />
                    <SidebarItem icon={<BarChart3 size={20}/>} label="Analytics" href={route('analytics.index')} active={route().current('analytics.index')} />
                    
                    <div className="pt-6 pb-2">
                        <p className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Shop Management</p>
                    </div>
                    <SidebarItem icon={<Package size={20}/>} label="Products" href={route('products.index')} active={route().current('products.*')} />
                    <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" href={route('orders.index')} active={route().current('orders.*')} />
                    <SidebarItem icon={<Receipt size={20}/>} label="Transactions" href={route('transactions.index')} active={route().current('transactions.index')} />
                    <SidebarItem icon={<FileText size={20}/>} label="Reports" href={route('reports.index')} active={route().current('reports.index')} />

                    {/* --- SYSTEM SECTION --- */}
                    <div className="pt-6 pb-2">
                        <p className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Configuration</p>
                    </div>
                    <SidebarItem 
                        icon={<Settings size={20}/>} 
                        label="Settings" 
                        href={route('settings.index')} 
                        active={route().current('settings.*')} 
                    />
                </nav>
            {/* BAGIAN BAWAH SIDEBAR (FOOTER) */}
            <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="px-6 py-4 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">System Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[11px] font-bold text-slate-600">All systems operational</p>
                    </div>
                </div>
            </div>
            </aside>

            {/* --- OVERLAY UNTUK MOBILE --- */}
            {isMobileMenuOpen && (
                        <div 
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                )}

            {/* --- MAIN CONTENT AREA --- */}
            <main className={`
                            flex-1 min-h-screen transition-all duration-300
                            /* MOBILE: Tanpa margin kiri agar penuh */
                            ml-0 p-4 
                            /* DESKTOP: Beri margin kiri seukuran sidebar + gap */
                            md:ml-[20rem] md:p-10
                `}>
                <header className="flex justify-between items-center mb-10">
                    {/* TOMBOL HAMBURGER UNTUK MOBILE */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 md:hidden text-slate-600"
                        >
                        <Menu size={24} /> {/* Jangan lupa import Menu dari lucide-react */}
                    </button>
                    
                    <div className="flex-1 md:block hidden ml-4">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            {getHeaderTitle()}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* --- SEARCH BAR --- */}
                        <div className="relative">
                            <div className="relative group">
                                {isSearching ? (
                                    <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} />
                                ) : (
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                )}
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products, orders..." 
                                    className="pl-12 pr-6 py-3 bg-white border-none rounded-full shadow-sm focus:ring-4 focus:ring-blue-50 w-72 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Dropdown Hasil Search */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[60] p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">Search Results</p>
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {searchResults.map((result, idx) => (
                                            <Link 
                                                key={idx} 
                                                href={result.url}
                                                onClick={() => setSearchTerm('')}
                                                className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-2xl transition-all group/item"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700 group-hover/item:text-blue-600 transition-colors">{result.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{result.type}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-300 group-hover/item:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- NOTIFICATION BELL --- */}
                        <div className="relative group">
                            <button className="p-3 bg-white rounded-full shadow-sm relative hover:bg-slate-50 transition-colors">
                                <Bell size={20} className="text-slate-600" />
                                {totalNotif > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                                        {totalNotif}
                                    </span>
                                )}
                            </button>

                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4">
                                <h4 className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Alerts</h4>
                                <div className="space-y-1 mt-2">
                                    {pendingOrders > 0 && (
                                        <Link href={route('orders.index')} className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-2xl transition-all">
                                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><ShoppingCart size={18} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{pendingOrders} New Orders</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Pending to process</p>
                                            </div>
                                        </Link>
                                    )}
                                    {lowStock > 0 && (
                                        <Link href={route('products.index')} className="flex items-center gap-4 p-4 hover:bg-rose-50 rounded-2xl transition-all">
                                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><AlertTriangle size={18} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{lowStock} Low Stock Items</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Restock suggested</p>
                                            </div>
                                        </Link>
                                    )}
                                    {totalNotif === 0 && (
                                        <div className="py-6 text-center text-slate-400 text-sm font-medium">No new notifications</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- USER PROFILE DROPDOWN --- */}
                        <div className="relative group">
                            <button className="flex items-center gap-3 bg-white p-1.5 pr-5 rounded-full shadow-sm border border-white hover:border-blue-100 hover:shadow-md transition-all duration-300 group-hover:bg-slate-50">
                                <div className="relative">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=2563EB&color=fff&bold=true`} 
                                        className="w-9 h-9 rounded-full shadow-inner border border-slate-100" 
                                        alt="avatar" 
                                    />
                                    {/* Online Status Dot */}
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-bold text-sm text-slate-700 leading-none group-hover:text-blue-600 transition-colors">
                                        {user?.name || 'Admin'}
                                    </span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">
                                        Authorized Admin
                                    </span>
                                </div>
                                <ChevronRight size={14} className="ml-2 text-slate-300 group-hover:rotate-90 group-hover:text-blue-500 transition-all duration-300" />
                            </button>

                            {/* Dropdown Menu - Muncul saat Hover */}
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-3 translate-y-2 group-hover:translate-y-0">
                                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <p className="text-xs font-bold text-emerald-600">Active Session</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <Link href={route('settings.index')} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all group/item">
                                        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                                            <Settings size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Edit Profile</span>
                                    </Link>
                                    
                                    <Link href={route('settings.index')} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all group/item">
                                        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                                            <Bell size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Preferences</span>
                                    </Link>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group/item"
                                    >
                                        <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center group-hover/item:bg-rose-100 transition-colors">
                                            <LogOut size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-full overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}