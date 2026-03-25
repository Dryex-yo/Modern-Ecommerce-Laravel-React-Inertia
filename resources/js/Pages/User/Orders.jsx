import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ShoppingBag, ArrowLeft, Package, 
    Clock, CheckCircle2, ChevronRight,
    LogOut, Home
} from 'lucide-react';

export default function Orders({ auth, orders, cart_count }) {
    
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    // Helper format IDR
    const formatIDR = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-blue-100">
            <Head title="Riwayat Pesanan Saya" />

            {/* --- SIMPLE NAVIGATION --- */}
            <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100">
                <div className="flex items-center gap-8">
                    <Link href="/shop" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                            <Home size={16} />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-[0.2em] hidden md:block">Back to Store</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated as</p>
                        <p className="text-[11px] font-bold text-slate-900">{auth.user.name}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* --- HEADER --- */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-10 bg-blue-600"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 italic">User Dashboard</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        My <span className="text-slate-300">Orders</span>
                    </h1>
                    <p className="mt-4 text-slate-500 font-medium text-sm border-l-2 border-slate-100 pl-4">
                        Pantau status pengiriman dan riwayat belanja Anda di sini.
                    </p>
                </div>

                {/* --- ORDERS LIST --- */}
                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div 
                                key={order.id} 
                                className="group bg-white border border-slate-100 rounded-[2rem] p-6 transition-all duration-500 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/50"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Image Container */}
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                        {order.items && order.items.length > 0 && order.items[0]?.product ? (
                                            <img 
                                                src={order.items[0].product.image ? `/storage/${order.items[0].product.image}` : '/images/placeholder.png'}
                                                alt={order.items[0].product.name || 'Product'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/images/placeholder.png' }} 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Package size={48} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">#{order.id}</span>
                                            <span className="text-[10px] font-bold text-slate-300">•</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        {order.items && order.items.length > 0 && order.items[0]?.product ? (
                                            <>
                                                <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight mb-2">
                                                    {order.items[0].product.name}
                                                </h3>
                                                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                                                    {order.items[0].product.category?.name || 'General'}
                                                </span>
                                            </>
                                        ) : (
                                            <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight mb-2">
                                                Order #{order.order_number}
                                            </h3>
                                        )}
                                        
                                        <p className="text-blue-600 font-black text-lg mt-2">
                                            {formatIDR(order.total_price)}
                                        </p>
                                        {order.items && order.items.length > 0 && (
                                            <p className="text-[10px] text-slate-400 font-semibold mt-1">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                        {/* Status Badge */}
                                        <div className={`px-5 py-2 rounded-full flex items-center gap-2 border ${
                                            order.status?.toLowerCase() === 'pending' 
                                            ? 'bg-amber-50 border-amber-100 text-amber-600' 
                                            : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                order.status?.toLowerCase() === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{order.status || 'Processing'}</span>
                                        </div>
                                        
                                        <Link 
                                            href={route('orders.show', order.id)}
                                            className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn"
                                        >
                                            <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* --- EMPTY STATE --- */
                    <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <ShoppingBag size={40} />
                        </div>
                        <h3 className="font-black text-lg text-slate-900 uppercase tracking-tighter italic">Belum ada pesanan</h3>
                        <p className="text-slate-400 text-sm font-medium mt-2 mb-8">Sepertinya Anda belum melakukan transaksi apapun.</p>
                        <Link 
                            href={route('shop.index')}
                            className="bg-slate-900 text-white px-10 py-4 rounded-full font-black text-[11px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase"
                        >
                            Mulai Belanja Sekarang
                        </Link>
                    </div>
                )}
            </main>

            {/* Footer Kecil */}
            <footer className="py-10 text-center border-t border-slate-50">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">&copy; 2026 {auth.user.shop_name || 'DRYEX SHOP'}. Customer Portal.</p>
            </footer>
        </div>
    );
}