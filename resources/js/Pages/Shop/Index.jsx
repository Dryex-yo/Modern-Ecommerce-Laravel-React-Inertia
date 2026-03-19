import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, ShoppingCart, Star, Package, SearchX } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout'; // Pastikan kamu punya layout ini

export default function ShopIndex({ auth, products }) {
    const { cart_count } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddToCart = (e, productId) => {
        e.preventDefault();
        router.post(route('cart.store'), { product_id: productId, quantity: 1 }, {
            preserveScroll: true,
        });
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, products]);

    return (
        <UserLayout user={auth.user}>
            <Head title="Full Collection" />
            
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Header Page */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900">The Collection</h2>
                        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Curated Premium Goods / {filteredProducts.length} Items</p>
                    </div>
                    
                    {/* Search Bar Minimalis */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Search our pieces..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-sm"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Produk */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group flex flex-col">
                                <div className="relative aspect-[3/4] bg-[#F1F1F1] rounded-[2rem] overflow-hidden mb-6 group-hover:shadow-2xl transition-all duration-700">
                                    <Link href={route('shop.product.show', product.id)}>
                                        <img src={`/storage/${product.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </Link>
                                    <button 
                                        onClick={(e) => handleAddToCart(e, product.id)}
                                        className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md py-4 rounded-2xl font-black text-[10px] tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all uppercase shadow-xl hover:bg-blue-600 hover:text-white"
                                    >
                                        Quick Add +
                                    </button>
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 leading-tight">{product.name}</h4>
                                    <div className="flex items-center gap-1 text-amber-400"><Star size={12} fill="currentColor"/> <span className="text-[10px] font-black text-slate-400">4.9</span></div>
                                </div>
                                <p className="font-black text-lg text-slate-950">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <SearchX size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="font-black text-slate-800 uppercase italic">No Match Found</h4>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}