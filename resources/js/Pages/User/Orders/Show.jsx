import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Package, LogOut } from 'lucide-react';

export default function OrderShow({ auth, order, bankDetails }) {

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const formatIDR = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Head title={`Order ${order.order_number}`} />

            {/* Navigation */}
            <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100">
                <Link href={route('orders.index')} className="flex items-center gap-2 text-slate-900 hover:text-blue-600">
                    <ChevronLeft size={20} />
                    <span className="font-black text-[10px] uppercase">Back</span>
                </Link>
                <button 
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-red-500"
                >
                    <LogOut size={20} />
                </button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-slate-900 uppercase italic mb-2">
                        Order {order.order_number}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Payment Instructions for Transfer */}
                {order.status?.toLowerCase() === 'pending' && order.payment_method === 'transfer' && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-[2rem] mb-8 shadow-sm">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <h3 className="font-black text-blue-900 mb-2">Menunggu Pembayaran</h3>
                                <p className="text-blue-800 text-sm mb-4">
                                    Silakan lakukan transfer sesuai dengan total tagihan <strong>{formatIDR(order.total_price)}</strong> ke rekening berikut:
                                </p>
                                <div className="bg-white p-5 rounded-2xl border border-blue-100 mb-4 inline-block min-w-[250px] shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bank {bankDetails.name}</p>
                                    <p className="font-black text-2xl text-blue-600 tracking-wider mb-1">{bankDetails.account}</p>
                                    <p className="text-sm font-bold text-slate-700">a.n. {bankDetails.holder}</p>
                                </div>
                                <p className="text-blue-800 text-xs font-bold">
                                    *Pesanan Anda akan diproses setelah pembayaran dikonfirmasi oleh Admin.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 mb-8">
                    <h2 className="font-black text-lg mb-6 uppercase tracking-tight">Produk Pesanan</h2>
                    
                    {order.items && order.items.length > 0 ? (
                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-6 border-b pb-6 last:border-b-0">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                                        {item.product?.image ? (
                                            <img 
                                                src={`/storage/${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/images/placeholder.png' }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Package size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-black text-slate-900 mb-1">
                                            {item.product?.name || 'Unknown Product'}
                                        </h3>
                                        <p className="text-[10px] text-blue-600 font-black uppercase mb-3">
                                            {item.product?.category?.name || 'General'}
                                        </p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 mb-1">Qty: {item.quantity}</p>
                                                <p className="text-blue-600 font-black text-lg">
                                                    {formatIDR(item.price)}
                                                </p>
                                            </div>
                                            <p className="font-black text-slate-900">
                                                {formatIDR(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400">Tidak ada item dalam pesanan ini.</p>
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 mb-8 shadow-sm">
                    <h2 className="font-black text-lg mb-6 uppercase tracking-tight">Ringkasan Pesanan</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between font-bold text-sm">
                            <span className="text-slate-500">Status Pesanan:</span>
                            <span className={`uppercase font-black ${order.status?.toLowerCase() === 'pending' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {order.status}
                            </span>
                        </div>

                        {order.tracking_number && (
                            <div className="flex justify-between font-bold text-sm">
                                <span className="text-slate-500">Resi Pengiriman:</span>
                                <span className="text-slate-800 tracking-wider font-black bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{order.tracking_number}</span>
                            </div>
                        )}

                        {order.shipping_method && (
                            <div className="flex justify-between font-bold text-sm">
                                <span className="text-slate-500">Metode Pengiriman:</span>
                                <span className="text-slate-800 uppercase">{order.shipping_method.replace('jnt_', 'J&T ').replace('_', ' ')}</span>
                            </div>
                        )}

                        {order.payment_method && (
                            <div className="flex justify-between font-bold text-sm">
                                <span className="text-slate-500">Metode Pembayaran:</span>
                                <span className="text-slate-800 uppercase">
                                    {order.payment_method === 'transfer' ? 'Transfer Bank' : 
                                     order.payment_method === 'cod' ? 'Cash on Delivery (COD)' : order.payment_method}
                                </span>
                            </div>
                        )}

                        {order.payment_method === 'cod' && (
                            <div className="flex justify-between font-bold text-sm">
                                <span className="text-slate-500">Biaya Penanganan (COD):</span>
                                <span className="text-slate-800">Rp 5.000</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between font-black text-xl border-t border-dashed border-slate-200 pt-5 mt-2">
                            <span>Total Bayar:</span>
                            <span className="text-blue-600">{formatIDR(order.total_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Cancellation Notice */}
                {order.status?.toLowerCase() === 'pending' && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <h3 className="font-black text-amber-900 mb-2">Ingin Membatalkan Pesanan?</h3>
                                <p className="text-amber-800 text-sm mb-4">
                                    Jika Anda ingin membatalkan pesanan ini, silakan hubungi Customer Service kami untuk bantuan lebih lanjut.
                                </p>
                                <a 
                                    href="https://wa.me/62YOUR_WHATSAPP_NUMBER" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] uppercase px-6 py-3 rounded-lg transition-colors"
                                >
                                    Hubungi CS via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}