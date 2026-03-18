import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FileText, Printer, Download, Calendar } from 'lucide-react';

export default function Index({ auth, reports, summary, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('reports.index'));
    };

    const handlePrint = () => {
        window.print(); // Cara termudah untuk laporan instan
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Sales Reports" />

            {/* Header & Export Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Sales Reports</h2>
                    <p className="text-sm text-slate-400 font-medium">Ekspor data penjualan ke berbagai format.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {/* Tombol Excel */}
                    <a 
                        href={route('reports.excel', { start_date: data.start_date, end_date: data.end_date })} 
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] transition-all"
                    >
                        <Download size={18} />
                        Export Excel
                    </a>

                    {/* Tombol PDF */}
                    <a 
                        href={route('reports.pdf', { start_date: data.start_date, end_date: data.end_date })} 
                        className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] transition-all"
                    >
                        <FileText size={18} />
                        Export PDF
                    </a>

                    {/* Tombol Print (Lama) */}
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                </div>
            </div>

            {/* Filter Card - Hidden when printing */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 print:hidden">
                <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dari Tanggal</label>
                        <input 
                            type="date" 
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                            className="block w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sampai Tanggal</label>
                        <input 
                            type="date" 
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                            className="block w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-600"
                        />
                    </div>
                    <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                        Filter Data
                    </button>
                </form>
            </div>

            {/* Report Paper Style */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 print:shadow-none print:border-none print:p-0">
                <div className="text-center mb-10">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Laporan Penjualan {auth.app_name}</h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{summary.period}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Pendapatan</p>
                        <p className="text-2xl font-black text-blue-600">Rp {new Intl.NumberFormat('id-ID').format(summary.total_revenue)}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Transaksi</p>
                        <p className="text-2xl font-black text-slate-800">{summary.total_orders} Pesanan</p>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-100">
                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase">No. Order</th>
                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase">Pelanggan</th>
                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase">Tanggal</th>
                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {reports.map((order) => (
                            <tr key={order.id}>
                                <td className="py-4 font-bold text-slate-700">#ORD-{order.id}</td>
                                <td className="py-4 text-slate-600 font-medium">{order.user?.name}</td>
                                <td className="py-4 text-slate-500 text-sm">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                <td className="py-4 font-black text-slate-700 text-right">Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}