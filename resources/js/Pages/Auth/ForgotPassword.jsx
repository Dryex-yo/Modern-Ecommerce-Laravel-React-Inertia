import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
// Pastikan Lucide-react sudah terinstall: npm install lucide-react
import { Mail, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export default function ForgotPassword({ status }) {
    // Inisialisasi form Inertia
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Memastikan post ke route yang benar sesuai Laravel Fortify/Breeze
        post(route('password.email'));
    };

    return (
        // Saya hilangkan <GuestLayout> untuk mencegah double-layout yang bikin putih polos
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
            <Head title="Reset Password" />

            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 p-10 md:p-12 animate-in fade-in zoom-in duration-500">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-blue-50 rounded-3xl text-blue-600 mb-6 shadow-inner">
                        <KeyRound size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase mb-3">
                        Reset
                    </h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Masukkan email untuk mendapatkan tautan pemulihan kata sandi.
                    </p>
                </div>

                {/* Status Berhasil */}
                {status && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-600 text-center uppercase tracking-widest animate-bounce">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    {/* Input Group */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-100 transition-all ${errors.email ? 'ring-2 ring-red-100' : ''}`}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        {/* Error Handling */}
                        {errors.email && (
                            <p className="mt-2 text-[10px] font-black text-red-500 ml-1 uppercase">{errors.email}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {processing ? 'Sending...' : 'Send Reset Link'}
                        {!processing && <Sparkles size={14} className="group-hover:animate-pulse" />}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}