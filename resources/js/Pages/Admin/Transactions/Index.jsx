import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Receipt, CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react';

export default function Index({ auth, transactions }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Transactions" />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Transaction History</h2>
                    <p className="text-sm text-slate-400 font-medium">Pantau semua arus kas dan status pembayaran real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Date</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.data.map((trx) => (
                            <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-700">#TRX-{trx.id}</div>
                                    <div className="text-[11px] text-slate-400 font-medium">{new Date(trx.created_at).toLocaleDateString('id-ID')}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-700">{trx.user?.name || 'Guest'}</div>
                                    <div className="text-[11px] text-slate-400 font-medium">{trx.user?.email || '-'}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase">
                                        {trx.payment_method || 'BANK TRANSFER'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-black text-blue-600">
                                    Rp {new Intl.NumberFormat('id-ID').format(trx.total_price)}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        {trx.status === 'completed' ? (
                                            <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                                <CheckCircle2 size={14} /> Success
                                            </span>
                                        ) : trx.status === 'pending' ? (
                                            <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                                                <Clock size={14} /> Pending
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                                                <XCircle size={14} /> Failed
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}