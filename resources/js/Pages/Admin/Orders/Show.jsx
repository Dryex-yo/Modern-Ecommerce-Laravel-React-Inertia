import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Printer, Package, User, MapPin, CheckCircle, XCircle, Trash2, Edit2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function Show({ auth, order }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status || 'Pending');
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = () => {
        if (confirm('Setujui pesanan ini?')) {
            setIsLoading(true);
            router.post(route('admin.orders.approve', order.id), {}, {
                onSuccess: () => {
                    toast.success('Pesanan berhasil disetujui!');
                    setIsLoading(false);
                },
                onError: () => {
                    toast.error('Gagal menyetujui pesanan');
                    setIsLoading(false);
                }
            });
        }
    };

    const handleReject = () => {
        if (confirm('Tolak pesanan ini? Tindakan ini tidak bisa dibatalkan.')) {
            setIsLoading(true);
            router.post(route('admin.orders.reject', order.id), {}, {
                onSuccess: () => {
                    toast.success('Pesanan berhasil ditolak!');
                    setIsLoading(false);
                },
                onError: () => {
                    toast.error('Gagal menolak pesanan');
                    setIsLoading(false);
                }
            });
        }
    };

    const handleUpdateStatus = () => {
        if (confirm(`Ubah status menjadi ${selectedStatus}?`)) {
            setIsLoading(true);
            router.patch(route('admin.orders.update', order.id), { status: selectedStatus }, {
                onSuccess: () => {
                    toast.success('Status pesanan berhasil diperbarui!');
                    setShowStatusModal(false);
                    setIsLoading(false);
                },
                onError: () => {
                    toast.error('Gagal memperbarui status');
                    setIsLoading(false);
                }
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Hapus pesanan ini? Tindakan ini tidak bisa dibatalkan.')) {
            setIsLoading(true);
            router.delete(route('admin.orders.destroy', order.id), {
                onSuccess: () => {
                    toast.success('Pesanan berhasil dihapus!');
                    setIsLoading(false);
                },
                onError: () => {
                    toast.error('Gagal menghapus pesanan');
                    setIsLoading(false);
                }
            });
        }
    };

    const getStatusBadgeColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'success') return 'bg-emerald-100 text-emerald-700';
        if (s === 'cancelled' || s === 'failed') return 'bg-red-100 text-red-700';
        if (s === 'processing') return 'bg-blue-100 text-blue-700';
        return 'bg-orange-100 text-orange-700';
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Detail Order #${order.id}`} />
            <Toaster />

            {/* Header & Back Button */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.orders.index')} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-500">
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
                        <div className="bg-slate-900 p-8 text-white flex justify-between items-center rounded-b-[2.5rem]">
                            <div className="flex flex-col">
                                <span className="font-bold opacity-60">Total Amount</span>
                                {order.payment_method === 'cod' && (
                                    <span className="text-xs text-slate-400 mt-1 font-medium">Termasuk Biaya COD Rp 5.000</span>
                                )}
                            </div>
                            <span className="text-2xl font-black">Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Info Pelanggan & Shipping */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-4">Order Status</h3>
                        <div className={`inline-block px-4 py-2 rounded-full font-black text-sm ${getStatusBadgeColor(order.status)}`}>
                            {order.status || 'Pending'}
                        </div>
                    </div>

                    {/* Customer Info */}
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

                    {/* Shipping Address */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6">
                            <MapPin size={20} className="text-blue-600" /> Shipping Address
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-700 font-medium bg-slate-50 p-4 rounded-xl">
                            {order.shipping_address || 'No address provided.'}
                        </p>
                    </div>

                    {/* Order Details (Shipping & Payment Methods) */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-6">Order Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Pengiriman</p>
                                <p className="font-bold text-slate-700 uppercase">{order.shipping_method ? order.shipping_method.replace('jnt_', 'J&T ').replace('_', ' ') : '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resi Pengiriman</p>
                                <p className="font-bold text-slate-700">{order.tracking_number || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Pembayaran</p>
                                <p className="font-bold text-slate-700 uppercase">
                                    {order.payment_method === 'transfer' ? 'Transfer Bank' : 
                                     order.payment_method === 'cod' ? 'Cash on Delivery (COD)' : (order.payment_method || '-')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-4">Actions</h3>
                        <div className="space-y-3">
                            {order.status?.toLowerCase() !== 'processing' && order.status?.toLowerCase() !== 'completed' && (
                                <button
                                    onClick={handleApprove}
                                    disabled={isLoading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve Order
                                </button>
                            )}
                            
                            <button
                                onClick={() => setShowStatusModal(true)}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Edit2 size={18} /> Edit Status
                            </button>

                            {order.status?.toLowerCase() !== 'cancelled' && (
                                <button
                                    onClick={handleReject}
                                    disabled={isLoading}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} /> Reject Order
                                </button>
                            )}

                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="w-full bg-slate-400 hover:bg-slate-500 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} /> Delete Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-black text-slate-800 mb-4">Edit Order Status</h2>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl mb-4 focus:outline-none focus:border-blue-600"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                disabled={isLoading}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-xl transition-all"
                            >
                                {isLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}