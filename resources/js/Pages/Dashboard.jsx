import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    ShoppingBag, Clock, Zap, ChevronRight, 
    Package, Heart, Sparkles, ArrowUpRight, 
    Activity, Bell, Star, Flame, Award, Zap as ZapIcon,
    MessageCircle, HelpCircle, BookOpen, Mail, Gift,
    TrendingUp, Calendar, LogIn, Lightbulb, Shield,
    BarChart3, Crown
} from 'lucide-react';

export default function UserDashboard() {
    const { auth, settings, recentActivity = [], recentOrders = [], loyaltyPoints = 0, recommendations = [], lastLogin = null, accountHealth = 75 } = usePage().props;
    
    // Validasi user
    if (!auth || !auth.user) {
        return redirect().route('login');
    }

    const user = auth.user;
    const myOrdersCount = auth.myOrdersCount || 0;
    const wishlistCount = auth.wishlistCount || 0;
    const shopName = settings?.shop_name || '';
    const shopLogo = settings?.shop_logo;
    const totalSpent = auth.totalSpent || 0;
    const memberSince = user.created_at || new Date();
    
    // Calculate user tier
    const getTier = (spent) => {
        if (spent > 5000000) return { 
            name: 'Platinum', 
            color: 'from-slate-500 to-slate-700', 
            icon: Crown, 
            badge: '👑' 
        };
        if (spent > 2000000) return { 
            name: 'Gold', 
            color: 'from-yellow-500 to-yellow-600', 
            icon: Star, 
            badge: '⭐' 
        };
        if (spent > 1000000) return { 
            name: 'Silver', 
            color: 'from-slate-300 to-slate-400', 
            icon: Award, 
            badge: '🥈' 
        };
        return { 
            name: 'Bronze', 
            color: 'from-orange-500 to-orange-600', 
            icon: Flame, 
            badge: '🔥' 
        };
    };

    const tier = getTier(totalSpent);
    const TierIcon = tier.icon;

    // Check if today is birthday
    const isBirthday = user.birth_date && 
        new Date(user.birth_date).toLocaleDateString('id-ID') === new Date().toLocaleDateString('id-ID');

    // Format last login
    const formatLastLogin = (date) => {
        if (!date) return 'First time here!';
        try {
            const diff = Date.now() - new Date(date).getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours < 1) return 'Just now';
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            if (days === 1) return '1d ago';
            return `${days}d ago`;
        } catch {
            return 'Unknown';
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', { 
                month: 'short', 
                year: '2-digit' 
            });
        } catch {
            return 'N/A';
        }
    };

    const containerVariants = "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out";

    return (
        <UserLayout user={user}>
            <Head title={`${shopName} | Dashboard`} />
            
            <main className="max-w-7xl mx-auto py-16 px-6">
                
                {/* BIRTHDAY BANNER */}
                {isBirthday && (
                    <div className="mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 rounded-[2.5rem] text-white shadow-2xl animate-pulse">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">🎉</span>
                                <div>
                                    <h3 className="font-black text-lg uppercase italic tracking-tight">Selamat Ulang Tahun!</h3>
                                    <p className="text-[10px] font-bold opacity-90">Dapatkan diskon spesial 25% untuk birthday Anda!</p>
                                </div>
                            </div>
                            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap">
                                Claim Reward
                            </button>
                        </div>
                    </div>
                )}

                {/* HEADER SECTION */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-in fade-in slide-in-from-left duration-700">
                        <div className="flex items-center gap-4 mb-6">
                            {shopLogo && (
                                <div className="h-16 w-16 bg-white rounded-2xl border border-slate-100 shadow-md flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={shopLogo} 
                                        alt={shopName} 
                                        className="max-h-14 max-w-14 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Shop Info</p>
                                <h3 className="text-lg font-black text-slate-800 uppercase italic">{shopName}</h3>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Sparkles size={14} fill="currentColor" /> 
                            Status: {user.role === 'admin' ? 'Administrator' : 'Customer'} • {tier.name}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                            Halo, {user.name?.split(' ')[0] || 'User'}! 👋
                        </h2>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                Sistem Aktif • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="flex gap-4 flex-wrap md:flex-nowrap">
                        <Link href={route('orders.index')} className="group">
                            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[120px] shadow-xl hover:scale-105 hover:-rotate-2 transition-all duration-300">
                                <span className="text-3xl font-black italic leading-none">{myOrdersCount}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest mt-2 text-slate-400">Orders</span>
                            </div>
                        </Link>

                        <Link href={route('wishlist.index')} className="group">
                            <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[120px] shadow-sm hover:scale-105 hover:rotate-2 transition-all duration-300">
                                <span className="text-3xl font-black italic leading-none text-blue-600 group-hover:text-pink-500 transition-colors">
                                    {wishlistCount}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest mt-2 text-slate-400">Wishlist</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN */}
                    <div className={`col-span-12 lg:col-span-4 order-2 lg:order-1 space-y-8`}>
                        
                        {/* ACCOUNT HEALTH SCORE */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-black text-slate-800 uppercase italic text-sm">Account Health</h4>
                                <Shield size={20} className="text-blue-600" />
                            </div>
                            
                            <div className="relative mb-4">
                                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(accountHealth, 100)}%` }}
                                    />
                                </div>
                            </div>
                            
                            <p className="text-[10px] font-bold text-slate-600 mb-4">
                                {Math.min(accountHealth, 100)}% Complete
                            </p>

                            <div className="space-y-2 text-[9px] font-bold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className={accountHealth >= 25 ? 'text-emerald-500' : 'text-slate-300'}>
                                        {accountHealth >= 25 ? '✓' : '○'}
                                    </span>
                                    <span>Avatar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={accountHealth >= 50 ? 'text-emerald-500' : 'text-slate-300'}>
                                        {accountHealth >= 50 ? '✓' : '○'}
                                    </span>
                                    <span>Bio</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={accountHealth >= 100 ? 'text-emerald-500' : 'text-slate-300'}>
                                        {accountHealth >= 100 ? '✓' : '○'}
                                    </span>
                                    <span>Address</span>
                                </div>
                            </div>

                            <Link 
                                href={route('profile.edit')}
                                className="w-full mt-6 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Complete Profile
                            </Link>
                        </div>

                        {/* RECENT ACTIVITY FEED */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                        <Activity size={18} />
                                    </div>
                                    <h4 className="font-black text-slate-800 uppercase italic text-sm">Aktivitas</h4>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                            </div>

                            <div className="space-y-6">
                                {recentActivity && recentActivity.length > 0 ? (
                                    recentActivity.slice(0, 5).map((act, index) => (
                                        <div key={index} className="flex gap-4 group">
                                            <div className="relative">
                                                <div className="h-full w-0.5 bg-slate-100 absolute left-1/2 -translate-x-1/2"></div>
                                                <div className="h-3 w-3 rounded-full bg-white border-2 border-slate-200 relative z-10 group-hover:border-blue-500 transition-colors"></div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-slate-800 font-bold leading-none">
                                                    {act.description || 'Activity'}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                                                    {act.time || 'Recently'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            Belum ada aktivitas
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QUICK LINKS */}
                        <div className="bg-slate-900 text-white p-8 rounded-[3rem] space-y-3">
                            <h4 className="font-black uppercase italic text-[12px] mb-6 tracking-tight">Quick Support</h4>
                            
                            <Link href={route('faq.index')} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <HelpCircle size={18} />
                                    <span className="font-bold text-[10px] uppercase">FAQ</span>
                                </div>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <Link href={route('contact.create')} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <MessageCircle size={18} />
                                    <span className="font-bold text-[10px] uppercase">Contact CS</span>
                                </div>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <Link href={route('about.index')} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <BookOpen size={18} />
                                    <span className="font-bold text-[10px] uppercase">About Us</span>
                                </div>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-span-12 lg:col-span-8 order-1 lg:order-2 space-y-8">
                        
                        {/* MAIN ACTION CARDS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Order Status Card */}
                            <div className={`group ${containerVariants}`} style={{ animationDelay: '100ms' }}>
                                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Package size={120} className="-rotate-12" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Clock size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 italic uppercase">Pesanan</h3>
                                        <p className="text-slate-400 mt-2 mb-8 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
                                            Lacak pengiriman & riwayat.
                                        </p>
                                    </div>
                                    
                                    <Link href={route('orders.index')} className="bg-slate-900 text-white w-full py-4 rounded-2xl text-[10px] font-black inline-flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg group">
                                        Check Status <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Shop Card */}
                            <div className={`group ${containerVariants}`} style={{ animationDelay: '200ms' }}>
                                <div className="bg-blue-600 p-10 rounded-[3.5rem] text-white shadow-xl shadow-blue-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden flex flex-col justify-between">
                                    <Zap size={100} className="absolute -bottom-5 -right-5 opacity-10 rotate-12" />
                                    
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                                            <ShoppingBag size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase">Katalog</h3>
                                        <p className="text-blue-100 mt-2 mb-8 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
                                            Dapatkan koleksi terbaru.
                                        </p>
                                    </div>
                                    
                                    <Link href={route('shop.index')} className="bg-white text-blue-600 w-full py-4 rounded-2xl text-[10px] font-black inline-flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-lg group relative z-10">
                                        Mulai Belanja <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className={`group ${containerVariants}`} style={{ animationDelay: '300ms' }}>
                                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <BarChart3 size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 italic uppercase">Statistics</h3>
                                        <div className="mt-8 space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Member Since</span>
                                                <span className="font-black text-slate-800 text-[11px]">{formatDate(memberSince)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Last Login</span>
                                                <span className="font-black text-slate-800 text-[10px]">{formatLastLogin(lastLogin)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                                                <span className="font-black text-emerald-600 text-[10px]">✓ Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RECENT ORDERS PREVIEW */}
                        {recentOrders && recentOrders.length > 0 && (
                            <div className={`bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm ${containerVariants}`} style={{ animationDelay: '400ms' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="font-black text-slate-800 uppercase italic text-lg">Pesanan Terbaru</h4>
                                    <Link href={route('orders.index')} className="text-[9px] font-black text-blue-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                                        View All →
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentOrders.slice(0, 3).map((order, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-50 hover:bg-blue-50 transition-all group cursor-pointer">
                                            <div>
                                                <p className="font-black text-slate-800 text-[11px]">Order #{order.order_number || `#${order.id}`}</p>
                                                <p className="text-[9px] text-slate-400 font-bold mt-1">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-blue-600">{formatCurrency(order.total_price)}</p>
                                                <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full inline-block mt-1 ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                                    {order.status || 'pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRODUCT RECOMMENDATIONS */}
                        {recommendations && recommendations.length > 0 && (
                            <div className={`bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm ${containerVariants}`} style={{ animationDelay: '500ms' }}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Lightbulb size={20} />
                                    </div>
                                    <h4 className="font-black text-slate-800 uppercase italic text-lg">Untuk Anda</h4>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {recommendations.slice(0, 3).map((product, idx) => (
                                        <Link key={idx} href={route('shop.product.show', product.id)} className="group">
                                            <div className="bg-slate-50 rounded-[1.5rem] overflow-hidden aspect-square mb-3 group-hover:shadow-lg transition-all">
                                                {product.image ? (
                                                    <img 
                                                        src={`/storage/${product.image}`} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                                        <Package size={32} className="text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-800 leading-tight line-clamp-2">
                                                {product.name || 'Product'}
                                            </p>
                                            <p className="text-[9px] text-blue-600 font-bold mt-2">
                                                {formatCurrency(product.price)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WISHLIST SECTION */}
                        <div className={`group ${containerVariants}`} style={{ animationDelay: '600ms' }}>
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between group-hover:bg-white group-hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-pink-500 transition-colors shadow-sm">
                                        <Heart 
                                            size={28} 
                                            fill={wishlistCount > 0 ? "currentColor" : "none"} 
                                            className={wishlistCount > 0 ? "text-pink-500" : ""}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-800 uppercase italic">Wishlist</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                                            {wishlistCount} produk dalam daftar favorit
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 relative z-10">
                                    <Link 
                                        href={route('wishlist.index')} 
                                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors"
                                    >
                                        Lihat Semua <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </UserLayout>
    );
}