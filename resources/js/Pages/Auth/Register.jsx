import ApplicationLogo from '@/Components/ApplicationLogo';
import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingBag, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* --- DEKORASI BACKGROUND (BLUR ORBS) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-blue-100/60 rounded-full blur-[130px]"></div>
                <div className="absolute bottom-[-10%] left-[-15%] w-[45%] h-[45%] bg-indigo-100/60 rounded-full blur-[130px]"></div>
            </div>

            <Head title="Buat Akun DRYEX" />

            <div className="w-full max-w-[460px] relative z-10">
                {/* --- LOGO SECTION --- */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <ApplicationLogo className="flex-col !gap-4" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">Mulai Belanja</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] mt-3">Buat akun DRYEX SHOP Anda sekarang</p>
                </div>

                {/* --- REGISTER CARD --- */}
                <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* INPUT NAME */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                                    autoComplete="name"
                                    placeholder="Nama lengkap Anda"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic tracking-wide">{errors.name}</p>}
                        </div>

                        {/* INPUT EMAIL */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                                    autoComplete="username"
                                    placeholder="alamat@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic tracking-wide">{errors.email}</p>}
                        </div>

                        {/* INPUT PASSWORD */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                                    autoComplete="new-password"
                                    placeholder="At minimal 8 karakter"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic tracking-wide">{errors.password}</p>}
                        </div>

                        {/* INPUT CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                                    autoComplete="new-password"
                                    placeholder="Ulangi password Anda"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic tracking-wide">{errors.password_confirmation}</p>}
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none shadow-xl shadow-slate-200 shadow-blue-900/10 hover:shadow-blue-200"
                            >
                                {processing ? 'Memproses...' : 'Daftar Sekarang'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- FOOTER (LOGIN LINK) --- */}
                <p className="text-center mt-10 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Sudah punya akun? <Link href={route('login')} className="text-blue-600 hover:text-slate-900 transition-colors font-black">Masuk di Sini</Link>
                </p>
            </div>
        </div>
    );
}