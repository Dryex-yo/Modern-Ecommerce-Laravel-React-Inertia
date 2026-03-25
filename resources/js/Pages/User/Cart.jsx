import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ArrowLeft, MapPin } from 'lucide-react';

export default function Index({ auth, cartItems }) {
    const { post, processing } = useForm();
    const [shippingAddress, setShippingAddress] = useState('');
    const [errors, setErrors] = useState({});

    // Fungsi Format Rupiah
    const formatIDR = (price) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(price || 0);

    // Hitung Total Belanja secara Real-time
    const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    // Fungsi Update Quantity (Plus/Minus)
    const updateQty = (id, type) => {
        router.patch(route('cart.update', id), { type }, {
            preserveScroll: true, // Agar halaman tidak loncat ke atas saat klik
        });
    };

    // Fungsi Hapus Item
    const removeItem = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')) {
            router.delete(route('cart.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Fungsi Checkout
    const handleCheckout = (e) => {
        e.preventDefault();
        setErrors({});

        // Validasi shipping address
        if (!shippingAddress.trim()) {
            setErrors({ shipping_address: 'Alamat pengiriman harus diisi' });
            return;
        }

        if (shippingAddress.trim().length < 10) {
            setErrors({ shipping_address: 'Alamat pengiriman minimal 10 karakter' });
            return;
        }

        router.post(route('cart.checkout'), {
            shipping_address: shippingAddress
        }, {
            onError: (error) => {
                setErrors(error);
            }
        });
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="Keranjang Belanja" />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                            <ShoppingBag size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Keranjang</h1>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                {cartItems.length} Produk Siap Bayar
                            </p>
                        </div>
                    </div>
                    <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 flex items-center gap-2 transition-colors">
                        <ArrowLeft size={14} /> Lanjut Belanja
                    </Link>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        
                        {/* LIST PRODUK (KIRI) */}
                        <div className="lg:col-span-2 space-y-5">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-200 transition-all duration-300">
                                    {/* Image Container */}
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                        <img 
                                            src={item.product.image_url} 
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = '/images/placeholder.png' }} 
                                        />
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight mb-2">
                                            {item.product.name}
                                        </h3>
                                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                                            {item.product.category_name}
                                        </span>
                                        <p className="text-blue-600 font-black text-lg">
                                            {formatIDR(item.product.price)}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-row sm:flex-col items-center gap-4 sm:items-end">
                                        <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-1.5 shadow-inner">
                                            <button 
                                                onClick={() => updateQty(item.id, 'minus')}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-5 font-black text-slate-800 text-sm w-12 text-center">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => updateQty(item.id, 'plus')}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white hover:text-blue-600 transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RINGKASAN PEMBAYARAN (KANAN) */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white sticky top-28 shadow-2xl shadow-blue-900/10 overflow-hidden relative">
                                {/* Decorative Background Element */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>

                                <h3 className="text-2xl font-black mb-8 tracking-tight relative z-10">Ringkasan</h3>
                                
                                <div className="space-y-5 mb-10 relative z-10">
                                    <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <span>Total Produk</span>
                                        <span className="text-white">{cartItems.length} Items</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <span>Biaya Admin</span>
                                        <span className="text-emerald-400">Gratis</span>
                                    </div>
                                    <div className="h-[1px] bg-slate-800/50 my-6"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Bayar</span>
                                        <span className="text-4xl font-black text-blue-400 tracking-tighter">
                                            {formatIDR(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Shipping Address Input */}
                                <div className="mb-6 relative z-10">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
                                        <MapPin size={14} className="text-blue-400" />
                                        Alamat Pengiriman
                                    </label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota, Provinsi 12345"
                                        className={`w-full p-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border-2 ${
                                            errors.shipping_address ? 'border-red-500' : 'border-slate-700'
                                        } focus:outline-none focus:border-blue-400 resize-none text-sm`}
                                        rows="3"
                                    />
                                    {errors.shipping_address && (
                                        <p className="text-red-400 text-[10px] font-bold mt-2">
                                            {errors.shipping_address}
                                        </p>
                                    )}
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    disabled={processing || !shippingAddress.trim()}
                                    className="w-full bg-blue-600 hover:bg-white hover:text-slate-900 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 shadow-xl shadow-blue-900/20"
                                >
                                    {processing ? 'Processing...' : 'Selesaikan Pesanan'} 
                                    <ArrowRight size={18} />
                                </button>
                                
                                <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
                                    <div className="h-[1px] w-8 bg-slate-500"></div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em]">Secure Checkout</p>
                                    <div className="h-[1px] w-8 bg-slate-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="bg-white rounded-[4rem] py-24 px-10 border border-slate-100 text-center shadow-sm">
                        <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                            <ShoppingBag size={56} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Wah, Keranjangmu Kosong!</h2>
                        <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                            Sepertinya Anda belum menemukan produk yang cocok. Yuk, jelajahi koleksi terbaik kami sekarang.
                        </p>
                        <Link href="/shop" className="inline-flex bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-100 transition-all active:scale-95">
                            Mulai Belanja Sekarang
                        </Link>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}