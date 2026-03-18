import React, { useState, useMemo } from 'react';
import { Link, Head, router, usePage } from '@inertiajs/react'; // Tambah usePage
import { 
    ShoppingCart, Package, Search, LogOut, 
    Heart, ShieldCheck, SearchX, ArrowRight,
    Star, Instagram, Twitter, MessageCircle
} from 'lucide-react';

export default function Welcome({ auth, products }) {
    const { settings } = usePage().props; // Ambil data settings global
    const [searchQuery, setSearchQuery] = useState('');
    
    // Fallback Nama Toko
    const shopName = settings?.shop_name || 'DRYEX SHOP';

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                product.name.toLowerCase().includes(searchLower) ||
                (product.category && product.category.toLowerCase().includes(searchLower))
            );
        });
    }, [searchQuery, products]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title={`Welcome to ${shopName} | Premium Store`} />
            
            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
                {/* --- TOP PROMO BAR --- */}
                <div className="bg-slate-900 text-white py-2 text-center text-[10px] font-black uppercase tracking-[0.3em]">
                    Free Shipping for all orders over Rp 1.000.000 • Shop Now
                </div>

                {/* --- MODERN NAVBAR --- */}
                <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/70 backdrop-blur-2xl sticky top-0 z-[100] border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={20} strokeWidth={2.5} />
                        </div>
                        <h1 className="font-black text-xl tracking-tighter text-slate-800 uppercase">
                            {shopName.replace(' SHOP', '')}<span className="text-blue-600">.</span>
                        </h1>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-10 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari koleksi terbaru..." 
                            className="w-full bg-slate-100/50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm transition-all outline-none font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <div className="flex items-center gap-2">
                                <Link href={route('dashboard')} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all">
                                    {auth.user.role === 'admin' ? <ShieldCheck size={16}/> : <UserIcon size={16}/>}
                                    <span>DASHBOARD</span>
                                </Link>
                                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 transition-all">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href={route('login')} className="font-bold text-xs text-slate-500 hover:text-blue-600 px-4 transition-colors">LOGIN</Link>
                                <Link href={route('register')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all uppercase tracking-wider">Join Us</Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <header className="relative px-6 md:px-12 py-24 flex flex-col items-center text-center overflow-hidden">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm mb-8 animate-bounce">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">New Arrivals Available</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
                            Upgrade Your <br />
                            <span className="text-blue-600">Everyday</span> Style.
                        </h2>
                        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                            Selamat datang di <span className="text-slate-900 font-bold">{shopName}</span>. 
                            Temukan produk pilihan yang dirancang untuk mendukung gaya hidup modern Anda.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
                                SHOP NOW <ArrowRight size={18}/>
                            </button>
                        </div>
                    </div>
                    {/* Floating Decorative Elements */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
                </header>

                {/* --- MAIN CONTENT (PRODUCTS) --- */}
                <main className="px-6 md:px-12 pb-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {searchQuery ? `Searching for "${searchQuery}"` : 'Our Collection'}
                            </h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">Menampilkan {filteredProducts.length} produk terbaik untuk Anda.</p>
                        </div>
                        <div className="flex gap-2">
                            {['All', 'New', 'Trending'].map(tab => (
                                <button key={tab} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'All' ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group bg-white rounded-[2.5rem] p-4 border border-slate-50 hover:border-blue-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-50/50">
                                    <div className="relative aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden mb-6">
                                        {product.image ? (
                                            <img src={`/storage/${product.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={48} /></div>
                                        )}
                                        {/* Overlay Cart Button */}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <button className="bg-white text-slate-900 p-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                                                <ShoppingCart size={16}/> ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.category || 'Lifestyle'}</span>
                                            <div className="flex items-center gap-1 text-amber-400"><Star size={10} fill="currentColor"/> <span className="text-[10px] font-bold text-slate-400">4.8</span></div>
                                        </div>
                                        <h4 className="font-bold text-slate-800 mb-2 truncate group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                        <p className="text-xl font-black text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100">
                            <SearchX size={48} className="mx-auto text-slate-200 mb-4" />
                            <h4 className="text-xl font-black text-slate-800">No products found</h4>
                            <p className="text-slate-400 text-sm mt-1">Try another keyword or category.</p>
                        </div>
                    )}
                </main>

                {/* --- FOOTER --- */}
                <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-black text-2xl tracking-tighter mb-6 uppercase">{shopName}</h4>
                            <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-6">
                                Destinasi utama untuk produk berkualitas tinggi dengan pelayanan prima. Kami percaya bahwa gaya hidup premium harus dapat diakses oleh semua orang.
                            </p>
                            <div className="flex gap-4">
                                <SocialIcon icon={<Instagram size={20}/>} />
                                <SocialIcon icon={<Twitter size={20}/>} />
                                <SocialIcon icon={<MessageCircle size={20}/>} />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-6">Quick Links</h5>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Shop All</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">New Arrivals</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Support Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-6">Contact Us</h5>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                {settings?.shop_address || 'Jakarta, Indonesia'}<br />
                                {settings?.shop_phone || '+62 812 3456 789'}
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-slate-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">&copy; 2026 {shopName}. Crafted with Passion.</p>
                        <div className="flex gap-8">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Privacy Policy</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Terms of Service</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
            {icon}
        </a>
    );
}