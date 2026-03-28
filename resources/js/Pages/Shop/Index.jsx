import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react'; // Perbaikan: Duplikasi 'router' dihapus
import { Search, Heart, Package, SearchX } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';

export default function ShopIndex({ auth, products, categories }) {
    // Mengambil data cart_count dari global props jika tersedia
    const { cart_count } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Fungsi untuk menambah ke keranjang
    const handleAddToCart = (e, productId) => {
        e.preventDefault();
        router.post(route('cart.store'), { 
            product_id: productId, 
            quantity: 1 
        }, {
            preserveScroll: true,
        });
    };

    // Fungsi untuk toggle wishlist
    const handleWishlistToggle = (e, productId) => {
        e.preventDefault();
        router.post(route('wishlist.toggle', productId), {}, {
            preserveScroll: true,
        });
    };

    // Filter produk berdasarkan pencarian dan kategori secara real-time
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || p.category?.name === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, products]);

    // Ekstrak unique categories dari products
    const categoryOptions = ['all', ...new Set(products.filter(p => p.category).map(p => p.category?.name))];

    return (
        <UserLayout user={auth.user}>
            <Head title="Full Collection" />
            
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900">
                            The Collection
                        </h2>
                        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">
                            Curated Premium Goods / {filteredProducts.length} Items
                        </p>
                    </div>
                    
                    {/* Search Bar Minimalis */}
                    <div className="relative w-full md:w-80 group">
                        <Search 
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" 
                            size={18} 
                        />
                        <input 
                            type="text"
                            placeholder="Search our pieces..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                            >
                                <SearchX size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-3">
                        {categoryOptions.map((cat) => (
                            cat && (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                                        selectedCategory === cat
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'
                                    }`}
                                >
                                    {typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat}
                                </button>
                            )
                        ))}
                    </div>
                    
                    {/* Results Count */}
                    <p className="text-sm text-slate-500 font-semibold">
                        <span className="text-blue-600 font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'item' : 'items'}
                    </p>
                </div>

                {/* Grid Produk */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group flex flex-col">
                                {/* Product Image Card */}
                                <div className="relative aspect-[3/4] bg-[#F1F1F1] rounded-[2rem] overflow-hidden mb-6 group-hover:shadow-2xl transition-all duration-700">
                                    <Link href={route('shop.product.show', product.id)}>
                                        <img 
                                            src={product.image ? `/storage/${product.image}` : '/images/placeholder.jpg'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                            alt={product.name} 
                                        />
                                    </Link>

                                    {/* Floating Wishlist Button */}
                                    <button 
                                        onClick={(e) => handleWishlistToggle(e, product.id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                                    >
                                        <Heart 
                                            size={18} 
                                            className={product.is_wishlisted ? "fill-red-500 text-red-500" : "text-slate-400"} 
                                        />
                                    </button>

                                    {/* Add to Cart Hover Button */}
                                    <button 
                                        onClick={(e) => handleAddToCart(e, product.id)}
                                        disabled={product.stock <= 0}
                                        className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md py-4 rounded-2xl font-black text-[10px] tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all uppercase shadow-xl hover:bg-blue-600 hover:text-white disabled:bg-slate-200 disabled:text-slate-400"
                                    >
                                        {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                                
                                {/* Info Produk */}
                                <div className="flex justify-between items-start mb-1 px-2">
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-slate-800 leading-tight">
                                            {product.name}
                                        </h4>
                                        <span className="flex text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 italic">
                                            {product.category?.name || 'General'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-300">
                                        <Package size={12} />
                                    </div>
                                </div>

                                <p className="font-black text-lg text-slate-950 px-2">
                                    Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty Search State */
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <SearchX size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="font-black text-slate-800 uppercase italic tracking-tighter">
                            No Match Found
                        </h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}