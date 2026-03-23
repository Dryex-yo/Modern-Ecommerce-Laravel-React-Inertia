import ApplicationLogo from '@/Components/ApplicationLogo';
import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingBag, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => { reset('password'); };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]"></div>
            </div>

            <Head title="Masuk ke Akun Anda" />

            <div className="w-full max-w-[440px] relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <ApplicationLogo className="flex-col !gap-4" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                        Masuk untuk melanjutkan belanja
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-slate-900 transition-colors">Lupa?</Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic">{errors.password}</p>}
                        </div>

                        <button
                            disabled={processing}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
                        >
                            Log In <ArrowRight size={16} />
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Belum punya akun? <Link href={route('register')} className="text-blue-600 hover:text-slate-900 transition-colors">Daftar Sekarang</Link>
                </p>
            </div>
        </div>
    );
}