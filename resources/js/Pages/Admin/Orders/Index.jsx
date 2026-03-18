import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Clock, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';

export default function Index({ auth, orders = [] }) {
    
    // Helper untuk warna status
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'success') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (s === 'cancelled' || s === 'failed') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-orange-50 text-orange-600 border-orange-100'; // Untuk pending/processing
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Kelola Pesanan" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800">Customer Orders</h2>
                <p className="text-sm text-slate-400 font-medium">Pantau semua transaksi dan status pengiriman pelanggan.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bayar</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/30 transition-all group">
                                    <td className="p-6 font-bold text-slate-700">#ORD-{order.id}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{order.user?.name || 'Guest'}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-black text-slate-800">
                                        Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                            {order.status === 'completed' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                            {order.status || 'Pending'}
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm text-slate-500 font-medium">
                                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-6 text-right">
                                        <Link 
                                            href={route('orders.show', order.id)}
                                            className="p-2 inline-block text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-24 text-center">
                                    <div className="flex flex-col items-center opacity-20">
                                        <ShoppingBag size={64} className="mb-4" />
                                        <h3 className="text-xl font-black">Belum Ada Pesanan</h3>
                                        <p className="text-sm font-medium">Semua transaksi masuk akan muncul di sini.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}