import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Zap, Award, Users, Target, Heart, CheckCircle2,
    TrendingUp, Shield, Sparkles, ArrowRight
} from 'lucide-react';

export default function AboutIndex() {
    const { auth } = usePage().props;

    const values = [
        {
            icon: Heart,
            title: 'Integritas',
            description: 'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap transaksi dengan pelanggan kami.'
        },
        {
            icon: Zap,
            title: 'Inovasi',
            description: 'Terus mengembangkan teknologi dan layanan untuk memberikan pengalaman terbaik kepada pelanggan.'
        },
        {
            icon: Users,
            title: 'Komunitas',
            description: 'Membangun hubungan jangka panjang dengan pelanggan dan memahami kebutuhan mereka.'
        },
        {
            icon: Shield,
            title: 'Keamanan',
            description: 'Melindungi data dan privasi pelanggan dengan standar keamanan internasional tertinggi.'
        }
    ];

    const achievements = [
        { icon: TrendingUp, number: '100K+', label: 'Pelanggan Puas' },
        { icon: Award, number: '500+', label: 'Produk Berkualitas' },
        { icon: Sparkles, number: '4.8★', label: 'Rating Toko' },
        { icon: CheckCircle2, number: '24/7', label: 'Customer Support' }
    ];

    return (
        <UserLayout user={auth?.user}>
            <Head title="Tentang Kami - About Us" />
            
            <main className="max-w-6xl mx-auto py-16 px-6">
                {/* Hero Section */}
                <div className="mb-20 text-center">
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} fill="currentColor" />
                        Tentang DryShop
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic leading-none mb-6">
                        Belanja Cerdas,<br />Belanja Aman
                    </h1>
                    <p className="text-slate-600 font-bold text-[12px] uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                        Kami adalah toko online terpercaya yang berkomitmen untuk memberikan pengalaman berbelanja terbaik dengan produk berkualitas dan layanan pelanggan yang responsif.
                    </p>
                </div>

                {/* Stats/Achievements */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {achievements.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center hover:shadow-md transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
                                    <Icon size={24} className="text-blue-600" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{item.number}</p>
                                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-12 rounded-[2.5rem] shadow-xl">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
                            <Target size={28} />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic mb-4">Misi</h3>
                        <p className="text-base leading-relaxed font-bold text-blue-100">
                            Memberikan pengalaman berbelanja online yang terbaik dengan menyediakan produk berkualitas tinggi, harga kompetitif, dan layanan pelanggan yang responsif dan profesional.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-12 rounded-[2.5rem] shadow-xl">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic mb-4">Visi</h3>
                        <p className="text-base leading-relaxed font-bold text-purple-100">
                            Menjadi toko online pilihan utama di Indonesia yang dipercaya oleh jutaan pelanggan, dikenal karena integritas, inovasi, dan komitmen terhadap kepuasan pelanggan.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-3">Nilai-Nilai Kami</h2>
                        <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest">Prinsip yang kami pegang teguh</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div key={idx} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-6">
                                        <Icon size={28} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase italic mb-3">{value.title}</h3>
                                    <p className="text-slate-600 text-[12px] leading-relaxed font-medium">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-12 rounded-[2.5rem] border border-slate-100 mb-20">
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-8">Mengapa Memilih DryShop?</h2>
                    
                    <div className="space-y-4">
                        {[
                            'Produk original dengan garansi resmi dari distributor',
                            'Harga kompetitif dengan berbagai promosi menarik setiap hari',
                            'Pengiriman cepat dan aman ke seluruh Indonesia',
                            'Tim customer service yang responsif 24/7',
                            'Sistem pembayaran aman dengan berbagai pilihan metode',
                            'Kebijakan return dan refund yang mudah dan terpercaya'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                                    <CheckCircle2 size={16} className="text-white" />
                                </div>
                                <p className="text-slate-700 font-bold text-[12px] leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-6">Mulai Belanja Sekarang</h3>
                    <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest mb-8">
                        Temukan ribuan produk berkualitas dengan harga terbaik
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('shop.index')}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all"
                        >
                            Jelajahi Katalog <ArrowRight size={16} />
                        </Link>
                        <Link
                            href={route('contact.create')}
                            className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-800 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </main>
        </UserLayout>
    );
}
