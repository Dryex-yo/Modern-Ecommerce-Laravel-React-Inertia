import React, { useState, useMemo, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { UserIcon } from '@heroicons/react/24/solid';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { 
    ShoppingCart, Package, Search, LogOut, 
    ShieldCheck, SearchX, ArrowRight,
    Star, Instagram, Twitter, MessageCircle,
     Sparkles, Sun, Moon, ShoppingBag, 
    ArrowLeft, Clock, CheckCircle2, 
    ChevronRight, Zap, TrendingUp, Heart
} from 'lucide-react';

export default function Welcome({ auth, products }) {
    const { settings, cart_count } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const [visibleElements, setVisibleElements] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState(products);
    
    // Track scroll for parallax and animations
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            
            // Check which elements are in viewport
            const elements = document.querySelectorAll('[data-scroll-animate]');
            const elementVisibility = {};
            
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                elementVisibility[el.id] = isVisible;
            });
            
            setVisibleElements(elementVisibility);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter products based on search and category
    useEffect(() => {
        let filtered = products;

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, products]);
    
    const categories = ['all', ...new Set(products.filter(p => p.category).map(p => p.category))];
    
    const handleAddToCart = (productId) => {
        router.post(route('cart.store'), { 
            product_id: productId, 
            quantity: 1 
        }, {
            preserveScroll: true,
            onStart: () => {
                // Opsional: bisa tambah loading state jika mau
            },
            onSuccess: () => {
                toast.success('Berhasil ditambahkan ke keranjang!', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#0F172A', // Slate 900 biar cocok dengan tema Anda
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    },
                });            
            },
            onError: () => {
                toast.error('Gagal menambahkan produk.');
            }
        });
    };

    const shopName = settings?.shop_name || 'DRYEX SHOP';
    
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Toaster />
            <Head title={`${shopName}`} />
            
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
                {/* --- ANNOUNCEMENT BAR --- */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-6 text-center text-xs font-semibold tracking-widest overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/5"></div>
                    <div className="relative animate-pulse flex items-center justify-center gap-2">
                        <Sparkles size={14} className="animate-spin" />
                        Spring 2026 Collection • Free Shipping Over Rp 1M • Latest Collections
                    </div>
                </div>

                {/* --- NAVBAR --- */}
                <nav className="fixed top-12 left-0 right-0 z-[99] flex justify-between items-center px-6 md:px-20 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all overflow-hidden">
                            {settings?.shop_logo ? (
                                <img src={settings.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingBag size={22} strokeWidth={1.5} />
                            )}
                        </div>
                        
                        <div className="flex flex-col;">
                            <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                                {shopName.split(' ')[0]}
                                <span className="text-blue-600 dark:text-blue-400">
                                    {shopName.includes(' ') ? ` ${shopName.split(' ').slice(1).join(' ')}` : '.'}
                                </span>
                            </h1>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold tracking-widest">ONLINE STORE</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-8">
                        {auth.user ? (
                            <div className="flex items-center gap-6">
                                {/* TAMPILAN KHUSUS USER BIASA */}
                                {auth.user?.role === 'user' && (
                                    <div className="flex items-center gap-5">
                                        {/* Keranjang Belanja */}
                                        <Link 
                                            href={route('cart.index')} 
                                            className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all group"
                                        >
                                            <ShoppingCart size={20} strokeWidth={1.5} />
                                            {cart_count > 0 && (
                                                <span className="absolute top-1 right-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[7px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
                                                    {cart_count}
                                                </span>
                                            )}
                                        </Link>

                                        {/* Tombol Dashboard Utama */}
                                        <Link href={route('dashboard')}>
                                            <button className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-blue-600/30 hover:from-blue-700 hover:to-blue-600 dark:hover:shadow-blue-600/50 transition-all active:scale-95 uppercase">
                                                <Zap size={14} />
                                                Dashboard
                                            </button>
                                        </Link>

                                        {/* Tombol Profile */}
                                        <Link href={route('profile.edit')}>
                                            <button className="flex items-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95 uppercase">
                                                Account
                                            </button>
                                        </Link>
                                    </div>
                                )}

                                {/* TAMPILAN KHUSUS ADMIN */}
                                {auth.user.role === 'admin' && (
                                    <Link href={route('admin.dashboard')}>
                                        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95 uppercase">
                                            <ShieldCheck size={16} />
                                            Admin
                                        </button>
                                    </Link>
                                )}

                                {/* TOMBOL LOGOUT */}
                                <button onClick={handleLogout} className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            /* TAMPILAN GUEST */
                            <div className="flex items-center gap-4">
                                <Link href={route('login')} className="font-bold text-xs tracking-widest text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 transition-colors uppercase">Login</Link>
                                <Link href={route('register')} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 uppercase">Join Now</Link>
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                </nav>

                {/* --- PREMIUM HERO SECTION --- */}
                <header 
                    className="relative px-6 flex flex-col items-center text-center overflow-hidden border-b border-slate-200/30 dark:border-slate-700/30 min-h-screen justify-center pt-24"
                    style={{
                        transform: `translateY(${scrollY * 0.4}px)`,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)'
                    }}
                >
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden -z-5">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-blue-100/10 rounded-full blur-3xl animate-blob"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-slate-200/30 to-slate-100/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-blue-100/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                    </div>
                    
                    <div className="relative z-10 max-w-6xl w-full">
                        {/* Badge */}
                        <div 
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 px-6 py-3 rounded-full mb-8 border border-blue-200 shadow-md hover:shadow-lg hover:bg-blue-100 transition-all duration-300"
                            data-scroll-animate
                            id="badge"
                            style={{
                                opacity: visibleElements['badge'] ? 1 : 0.5,
                                transform: `scale(${visibleElements['badge'] ? 1 : 0.95})`
                            }}
                        >
                            <Sparkles size={16} className="animate-spin text-blue-600" />
                            <span className="text-xs font-black uppercase tracking-widest">✨ New Arrivals Spring 2026</span>
                        </div>

                        {/* Premium Headline */}
                        <div className="flex flex-col items-center gap-0 mb-6 py-2 overflow-visible">
                            <h2 
                                className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-950 leading-[0.9] tracking-tighter uppercase px-4 hover:text-blue-700 transition-colors duration-500"
                                data-scroll-animate
                                id="headline1"
                                style={{
                                    opacity: visibleElements['headline1'] ? 1 : 0.3,
                                    transform: `translateY(${visibleElements['headline1'] ? 0 : 40}px)`
                                }}
                            >
                                Luxury
                            </h2>
                            <h2 
                                className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 uppercase px-6 pb-2"
                                data-scroll-animate
                                id="headline2"
                                style={{
                                    opacity: visibleElements['headline2'] ? 1 : 0.3,
                                    transform: `translateY(${visibleElements['headline2'] ? 0 : 40}px)`
                                }}
                            >
                                Redefined
                            </h2>
                        </div>

                        {/* Premium Description */}
                        <p 
                            className="text-slate-600 text-base md:text-lg font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-blue-400 pl-8 mb-10 hover:border-blue-600 hover:text-slate-800 transition-all duration-300"
                            data-scroll-animate
                            id="description"
                            style={{
                                opacity: visibleElements['description'] ? 1 : 0.3,
                                transform: `translateY(${visibleElements['description'] ? 0 : 40}px)`
                            }}
                        >
                            Curated collection of <span className="text-blue-600 font-bold">quality fashion & lifestyle</span> products. Discover excellent selections handpicked for our valued customers.
                        </p>

                        {/* CTA Buttons */}
                        <div 
                            className="flex flex-wrap justify-center gap-8"
                            data-scroll-animate
                            id="cta"
                            style={{
                                opacity: visibleElements['cta'] ? 1 : 0.3,
                                transform: `translateY(${visibleElements['cta'] ? 0 : 40}px)`
                            }}
                        >
                            <Link 
                                href={route('shop.index')} 
                                className="group relative bg-gradient-to-r from-slate-950 to-slate-800 text-white px-12 py-4 rounded-xl font-black text-xs tracking-widest hover:shadow-2xl hover:shadow-slate-900/50 transition-all active:scale-95 uppercase flex items-center gap-3 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center gap-3">
                                    <TrendingUp size={18} />
                                    Shop Collection
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </Link>
                            <button 
                                onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative border-2 border-slate-900 text-slate-900 px-12 py-4 rounded-xl font-black text-xs tracking-widest hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 uppercase flex items-center gap-3"
                            >
                                Discover More
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <p className="text-xs font-semibold tracking-widest uppercase">Scroll to explore</p>
                            <ChevronRight size={20} className="rotate-90" />
                        </div>
                    </div>
                </header>

                {/* --- PREMIUM PRODUCTS SECTION --- */}
                <main id="collection" className="py-32 bg-white dark:bg-slate-900">
                    {/* Section Header */}
                    <div className="px-6 md:px-20 mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px w-12 bg-gradient-to-r from-blue-600 to-transparent"></div>
                            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Featured Collection</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-tight mb-4">
                            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">Selection</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">Handpicked items curated for the discerning customer seeking quality and style.</p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="px-6 md:px-20 mb-12">
                        {/* Search Box */}
                        <div className="relative group mb-8">
                            <input
                                type="text"
                                placeholder="Search premium items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-8 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300"
                            />
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                                >
                                    <SearchX size={20} />
                                </button>
                            )}
                        </div>

                        {/* Category Filter with premium styling */}
                        <div className="flex gap-3 flex-wrap">
                            {categories.map((cat) => (
                                cat && (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                                            selectedCategory === cat
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
                                        }`}
                                    >
                                        {typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat}
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Results Count */}
                        <p className="text-sm text-slate-500 font-semibold mt-6">
                            <span className="text-blue-600 font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="px-6 md:px-20">
                            {/* Premium Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        data-scroll-animate
                                        id={`product-${product.id}`}
                                        style={{
                                            opacity: visibleElements[`product-${product.id}`] ? 1 : 0,
                                            transform: `translateY(${visibleElements[`product-${product.id}`] ? 0 : 40}px)`,
                                            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            transitionDelay: `${index * 0.05}s`
                                        }}
                                    >
                                        <ProductCard product={product} handleAddToCart={handleAddToCart} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* No Results State - Premium Style */
                        <div className="px-6 md:px-20 flex flex-col items-center justify-center py-32">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <SearchX size={48} className="text-slate-400" />
                            </div>
                            <p className="text-slate-700 font-bold text-xl mb-4">No items found</p>
                            <p className="text-slate-500 text-center max-w-md mb-8">Try adjusting your search or filter criteria to find what you're looking for.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </main>
                {/* --- PREMIUM FOOTER --- */}
                <footer className="bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-950 dark:to-slate-950 text-white pt-40 pb-12 px-6 md:px-20 border-t border-slate-800 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="col-span-1 md:col-span-2">
                            <div className="mb-8">
                                <h4 className="font-black text-3xl tracking-tight mb-2 uppercase text-white">{shopName}</h4>
                                <p className="text-xs text-blue-400 dark:text-blue-300 font-semibold tracking-widest">ONLINE STORE</p>
                            </div>
                            <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-10">
                                Curated selection of premium items for the discerning customer. Experience luxury redefined.
                            </p>
                            <div className="flex gap-5">
                                <SocialIcon icon={<Instagram size={20}/>} />
                                <SocialIcon icon={<Twitter size={20}/>} />
                                <SocialIcon icon={<MessageCircle size={20}/>} />
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-widest text-blue-500 mb-8">Explore</h5>
                            <ul className="space-y-4 text-sm font-medium text-slate-300">
                                <li><Link href="/" className="hover:text-blue-400 transition-colors">New Arrivals</Link></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Best Sellers</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Collections</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-widest text-blue-500 mb-8">Support</h5>
                            <ul className="space-y-4 text-sm font-medium text-slate-300">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Returns</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-500 text-xs font-semibold tracking-widest">&copy; 2026 {shopName}. All Rights Reserved.</p>
                        <div className="flex gap-8 text-slate-500 text-xs font-semibold tracking-widest">
                            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center text-slate-400 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white hover:border-blue-400 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-blue-600/30">
            {icon}
        </a>
    );
}

function ProductCard({ product, handleAddToCart, onAdd }) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <div className="w-full flex-shrink-0 group/card flex flex-col h-full">
            
            {/* Premium Image Container */}
            <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:shadow-blue-600/20 group-hover/card:-translate-y-3 group-hover/card:border-blue-300 dark:group-hover/card:border-blue-500/50">
                
                <Link href={route('shop.product.show', product.id)} className="block w-full h-full relative">
                    {product.image ? (
                        <img 
                            src={`/storage/${product.image}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
                            alt={product.name} 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                            <Package size={48} />
                        </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                </Link>

                {/* Premium Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
                        ✨ NEW
                    </span>
                </div>
                
                {/* Wishlist Button - Premium Style */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                    className="absolute top-4 right-4 w-11 h-11 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover/card:opacity-100 transform group-hover/card:scale-100 scale-75 transition-transform duration-300 shadow-lg border border-white/20"
                >
                    <Heart 
                        size={20} 
                        className={`transition-all ${isWishlisted ? 'fill-blue-600 text-blue-600' : 'text-slate-600'}`}
                    />
                </button>
                
                {/* Premium Add to Cart Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                    
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product.id);
                        }}
                        className="w-full relative overflow-hidden rounded-xl py-3 text-xs font-black tracking-widest uppercase text-white 
                                    bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-400
                                    transition-all duration-300
                                    hover:shadow-lg hover:shadow-blue-600/50 hover:scale-105
                                    active:scale-95"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <ShoppingCart size={16} />
                            Add to Cart
                        </span>
                    </button>

                </div>
            </div>

            {/* Premium Info Section */}
            <div className="mt-6 px-1 flex flex-col gap-3 flex-grow">
                {/* Product Name */}
                <Link 
                    href={route('shop.product.show', product.id)}
                    className="font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                >
                    {product.name}
                </Link>
                
                {/* Category */}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer w-fit">
                    {product.category}
                </span>

                {/* Price */}
                <div className="flex justify-between items-end gap-4 mt-auto pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="font-black text-lg text-blue-600 dark:text-blue-400">
                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </p>
                </div>
            </div>
        </div>
    );
}