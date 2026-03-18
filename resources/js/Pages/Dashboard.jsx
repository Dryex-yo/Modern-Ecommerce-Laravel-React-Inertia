import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage } from '@inertiajs/react'; // Tambah usePage
import { 
    ShoppingBag, Clock, DollarSign, Package, Activity, 
    Users, ArrowUpRight, ArrowDownRight, AlertCircle,
    ShoppingCart, Star, Zap, ChevronRight
} from 'lucide-react';

export default function Dashboard({ auth, stats, latestProducts, recentOrders, myOrdersCount }) {
    const { settings } = usePage().props; // Ambil data settings global
    const user = auth?.user;
    const role = user?.role;
    const shopName = settings?.shop_name || 'DRYEX SHOP';

    // Helper Greeting berdasarkan jam
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 17) return 'Selamat Siang';
        return 'Selamat Malam';
    };

    // Helper Format Rupiah
    const formatIDR = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
    }).format(amount || 0);

    // --- 1. TAMPILAN DASHBOARD USER ---
    if (role !== 'admin') {
        return (
            <UserLayout user={user}>
                <Head title={`${shopName} | My Dashboard`} />
                <main className="max-w-5xl mx-auto py-16 px-6">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Zap size={14} fill="currentColor"/> Customer Portal
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                            {getGreeting()}, {user?.name.split(' ')[0] || 'Sobat'}! 👋
                        </h2>
                        <p className="text-slate-500 font-medium text-lg mt-3">
                            Selamat datang kembali di <span className="text-slate-900 font-bold">{shopName}</span>. 
                            {myOrdersCount > 0 
                                ? ` Kamu punya ${myOrdersCount} pesanan yang sedang diproses.` 
                                : " Yuk, temukan produk impianmu hari ini!"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card Pesanan */}
                        <div className="group relative bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <Clock size={120} />
                            </div>
                            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pesanan Saya</h3>
                            <p className="text-slate-400 mt-2 mb-10 font-medium leading-relaxed">Pantau status pengiriman dan riwayat belanja kamu secara real-time.</p>
                            <Link href="/orders" className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black inline-flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest">
                                Riwayat Pesanan <ChevronRight size={16}/>
                            </Link>
                        </div>

                        {/* Card Belanja */}
                        <div className="group relative bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <ShoppingBag size={120} />
                            </div>
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mulai Belanja</h3>
                            <p className="text-slate-400 mt-2 mb-10 font-medium leading-relaxed">Lihat koleksi produk premium terbaru kami khusus untuk kamu.</p>
                            <Link href="/" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black inline-flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest">
                                Katalog Produk <ChevronRight size={16}/>
                            </Link>
                        </div>
                    </div>
                </main>
            </UserLayout>
        );
    }

    // --- 2. TAMPILAN DASHBOARD ADMIN ---
    return (
        <AdminLayout user={user}>
            <Head title={`${shopName} | Admin Panel`} />

            {/* Welcome Header Admin */}
            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Overview <span className="text-blue-600">—</span> {shopName}
                </h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Dashboard Analytics & Control</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    label="TOTAL REVENUE" 
                    value={formatIDR(stats?.totalRevenue)} 
                    trend="+12%" 
                    icon={<DollarSign size={20}/>} 
                    color="bg-emerald-500" 
                />
                <StatCard 
                    label="TOTAL ORDERS" 
                    value={stats?.totalOrders || 0} 
                    trend="+New" 
                    icon={<ShoppingCart size={20}/>} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    label="LOW STOCK" 
                    value={stats?.lowStockCount || 0} 
                    trend="Stock Alert" 
                    icon={<AlertCircle size={20}/>} 
                    color="bg-rose-500" 
                    isDown={stats?.lowStockCount > 0} 
                />
                <StatCard 
                    label="CUSTOMERS" 
                    value={stats?.totalCustomers || 0} 
                    trend="+Growth" 
                    icon={<Users size={20}/>} 
                    color="bg-indigo-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT ORDERS TABLE */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            Recent Transactions
                        </h3>
                        <Link href="/orders" className="text-xs font-black text-blue-600 hover:underline">VIEW ALL</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                                    <th className="pb-5 pl-2">Customer</th>
                                    <th className="pb-5">Amount</th>
                                    <th className="pb-5">Status</th>
                                    <th className="pb-5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentOrders?.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="py-5 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                    {order.user?.name.charAt(0) || 'G'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 leading-none">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-tight">#ORD-{order.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 font-black text-slate-700 text-sm">
                                            {formatIDR(order.total_price)}
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                                                order.status === 'completed' 
                                                ? 'bg-emerald-50 text-emerald-600' 
                                                : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-5 text-[11px] text-slate-400 font-bold uppercase">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RECENT PRODUCTS */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50">
                    <h3 className="font-black text-xl mb-8 text-slate-800">New Collection</h3>
                    <div className="space-y-6">
                        {latestProducts && latestProducts.length > 0 ? (
                            latestProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/80 p-3 rounded-[1.5rem] transition-all border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            {product.image ? (
                                                <img src={`/storage/${product.image}`} className="w-full h-full object-cover rounded-2xl" />
                                            ) : <Package size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 truncate w-28 group-hover:text-blue-600 transition-colors">{product.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 5 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Stock: {product.stock}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-slate-700">
                                        {formatIDR(product.price).replace('Rp', '').trim()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 flex flex-col items-center">
                                <Package className="text-slate-100 mb-2" size={60} />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Invetory Empty</p>
                            </div>
                        )}
                    </div>
                    
                    <Link href={route('products.index')} className="w-full mt-10 py-5 rounded-[1.5rem] border-2 border-dashed border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex justify-center items-center gap-3">
                        Manage Inventory <ArrowUpRight size={16}/>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, trend, icon, color, isDown = false }) {
    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-4 rounded-2xl ${color} text-white shadow-xl shadow-${color.split('-')[1]}-100 transform group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDown ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isDown ? <ArrowDownRight size={12}/> : <ArrowUpRight size={12}/>}
                    <span className="text-[10px] font-black uppercase">{trend}</span>
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{label}</p>
                <h4 className="text-3xl font-black text-slate-800 mt-2 tracking-tighter">{value}</h4>
            </div>
            {/* Dekorasi Background Card */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
        </div>
    );
}