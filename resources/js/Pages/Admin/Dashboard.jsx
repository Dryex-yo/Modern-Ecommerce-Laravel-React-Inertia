import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    DollarSign, Package, Activity, Users, AlertCircle, 
    ShoppingCart, ChevronRight, TrendingUp, TrendingDown 
} from 'lucide-react';

export default function AdminDashboard({ auth, stats, latestProducts = [], recentOrders = [] }) {
    const { settings } = usePage().props;
    const shopName = settings?.shop_name || 'DRYEX SHOP';

    // Helper untuk format mata uang
    const formatIDR = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(amount || 0);

    return (
        <AdminLayout user={auth.user}>
            <Head title={`${shopName} | Admin Panel`} />

            {/* --- HEADER SECTION --- */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Overview <span className="text-blue-600">—</span> {shopName}
                    </h2>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1">
                        Dashboard Analytics & Control Center
                    </p>
                </div>
                {/* Opsi tambahan: Tombol aksi cepat jika perlu */}
                <Link 
                    href={route('admin.products.create')} 
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95 w-fit"
                >
                    + Add New Product
                </Link>
            </div>

            {/* --- 1. STATS CARDS SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    label="TOTAL REVENUE" 
                    value={formatIDR(stats?.totalRevenue)} 
                    trend="+12.5%" 
                    icon={<DollarSign size={22}/>} 
                    color="bg-emerald-500" 
                    glowColor="shadow-emerald-200"
                />
                <StatCard 
                    label="TOTAL ORDERS" 
                    value={stats?.totalOrders || 0} 
                    trend="Active" 
                    icon={<ShoppingCart size={22}/>} 
                    color="bg-blue-500" 
                    glowColor="shadow-blue-200"
                />
                <StatCard 
                    label="LOW STOCK" 
                    value={stats?.lowStockCount || 0} 
                    trend={stats?.lowStockCount > 0 ? "Alert" : "Safe"} 
                    icon={<AlertCircle size={22}/>} 
                    color={stats?.lowStockCount > 0 ? "bg-rose-500" : "bg-slate-400"} 
                    glowColor={stats?.lowStockCount > 0 ? "shadow-rose-200" : "shadow-slate-200"}
                    isDown={stats?.lowStockCount > 0} 
                />
                <StatCard 
                    label="CUSTOMERS" 
                    value={stats?.totalCustomers || 0} 
                    trend="Growth" 
                    icon={<Users size={22}/>} 
                    color="bg-indigo-500" 
                    glowColor="shadow-indigo-200"
                />
            </div>

            {/* --- 2. MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: RECENT TRANSACTIONS (Lebih Lebar) */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 flex flex-col">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Recent Transactions</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Live order updates</p>
                            </div>
                        </div>
                        <Link href={route('admin.orders.index')} className="text-[10px] font-black text-blue-600 hover:text-blue-800 tracking-widest bg-blue-50 px-4 py-2 rounded-xl transition-colors">VIEW ALL</Link>
                    </div>
                    
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                    <th className="pb-4 pl-4">Customer</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4 text-right pr-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-transparent">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <tr key={order.id} className="group bg-slate-50/40 hover:bg-white hover:shadow-md hover:shadow-slate-100 transition-all duration-300">
                                        <td className="py-4 pl-4 rounded-l-[1.5rem]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[12px] font-black text-slate-600 shadow-sm">
                                                    {order.user?.name ? order.user.name.charAt(0).toUpperCase() : 'G'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-[9px] text-slate-400 mt-1.5 font-bold tracking-tight uppercase">Order #ID-{order.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 font-black text-slate-800 text-sm italic">
                                            {formatIDR(order.total_price || order.total_amount)}
                                        </td>
                                        <td className="py-4 text-right pr-4 rounded-r-[1.5rem]">
                                            <Link href={route('admin.orders.index')} className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all inline-flex shadow-sm border border-slate-100">
                                                <ChevronRight size={14} strokeWidth={4} />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="py-20 text-center">
                                            <p className="text-slate-300 font-black text-xs uppercase tracking-widest">No transactions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: INVENTORY MONITOR (Lebih Ramping) */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8 px-2">
                        <div>
                            <h3 className="font-black text-xl text-slate-800">Inventory</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Quick stock check</p>
                        </div>
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg shadow-slate-200">
                            <Package size={20} />
                        </div>
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                        {latestProducts.length > 0 ? latestProducts.slice(0, 6).map((product) => (
                            <div key={product.id} className="group p-4 rounded-[1.8rem] border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 bg-slate-50/30 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="max-w-[150px]">
                                        <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">{product.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5 italic">{formatIDR(product.price)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl inline-block ${product.stock <= 5 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                            {product.stock} <span className="text-[8px] opacity-70">UNIT</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center">
                                <p className="text-slate-300 font-black text-xs uppercase tracking-widest">Empty Stock</p>
                            </div>
                        )}
                    </div>
                    
                    <Link href={route('admin.products.index')} className="w-full mt-8 py-4 rounded-[1.5rem] bg-slate-900 text-white text-[10px] font-black uppercase text-center hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 tracking-widest">
                        Manage Inventory
                    </Link>
                </div>

            </div>
        </AdminLayout>
    );
}

// --- SUB-COMPONENTS (Internal) ---

function StatCard({ label, value, trend, icon, color, glowColor, isDown = false }) {
    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-4 rounded-[1.5rem] ${color} text-white shadow-2xl ${glowColor} group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isDown ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isDown ? <TrendingDown size={10} strokeWidth={3} /> : <TrendingUp size={10} strokeWidth={3} />}
                    <span className="text-[9px] font-black uppercase tracking-tight">{trend}</span>
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{label}</p>
                <h4 className="text-3xl font-black text-slate-800 mt-2 tracking-tighter leading-none">{value}</h4>
            </div>
            
            {/* Dekoratif Watermark Icon di Background */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-slate-900 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
                {React.cloneElement(icon, { size: 120 })}
            </div>
        </div>
    );
}