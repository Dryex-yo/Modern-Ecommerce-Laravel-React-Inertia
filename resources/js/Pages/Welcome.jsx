import React, { useState, useMemo } from 'react';
import { UserIcon } from '@heroicons/react/24/solid';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { 
    ShoppingCart, Package, Search, LogOut, 
    ShieldCheck, SearchX, ArrowRight,
    Star, Instagram, Twitter, MessageCircle,
    ShoppingBag, Sparkles
} from 'lucide-react';

export default function Welcome({ auth, products }) {
    const { settings, cart_count } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleAddToCart = (e, productId) => {
        e.preventDefault();
        router.post(route('cart.store'), { 
            product_id: productId, 
            quantity: 1 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Notifikasi atau efek tambahan bisa ditaruh di sini
            },
        });
    };

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
            <Head title={`${shopName}`} />
            
            <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
                {/* --- ULTRA THIN ANNOUNCEMENT BAR --- */}
                <div className="bg-slate-950 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.4em] overflow-hidden">
                    <div className="animate-pulse">Exclusive Spring Collection 2026 • Free Delivery Over Rp 1M</div>
                </div>

                {/* --- GLASS NAVBAR --- */}
                <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform overflow-hidden">
                            {settings?.shop_logo ? (
                                <img src={settings.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingCart size={20} strokeWidth={2.5} />
                            )}
                        </div>
                        <h1 className="font-black text-xl tracking-tighter text-slate-800 uppercase">
                            {shopName.split(' ')[0]}
                            <span className="text-blue-600">
                                {shopName.includes(' ') ? ` ${shopName.split(' ').slice(1).join(' ')}` : '.'}
                            </span>
                        </h1>
                    </Link>
                    {/* Minimalist Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-12 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find your masterpiece..." 
                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 focus:bg-white rounded-full pl-14 pr-6 py-3.5 text-xs transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <div className="flex items-center gap-4">
                                <Link href={route('cart.index')} className="relative p-3 text-slate-600 hover:bg-slate-50 rounded-full transition-all group">
                                    <ShoppingCart size={22} strokeWidth={1.5} />
                                    {cart_count > 0 && (
                                        <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-[3px] border-white shadow-lg animate-bounce">
                                            {cart_count}
                                        </span>
                                    )}
                                </Link>
                                <Link href={route('dashboard')} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-[11px] tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 uppercase">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={route('login')} className="font-black text-[11px] tracking-widest text-slate-900 hover:text-blue-600 px-4 py-2 transition-colors uppercase">Login</Link>
                                <Link href={route('register')} className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-[11px] tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 uppercase">Join Now</Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* --- MINIMALIST HERO --- */}
                <header className="relative px-6 py-12 md:py-16 flex flex-col items-center text-center overflow-hidden border-b border-slate-50">                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent -z-10"></div>
                    
                    <div className="relative z-10 max-w-4xl">
                        <div className="animate-bounce inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full mb-10 border border-blue-100">
                            <Sparkles size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Season 2026</span>
                        </div>
                    {/* OPTIMIZED TYPOGRAPHY & SPACING */}
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-7xl md:text-[100px] font-black text-slate-900 leading-[0.9] tracking-tighter italic">
                            REDEFINE
                        </h2>
                        
                        {/* 4. GRADIENT TYPOGRAPHY (Limitless) */}
                        <h2 className="text-7xl md:text-[100px] font-black leading-[0.9] tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 transition-colors duration-500 hover:from-indigo-600 hover:to-blue-600">
                            LIMITLESS
                        </h2>
                    </div>

                    {/* Deskripsi */}
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed border-l-4 border-blue-50 pl-6 shadow-blue-50/50 shadow-inner">
                        Explore the fusion of contemporary aesthetics and unparalleled comfort in our latest collection.
                    </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link 
                                href={route('shop.index')} 
                                className="group bg-slate-900 text-white px-12 py-5 rounded-full font-black text-[12px] tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl transition-all shadow-xl shadow-slate-200 flex items-center gap-4 uppercase"
                            >
                                Explore Store 
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* --- PRODUCTS GRID --- */}
                <main id="collection" className="px-6 md:px-20 pb-40">
                    <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-10">
                        <div className="flex items-baseline gap-4">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Our Pieces</h3>
                            <span className="text-slate-400 font-bold text-sm">/ {filteredProducts.length} Items</span>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group relative flex flex-col">
                                    <div className="relative aspect-[3/4] bg-[#F1F1F1] rounded-3xl overflow-hidden mb-8 shadow-sm transition-all duration-700 group-hover:shadow-2xl">
                                        <Link href={route('shop.product.show', product.id)} className="block w-full h-full">
                                            {product.image ? (
                                                <img src={`/storage/${product.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={48} strokeWidth={1} /></div>
                                            )}
                                        </Link>
                                        
                                        {/* Floating Quick Add Button */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <button 
                                                onClick={(e) => handleAddToCart(e, product.id)}
                                                className="w-full bg-white/90 backdrop-blur-md text-slate-900 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-2xl uppercase"
                                            >
                                                <ShoppingCart size={16} /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="px-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.category || 'Essential'}</span>
                                            <div className="flex items-center gap-1.5"><Star size={12} fill="#FACC15" className="text-yellow-400"/> <span className="text-[11px] font-bold text-slate-500">4.9</span></div>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-800 mb-1 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">{product.name}</h4>
                                        <p className="text-xl font-black text-slate-950">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
                            <SearchX size={60} className="mx-auto text-slate-200 mb-6" strokeWidth={1} />
                            <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Found Nothing</h4>
                            <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
                        </div>
                    )}
                </main>

                {/* --- FOOTER --- */}
                <footer className="bg-slate-950 text-white pt-32 pb-16 px-6 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-black text-4xl tracking-tighter mb-8 italic uppercase">{shopName}</h4>
                            <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-10 text-lg">
                                The new standard of luxury shopping experience. Curated with passion, delivered with precision.
                            </p>
                            <div className="flex gap-6">
                                <SocialIcon icon={<Instagram size={20}/>} />
                                <SocialIcon icon={<Twitter size={20}/>} />
                                <SocialIcon icon={<MessageCircle size={20}/>} />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-500 mb-8">Navigation</h5>
                            <ul className="space-y-5 text-sm font-bold text-slate-300">
                                <li><Link href="/" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">New Arrivals</Link></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Best Sellers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Archives</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-500 mb-8">Support</h5>
                            <ul className="space-y-5 text-sm font-bold text-slate-300">
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Shipping Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-900 pt-16 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2026 {shopName}. DESIGNED BY PROFESSIONALS.</p>
                        <div className="flex gap-10 text-slate-600 font-bold text-[9px] uppercase tracking-widest">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 hover:border-white transition-all duration-500 shadow-sm">
            {icon}
        </a>
    );
}