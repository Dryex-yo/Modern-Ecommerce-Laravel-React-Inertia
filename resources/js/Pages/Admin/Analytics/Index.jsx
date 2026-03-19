import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { DollarSign, ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';
// Import komponen-komponen yang dibutuhkan dari Recharts
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Index({ auth, salesChartData, stats }) {
    
    // Helper untuk format mata uang Rupiah
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Analytics Dashboard" />

            {/* Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Performa Bisnis</h2>
                <p className="text-slate-500 font-medium text-lg mt-1">Analisis mendalam tentang penjualan dan tren toko Anda.</p>
            </div>

            {/* Grid Kartu Statistik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <AnalyticStatCard 
                    label="TOTAL PENDAPATAN" 
                    value={formatRupiah(stats.total_revenue)} 
                    icon={<DollarSign size={22}/>} 
                    color="text-emerald-600" 
                    bgColor="bg-emerald-50"
                />
                <AnalyticStatCard 
                    label="RATA-RATA ORDER" 
                    value={formatRupiah(stats.avg_order_value)} 
                    icon={<ShoppingCart size={22}/>} 
                    color="text-blue-600" 
                    bgColor="bg-blue-50"
                />
                <AnalyticStatCard 
                    label="TINGKAT KONVERSI" 
                    value={`${stats.conversion_rate}%`} 
                    icon={<TrendingUp size={22}/>} 
                    color="text-purple-600" 
                    bgColor="bg-purple-50"
                    // Opsional: Tampilkan total pengunjung di bawahnya
                    description={`${stats.total_visitors} Pengunjung`} 
                />
                <AnalyticStatCard 
                    label="LABA KOTOR" 
                    value={formatRupiah(stats.gross_profit)} 
                    icon={<BarChart3 size={22}/>} 
                    color="text-orange-600" 
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Bagian Grafik Utama */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-slate-800">Tren Pendapatan Bulanan</h3>
                    <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 px-5 py-3 focus:ring-2 focus:ring-blue-100 cursor-pointer">
                        <option>6 Bulan Terakhir</option>
                        <option>Tahun Ini</option>
                    </select>
                </div>

                {/* Wadah Grafik yang Responsif */}
                <div className="w-full min-h-[384px]">
                    <ResponsiveContainer width="100%" height={384}>
                        <AreaChart
                            data={salesChartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            {/* Garis-garis latar belakang */}
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            {/* Sumbu X (Bulan) */}
                            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            {/* Sumbu Y (Nilai uang - disembunyikan agar bersih) */}
                            <YAxis hide={true} />
                            {/* Kotak Info saat Kursor diarahkan (Interaktif) */}
                            <Tooltip 
                                contentStyle={{ border: 'none', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}
                                labelStyle={{ fontWeight: 'black', color: '#1E293B', marginBottom: '0.5rem', fontSize: '1rem' }}
                                itemStyle={{ fontWeight: 'bold', color: '#475569' }}
                                formatter={(value, name) => [name === 'revenue' ? formatRupiah(value) : value, name === 'revenue' ? 'Pendapatan' : 'Total Order']}
                            />
                            {/* Definisi Area Grafik dengan Gradasi */}
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            {/* Area Grafik Utama */}
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#2563EB" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                activeDot={{ r: 8, stroke: 'white', strokeWidth: 4, fill: '#2563EB' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </AdminLayout>
    );
}

// Komponen Kecil untuk Kartu Statistik di halaman Analytics
function AnalyticStatCard({ label, value, icon, color, bgColor }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-5">
                <div className={`p-3.5 rounded-2xl ${bgColor} ${color}`}>
                    {icon}
                </div>
                <p className="text-xs font-black text-slate-400 tracking-widest uppercase">{label}</p>
            </div>
            <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
        </div>
    );
}