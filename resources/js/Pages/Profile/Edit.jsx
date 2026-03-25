import React, { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { 
    User, Mail, ShieldCheck, 
    MapPin, Bell, CreditCard, Sparkles, Zap, Camera, Plus,
    Trash2, MapPinned, X, Smartphone, Lock, History, Heart, 
    Settings, Gift, Trash, AlertCircle, Check
} from 'lucide-react';

// Import Partial AddressCreate secara langsung
import AddressCreate from './Partials/AddressCreate';

export default function Edit({ auth, addresses = [] }) {
    const { auth: { user } } = usePage().props;
    
    const [activeTab, setActiveTab] = useState('account');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [copied, setCopied] = useState(false);

    // 1. Form Identity & Avatar
    const { data, setData, post, errors, processing } = useForm({
        name: user.name || '',
        display_name: user.display_name || '', 
        email: user.email || '',
        phone: user.phone || '',               
        avatar: null,
        _method: 'PATCH',
    });

    // 2. Form Password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // 3. Form 2FA
    const twoFAForm = useForm({
        enable_2fa: user.two_factor_enabled || false,
    });

    // Preview avatar
    const [preview, setPreview] = useState(user.avatar_url || null);

    useEffect(() => {
        setPreview(user.avatar_url);
    }, [user.avatar_url]);
    
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const updateProfile = (e) => {
        e.preventDefault();
        post(route('profile.update'), { 
            preserveScroll: true, 
            forceFormData: true,
            onSuccess: () => {
                setData('avatar', null);
            },
            onError: (errors) => console.log('Gagal update:', errors),
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('password.update'), {
            onSuccess: () => {
                setShowPasswordModal(false);
                passwordForm.reset();
            },
        });
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setShowAddressForm(true); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const deleteAddress = (id) => {
        if (confirm('Hapus alamat ini dari daftar pengiriman?')) {
            router.delete(route('addresses.destroy', id));
        }
    };



    const toggle2FA = (e) => {
        e.preventDefault();
        twoFAForm.post(route('two-factor.toggle'), {
            onSuccess: () => {
                setShow2FAModal(false);
            },
        });
    };

    const deleteAccount = (e) => {
        e.preventDefault();
        if (confirm('PERHATIAN: Akun Anda akan dihapus permanen beserta semua data. Tindakan ini tidak dapat dibatalkan!')) {
            router.delete(route('profile.destroy'));
        }
    };

    const copyReferralCode = () => {
        const code = user.referral_code || 'REF-' + user.id;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <UserLayout user={user}>
            <Head title="Account Central" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12 animate-in fade-in duration-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-blue-600" size={16} />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Master Settings</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">Account Central</h2>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* LEFT SIDE: Navigation */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden relative group/avatar">
                                    {preview ? (
                                        <img key={preview} src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black italic">{user.name.charAt(0)}</span>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                        <Camera size={20} className="text-white mb-1" />
                                        <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                    </label>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg ring-4 ring-white">
                                    <Zap size={14} fill="currentColor" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none tracking-tighter">{user.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 italic">{user.email}</p>
                            {errors.avatar && <p className="text-red-500 text-[9px] font-black uppercase italic mt-2">{errors.avatar}</p>}
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-4 text-white shadow-2xl relative overflow-hidden">
                            <nav className="space-y-1 relative z-10">
                                <NavButton icon={<ShieldCheck size={18} />} label="Account Info" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
                                <NavButton icon={<Lock size={18} />} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                                <NavButton icon={<History size={18} />} label="Order History" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                                <NavButton icon={<Heart size={18} />} label="Wishlist" active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} />
                                <NavButton icon={<Gift size={18} />} label="Referral" active={activeTab === 'referral'} onClick={() => setActiveTab('referral')} />
                                <NavButton icon={<Settings size={18} />} label="Preferences" active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} />
                                <NavButton icon={<Bell size={18} />} label="Alerts Center" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
                            </nav>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Content */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {activeTab === 'account' && (
                            <div className="space-y-8">
                                {/* IDENTITY FORM */}
                                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem]"><User size={24} /></div>
                                        <h4 className="text-xl font-black italic uppercase text-slate-800">Identity Details</h4>
                                    </div>
                                    <form onSubmit={updateProfile} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <InputGroup 
                                                label="Full Name (For Shipping)" 
                                                value={data.name} 
                                                onChange={e => setData('name', e.target.value)} 
                                                icon={<User size={18}/>} 
                                                error={errors.name} 
                                                placeholder="e.g. John Doe"
                                            />
                                            <InputGroup 
                                                label="Display Name" 
                                                value={data.display_name} 
                                                onChange={e => setData('display_name', e.target.value)} 
                                                icon={<Zap size={18} className="text-orange-400"/>} 
                                                error={errors.display_name} 
                                                placeholder="How should we call you?"
                                            />
                                            <InputGroup 
                                                label="Email Address" 
                                                value={data.email} 
                                                onChange={e => setData('email', e.target.value)} 
                                                icon={<Mail size={18}/>} 
                                                error={errors.email} 
                                            />
                                            <InputGroup 
                                                label="Phone Number (WhatsApp)" 
                                                value={data.phone} 
                                                onChange={e => setData('phone', e.target.value)} 
                                                icon={<Smartphone size={18}/>} 
                                                error={errors.phone} 
                                                placeholder="0812xxxx"
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end pt-4">
                                            <button 
                                                disabled={processing} 
                                                type="submit"
                                                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 active:scale-95 flex items-center gap-3"
                                            >
                                                {processing && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                                Update Profile
                                            </button>
                                        </div>
                                    </form>
                                </section>

                                {/* ADDRESS LIST */}
                                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-[1.5rem]"><MapPinned size={24} /></div>
                                            <h4 className="text-xl font-black italic uppercase text-slate-800">Shipping Addresses</h4>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setShowAddressForm(!showAddressForm);
                                                if(showAddressForm) setEditingAddress(null);
                                            }} 
                                            className={`p-3 rounded-xl transition-all ${showAddressForm ? 'bg-red-50 text-red-400' : 'bg-slate-50 text-slate-400 hover:text-emerald-500'}`}
                                        >
                                            {showAddressForm ? <X size={20} /> : <Plus size={20} />}
                                        </button>
                                    </div>
                                    
                                    {showAddressForm && (
                                        <AddressCreate 
                                            address={editingAddress}
                                            onClose={() => {
                                                setShowAddressForm(false);
                                                setEditingAddress(null);
                                            }} 
                                        />
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {addresses.length > 0 ? (
                                            addresses.map((address) => (
                                                <div key={address.id} className={`p-6 rounded-[2rem] border-2 transition-all group relative ${address.is_default ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-50 bg-white hover:border-blue-100'}`}>
                                                    <h5 className="font-black text-slate-800 uppercase text-[11px] mb-2 tracking-widest italic">{address.label}</h5>
                                                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase pr-8">{address.full_address}, {address.city}</p>
                                                    
                                                    <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditClick(address)} className="text-[9px] font-black uppercase text-slate-400 hover:text-blue-600">Edit</button>
                                                        <button onClick={() => deleteAddress(address.id)} className="text-[9px] font-black uppercase text-red-400 hover:text-red-600">Remove</button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            !showAddressForm && (
                                                <div className="md:col-span-2 py-12 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                                                    <MapPin size={32} className="mb-2 opacity-20" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest italic">No Addresses Saved</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>


                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                {/* CHANGE PASSWORD */}
                                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-red-50 text-red-600 rounded-[1.5rem]"><Lock size={24} /></div>
                                        <h4 className="text-xl font-black italic uppercase text-slate-800">Change Password</h4>
                                    </div>
                                    <button 
                                        onClick={() => setShowPasswordModal(true)}
                                        className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-xl"
                                    >
                                        Update Password
                                    </button>
                                </section>

                                {/* TWO-FACTOR AUTH */}
                                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-purple-50 text-purple-600 rounded-[1.5rem]"><Sparkles size={24} /></div>
                                            <div>
                                                <h4 className="text-xl font-black italic uppercase text-slate-800">Two-Factor Authentication</h4>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">Tingkatkan keamanan akun dengan 2FA</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShow2FAModal(true)}
                                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${user.two_factor_enabled ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                                    >
                                        {user.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                                    </button>
                                </section>

                                {/* ACCOUNT DELETION */}
                                <section className="bg-red-50 p-10 rounded-[3.5rem] border-2 border-red-100 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-red-100 text-red-600 rounded-[1.5rem]"><AlertCircle size={24} /></div>
                                        <div>
                                            <h4 className="text-xl font-black italic uppercase text-red-800">Delete Account</h4>
                                            <p className="text-[10px] text-red-600 font-bold mt-1">Tindakan ini tidak dapat dibatalkan</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowDeleteAccountModal(true)}
                                        className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-800 transition-all shadow-xl"
                                    >
                                        Delete My Account
                                    </button>
                                </section>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem]"><History size={24} /></div>
                                    <h4 className="text-xl font-black italic uppercase text-slate-800">Order History</h4>
                                </div>
                                <Link href={route('orders.index')} className="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl">
                                    View All Orders
                                </Link>
                            </section>
                        )}

                        {activeTab === 'wishlist' && (
                            <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-4 bg-red-50 text-red-600 rounded-[1.5rem]"><Heart size={24} /></div>
                                    <h4 className="text-xl font-black italic uppercase text-slate-800">My Wishlist</h4>
                                </div>
                                <Link href={route('wishlist.index')} className="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl">
                                    View Wishlist
                                </Link>
                            </section>
                        )}

                        {activeTab === 'referral' && (
                            <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-4 bg-purple-600 text-white rounded-[1.5rem]"><Gift size={24} /></div>
                                    <div>
                                        <h4 className="text-xl font-black italic uppercase text-slate-800">Referral Program</h4>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1">Ajak teman dan dapatkan bonus</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 mb-6">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">Your Referral Code</p>
                                    <div className="flex items-center gap-4">
                                        <code className="flex-1 bg-slate-50 p-4 rounded-xl font-black text-lg text-blue-600 text-center">
                                            {user.referral_code || 'REF-' + user.id}
                                        </code>
                                        <button 
                                            onClick={copyReferralCode}
                                            className={`px-6 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
                                        >
                                            {copied ? '✓ Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Bonus Referral</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
                                            <Check size={16} className="text-emerald-600" /> Konsumen: Diskon hingga 20%
                                        </li>
                                        <li className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
                                            <Check size={16} className="text-emerald-600" /> Referrer: Bonus Rp 50.000/referral
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-8">
                                {/* NOTIFICATION PREFERENCES */}
                                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem]"><Settings size={24} /></div>
                                        <h4 className="text-xl font-black italic uppercase text-slate-800">Notification Settings</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {['Email Marketing', 'Order Updates', 'Promo & Deals', 'Security Alerts'].map((item, idx) => (
                                            <label key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                                                <span className="font-bold text-slate-700">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {/* PRIVACY PREFERENCES */}
                                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-green-50 text-green-600 rounded-[1.5rem]"><ShieldCheck size={24} /></div>
                                        <h4 className="text-xl font-black italic uppercase text-slate-800">Privacy Settings</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {['Profile Visibility', 'Show in Search', 'Allow Messages'].map((item, idx) => (
                                            <label key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                                                <span className="font-bold text-slate-700">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'alerts' && (
                            <div className="bg-white p-24 rounded-[4rem] border border-slate-50 flex flex-col items-center text-center shadow-sm">
                                <div className="p-8 bg-slate-50 text-slate-200 rounded-full mb-8"><Bell size={56} /></div>
                                <h3 className="text-3xl font-black italic uppercase text-slate-800">All Caught Up!</h3>
                                <p className="text-slate-400 text-sm mt-4">Tidak ada notifikasi baru saat ini</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL: Change Password */}
            {showPasswordModal && (
                <Modal title="Change Password" onClose={() => setShowPasswordModal(false)}>
                    <form onSubmit={updatePassword} className="space-y-6">
                        <InputGroup 
                            label="Current Password" 
                            type="password"
                            value={passwordForm.data.current_password} 
                            onChange={e => passwordForm.setData('current_password', e.target.value)} 
                            error={passwordForm.errors.current_password}
                        />
                        <InputGroup 
                            label="New Password" 
                            type="password"
                            value={passwordForm.data.password} 
                            onChange={e => passwordForm.setData('password', e.target.value)} 
                            error={passwordForm.errors.password}
                        />
                        <InputGroup 
                            label="Confirm Password" 
                            type="password"
                            value={passwordForm.data.password_confirmation} 
                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)} 
                            error={passwordForm.errors.password_confirmation}
                        />
                        <button type="submit" disabled={passwordForm.processing} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95">
                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </Modal>
            )}

            {/* MODAL: 2FA */}
            {show2FAModal && (
                <Modal title="Two-Factor Authentication" onClose={() => setShow2FAModal(false)}>
                    <div className="space-y-6">
                        <p className="text-slate-600 text-sm">Aktifkan 2FA untuk membuat akun Anda lebih aman. Anda akan diminta memasukkan kode saat login.</p>
                        <button 
                            onClick={toggle2FA}
                            className={`w-full py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl ${user.two_factor_enabled ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                        >
                            {user.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* MODAL: Delete Account */}
            {showDeleteAccountModal && (
                <Modal title="Delete Account" onClose={() => setShowDeleteAccountModal(false)}>
                    <div className="space-y-6">
                        <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[2rem]">
                            <p className="text-red-800 font-bold text-sm">⚠️ Peringatan: Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus permanen.</p>
                        </div>
                        <button 
                            onClick={deleteAccount}
                            className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-800 transition-all shadow-xl"
                        >
                            Yes, Delete My Account
                        </button>
                        <button 
                            onClick={() => setShowDeleteAccountModal(false)}
                            className="w-full bg-slate-200 text-slate-900 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-300 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

        </UserLayout>
    );
}

function NavButton({ icon, label, active, onClick }) {
    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5 opacity-50'}`}
        >
            <div className="flex items-center gap-4">
                {icon}
                <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
            </div>
        </button>
    );
}

function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] p-12 w-full max-w-md relative shadow-2xl">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
                <h3 className="text-3xl font-black italic uppercase text-slate-900 mb-8 tracking-tighter">{title}</h3>
                {children}
            </div>
        </div>
    );
}

function InputGroup({ label, icon, value, onChange, type = "text", error, ...props }) {
    return (
        <div className="group w-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">{icon}</div>}
                <input 
                    type={type} 
                    className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl ${icon ? 'pl-14' : 'px-6'} pr-6 py-5 focus:bg-white focus:border-blue-100 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300`} 
                    value={value} 
                    onChange={onChange}
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-[9px] font-black uppercase italic mt-2 ml-1">{error}</p>}
        </div>
    );
}