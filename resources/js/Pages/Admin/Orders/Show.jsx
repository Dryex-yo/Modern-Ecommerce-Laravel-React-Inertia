import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, Package, User, MapPin } from 'lucide-react';

export default function Show({ auth, order }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title={`Detail Order #${order.id}`} />

            {/* Header & Back Button */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href={route('orders.index')} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Order Detail</h1>
                        <p className="text-slate-500 text-sm">ID Pesanan: #ORD-{order.id}</p>
                    </div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <Printer size={18} /> Print Invoice
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Daftar Produk */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <Package size={20} className="text-blue-600" /> Items Ordered
                            </h3>
                        </div>
                        <div className="p-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="pb-4">Product</th>
                                        <th className="pb-4 text-center">Qty</th>
                                        <th className="pb-4 text-right">Price</th>
                                        <th className="pb-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="text-sm">
                                            <td className="py-4 font-bold text-slate-700">{item.product?.name}</td>
                                            <td className="py-4 text-center font-medium text-slate-500">{item.quantity}</td>
                                            <td className="py-4 text-right font-medium text-slate-500">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                                            <td className="py-4 text-right font-black text-slate-800">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                            <span className="font-bold opacity-60">Total Amount</span>
                            <span className="text-2xl font-black">Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Info Pelanggan */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6">
                            <User size={20} className="text-blue-600" /> Customer Info
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</p>
                                <p className="font-bold text-slate-700">{order.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                <p className="font-medium text-slate-600">{order.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6">
                            <MapPin size={20} className="text-blue-600" /> Shipping Address
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-600 font-medium">
                            {order.shipping_address || 'No address provided.'}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}