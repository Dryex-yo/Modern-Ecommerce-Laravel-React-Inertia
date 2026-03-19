import UserLayout from '@/Layouts/UserLayout'; // Pastikan path layout Anda benar
import { Head, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Lock, Trash2, Save, ShieldCheck } from 'lucide-react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    // Form Update Informasi Profil
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    // Form Update Password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="My Account" />

            <div className="max-w-5xl mx-auto py-12 px-6">
                <div className="mb-12">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">My Account</h2>
                    <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-[0.2em]">Manage your personal information and security</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white shadow-xl shadow-blue-100">
                                <User size={40} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black text-slate-800 text-lg">{user.name}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{user.role || 'Member'}</p>
                        </div>

                        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
                            <ShieldCheck className="mb-4 opacity-50" size={32} />
                            <h4 className="font-black text-lg leading-tight">Keamanan Akun</h4>
                            <p className="text-blue-100 text-xs mt-2 leading-relaxed">Pastikan Anda menggunakan password yang kuat untuk menjaga keamanan transaksi Anda.</p>
                        </div>
                    </div>

                    {/* Main Forms */}
                    <div className="md:col-span-2 space-y-10">
                        
                        {/* Update Info */}
                        <section className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                            <h3 className="font-black text-xl text-slate-900 mb-8 flex items-center gap-3">
                                <User className="text-blue-600" size={24} /> Profile Information
                            </h3>
                            
                            <form onSubmit={updateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <InputGroup 
                                        label="Name" 
                                        icon={<User size={18}/>} 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                    />
                                    <InputGroup 
                                        label="Email Address" 
                                        icon={<Mail size={18}/>} 
                                        value={data.email} 
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={errors.email}
                                    />
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <button disabled={processing} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
                                        <Save size={16}/> Save Changes
                                    </button>
                                    {recentlySuccessful && <p className="text-emerald-500 font-bold text-[10px] uppercase animate-pulse">Saved!</p>}
                                </div>
                            </form>
                        </section>

                        {/* Update Password */}
                        <section className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                            <h3 className="font-black text-xl text-slate-900 mb-8 flex items-center gap-3">
                                <Lock className="text-blue-600" size={24} /> Update Password
                            </h3>
                            
                            <form onSubmit={updatePassword} className="space-y-6">
                                <InputGroup 
                                    label="Current Password" 
                                    type="password"
                                    icon={<Lock size={18}/>} 
                                    value={passwordForm.data.current_password} 
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    error={passwordForm.errors.current_password}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup 
                                        label="New Password" 
                                        type="password"
                                        icon={<ShieldCheck size={18}/>} 
                                        value={passwordForm.data.password} 
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        error={passwordForm.errors.password}
                                    />
                                    <InputGroup 
                                        label="Confirm New Password" 
                                        type="password"
                                        icon={<ShieldCheck size={18}/>} 
                                        value={passwordForm.data.password_confirmation} 
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        error={passwordForm.errors.password_confirmation}
                                    />
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <button disabled={passwordForm.processing} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
                                        <Save size={16}/> Change Password
                                    </button>
                                    {passwordForm.recentlySuccessful && <p className="text-emerald-500 font-bold text-[10px] uppercase animate-pulse">Updated!</p>}
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

// Komponen Input Kecil agar kode tidak berulang
function InputGroup({ label, icon, value, onChange, error, type = "text" }) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
                <input
                    type={type}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700"
                    value={value}
                    onChange={onChange}
                />
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase italic tracking-wide">{error}</p>}
        </div>
    );
}