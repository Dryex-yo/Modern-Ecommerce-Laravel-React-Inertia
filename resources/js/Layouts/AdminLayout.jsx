import React, { useState, useEffect } from 'react';
import SidebarItem from '@/Components/SidebarItem';
import { 
    LayoutGrid, Package, ShoppingCart, LogOut, BarChart3,
    Receipt, FileText, Settings, Search, AlertTriangle,
    Bell, ChevronRight, Loader2, Menu, Users, Layers
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function AdminLayout({ children, user }) {
    const { notifications, settings } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Notifikasi logic
    const pendingOrders = notifications?.pending_orders_count || 0;
    const lowStock = notifications?.low_stock_count || 0;
    const totalNotif = pendingOrders + lowStock;

    // Global Search Debounce
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
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const getHeaderTitle = () => {
        const currentRoute = route().current();
        if (currentRoute.includes('users')) return 'User Management';
        if (currentRoute.includes('products')) return 'Inventory Gallery';
        if (currentRoute.includes('orders')) return 'Customer Orders';
        if (currentRoute.includes('analytics')) return 'Performance Metrics';
        if (currentRoute.includes('categories')) return 'Product Categories';
        if (currentRoute.includes('transactions')) return 'Financial Logs';
        if (currentRoute.includes('reports')) return 'Business Reports';
        if (currentRoute.includes('settings')) return 'System Configuration';
        if (currentRoute.includes('dashboard')) return 'Dashboard Overview';
        return 'Admin Control';
    };
    
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-700">
            {/* --- 1. SIDEBAR --- */}
            <aside className={`
                fixed top-0 md:top-6 bottom-0 md:bottom-6 z-50 transition-all duration-500 ease-in-out
                w-[19rem] bg-white md:rounded-[2.8rem] p-8 shadow-2xl shadow-slate-200/50 flex flex-col border border-slate-100
                ${isMobileMenuOpen ? 'left-0 md:left-6' : '-left-full md:left-6'} 
            `}>
                {/* Brand Logo Section */}
                <div className="flex items-center gap-4 mb-10 px-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 overflow-hidden text-white">
                        {settings?.shop_logo ? (
                            <img src={settings.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : <LayoutGrid size={24} />}
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="font-black text-sm leading-tight uppercase truncate text-slate-800 tracking-tight">
                            {settings?.shop_name || 'Admin Panel'}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-black">Online System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Scroll Area */}
                <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Main Menu */}
                    <div className="pt-2 pb-3">
                        <p className="px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4">Core</p>
                        <SidebarItem icon={<LayoutGrid size={20}/>} label="Overview" href={route('admin.dashboard')} active={route().current('admin.dashboard')} />
                        <SidebarItem icon={<BarChart3 size={20}/>} label="Analytics" href={route('admin.analytics.index')} active={route().current('admin.analytics.*')} />
                    </div>
                    
                    {/* Management */}
                    <div className="pt-6 pb-3">
                        <p className="px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4">Inventory & Sales</p>
                        <SidebarItem icon={<Package size={20}/>} label="Products" href={route('admin.products.index')} active={route().current('admin.products.*')} />
                        <SidebarItem icon={<Layers size={20}/>} label="Categories" href={route('admin.categories.index')} active={route().current('admin.categories.*')} />
                        <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" href={route('admin.orders.index')} active={route().current('admin.orders.*')} />
                        <SidebarItem icon={<Users size={20}/>} label="Users" href={route('admin.users.index')} active={route().current('admin.users.*')} />
                    </div>

                    {/* Finance */}
                    <div className="pt-6 pb-3">
                        <p className="px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4">Accounting</p>
                        <SidebarItem icon={<Receipt size={20}/>} label="Transactions" href={route('admin.transactions.index')} active={route().current('admin.transactions.*')} />
                        <SidebarItem icon={<FileText size={20}/>} label="Reports" href={route('admin.reports.index')} active={route().current('admin.reports.*')} />
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
                    <SidebarItem icon={<Settings size={20}/>} label="Settings" href={route('admin.settings.index')} active={route().current('admin.settings.*')} />
                    
                    <div className="p-5 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Admin</p>
                            <p className="text-xs font-bold mt-1 truncate">{user?.name}</p>
                        </div>
                        <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                            <Users size={60} />
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- 2. MOBILE OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* --- 3. MAIN CONTENT --- */}
            <main className="flex-1 min-h-screen transition-all duration-300 ml-0 md:ml-[21rem] p-5 md:p-10">
                
                {/* Top Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 md:hidden text-slate-600 active:scale-90 transition-transform">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                            {getHeaderTitle()}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        {/* Search Bar */}
                        <div className="relative hidden lg:block">
                            <div className="relative group">
                                {isSearching ? <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} /> : <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />}
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search command..." 
                                    className="pl-12 pr-6 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 w-64 xl:w-80 transition-all text-xs font-bold"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[70] p-4 animate-in slide-in-from-top-2">
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-1">
                                        {searchResults.map((result, idx) => (
                                            <Link key={idx} href={result.url} onClick={() => setSearchTerm('')} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group/item">
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 group-hover/item:text-blue-600">{result.title}</p>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">{result.type}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-300 group-hover/item:translate-x-1" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="relative group">
                            <button className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-50 text-slate-600 hover:text-blue-600 transition-all relative">
                                <Bell size={20} />
                                {totalNotif > 0 && <span className="absolute top-3 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">{totalNotif}</span>}
                            </button>
                            
                            {/* Notification Dropdown */}
                            <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4">
                                <p className="px-3 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Alerts</p>
                                <div className="mt-2 space-y-1">
                                    {pendingOrders > 0 && (
                                        <Link href={route('admin.orders.index')} className="flex items-center gap-3 p-3 hover:bg-amber-50 rounded-2xl transition-all">
                                            <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><ShoppingCart size={16} /></div>
                                            <span className="text-xs font-bold text-slate-700">{pendingOrders} Pending Orders</span>
                                        </Link>
                                    )}
                                    {lowStock > 0 && (
                                        <Link href={route('admin.products.index')} className="flex items-center gap-3 p-3 hover:bg-rose-50 rounded-2xl transition-all">
                                            <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><AlertTriangle size={16} /></div>
                                            <span className="text-xs font-bold text-slate-700">{lowStock} Low Stock Items</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="relative group">
                            <button className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-all">
                                <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=fff&bold=true`} className="w-10 h-10 rounded-xl object-cover" alt="avatar" />
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-black text-slate-800 leading-none">{user?.name?.split(' ')[0]}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Super Admin</p>
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="absolute right-0 mt-4 w-52 bg-white rounded-[2rem] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3">
                                <Link href={route('admin.settings.index')} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                    <Settings size={16} /> <span className="text-xs font-bold">Settings</span>
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                    <LogOut size={16} /> <span className="text-xs font-bold">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}