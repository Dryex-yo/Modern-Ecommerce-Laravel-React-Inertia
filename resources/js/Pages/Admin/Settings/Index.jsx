import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Save, Store, Mail, Image, Phone, MapPin, 
    Bell, ShoppingCart, RotateCcw, Package, FileText, 
    Volume2, Settings as SettingsIcon,
    CreditCard, Truck, Landmark, Map
} from 'lucide-react';

export default function Index({ auth, settings }) {
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, post, processing, errors } = useForm({
        // General
        shop_name: settings.shop_name || '',
        shop_logo: null,
        shop_email: settings.shop_email || '',
        shop_phone: settings.shop_phone || '',
        shop_address: settings.shop_address || '',
        // Preferences
        notif_orders: settings.notif_orders === '1',
        notif_stock: settings.notif_stock === '1',
        notif_sound: settings.notif_sound === '1',
        notif_email: settings.notif_email || false,
        // Payment & Shipping (Tab Baru)
        bank_name: settings.bank_name || '',
        bank_account: settings.bank_account || '',
        bank_holder: settings.bank_holder || '',
        shipping_origin: settings.shipping_origin || '',
        shipping_flat_rate: settings.shipping_flat_rate || '0',
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Gunakan forceFormData: true jika dirasa file tidak terkirim
        post(route('admin.settings.store'), {
        forceFormData: true, // Wajib true karena ada upload file (shop_logo)
        onSuccess: () => {
                // Jika ada preview logo, kita bersihkan
                if (data.shop_logo_preview) {
                    URL.revokeObjectURL(data.shop_logo_preview);
                    setData('shop_logo_preview', null);
                }
                alert('Settings updated successfully!');
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all settings to default? This will delete your current logo.')) {
            router.post(route('admin.settings.reset'), {}, {
                onSuccess: () => {
                    // Beri notifikasi jika perlu
                    console.log('Reset success');
                },
            });
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="System Settings" />
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-4 text-xs font-bold">
                    {JSON.stringify(errors)}
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 relative z-10">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-blue-800">System Settings</h2>
                    <p className="text-sm text-slate-500 font-bold mt-1">Konfigurasi pusat kendali operasional toko Anda.</p>
                </div>
                
                {/* Modern Pill Tab Switcher */}
                <div className="flex bg-slate-900/5 p-1.5 rounded-[2rem] w-fit border border-slate-200/50 backdrop-blur-xl overflow-x-auto max-w-full shadow-inner relative">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<SettingsIcon size={14}/>} label="GENERAL" />
                    <TabButton active={activeTab === 'notif'} onClick={() => setActiveTab('notif')} icon={<Bell size={14}/>} label="PREFERENCES" />
                    <TabButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} icon={<CreditCard size={14}/>} label="PAYMENTS" />
                </div>
            </div>

            <form onSubmit={submit} className="w-full space-y-8">

                    {/* --- TAB 1: GENERAL --- */}
                    {activeTab === 'general' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 p-8 md:p-12 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            {/* Header Bagian */}
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Store size={24}/>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800">Store Identity</h3>
                                    <p className="text-xs text-slate-400 font-medium">Informasi dasar yang akan tampil di struk dan profil toko.</p>
                                </div>
                            </div>
                    
                            <div className="space-y-6">
                                {/* Input Nama Toko (Full Width) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Toko</label>
                                    <div className="relative group">
                                        <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input 
                                            type="text"
                                            value={data.shop_name}
                                            onChange={e => setData('shop_name', e.target.value)}
                                            placeholder="Masukkan nama toko..."
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Input Logo */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Logo</label>
                                    <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                        {/* Preview Container */}
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center overflow-hidden bg-white">
                                                {data.shop_logo_preview || settings.shop_logo ? (
                                                    <img 
                                                        src={data.shop_logo_preview || settings.shop_logo} 
                                                        className="w-full h-full object-contain"
                                                        alt="Shop Logo"
                                                    />
                                                ) : (
                                                    <Image className="text-slate-200" size={40} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-slate-700">Ganti Logo Toko</span>
                                                <p className="text-[11px] text-slate-400 font-medium">Format: JPG, PNG, atau SVG. Maksimal 2MB.</p>
                                            </div>
                                            
                                            <input 
                                                type="file" 
                                                id="shop_logo"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setData(prev => ({
                                                            ...prev,
                                                            shop_logo: file,
                                                            shop_logo_preview: URL.createObjectURL(file)
                                                        }));
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            
                                            <label 
                                                htmlFor="shop_logo"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all"
                                            >
                                                <Image size={14} />
                                                PILIH GAMBAR
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Input Email CS */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Official</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                            <input 
                                                type="email"
                                                value={data.shop_email}
                                                onChange={e => setData('shop_email', e.target.value)}
                                                placeholder="cs@tokoanda.com"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Input Phone */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                            <input 
                                                type="text"
                                                value={data.shop_phone}
                                                onChange={e => setData('shop_phone', e.target.value)}
                                                placeholder="0812xxxx"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Input Alamat (Full Width) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Operasional</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <textarea 
                                            rows="4"
                                            value={data.shop_address}
                                            onChange={e => setData('shop_address', e.target.value)}
                                            placeholder="Alamat lengkap toko atau gudang..."
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Card Tambahan (Opsional) */}
                        <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative shadow-lg shadow-blue-200">
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg">Identity Matters</h4>
                                <p className="text-blue-100 text-sm max-w-md">Pastikan data di atas valid karena akan digunakan untuk keperluan cetak invoice dan info pengiriman ke pelanggan.</p>
                            </div>
                            <Store size={120} className="absolute -right-8 -bottom-8 text-blue-500/30 rotate-12" />
                        </div>
                    </div>
                )}

                {/* --- TAB 2: PREFERENCES & NOTIFICATIONS --- */}
                {activeTab === 'notif' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">                        
                        {/* Section 1: Admin Alerts */}
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 p-8 md:p-12 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <Bell size={24}/>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800">Internal Alerts</h3>
                                    <p className="text-xs text-slate-400 font-medium">Atur bagaimana sistem memberi tahu Anda tentang aktivitas toko.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <PreferenceToggle 
                                    title="Real-time Order Alert" 
                                    description="Munculkan notifikasi popup setiap ada pesanan baru yang masuk."
                                    icon={<ShoppingCart size={20} className="text-blue-500" />}
                                    checked={data.notif_orders}
                                    onChange={val => setData('notif_orders', val)}
                                />
                                
                                <PreferenceToggle 
                                    title="Low Stock Warning" 
                                    description="Beri tahu saya jika ada produk yang stoknya di bawah batas minimum."
                                    icon={<Package size={20} className="text-orange-500" />}
                                    checked={data.notif_stock}
                                    onChange={val => setData('notif_stock', val)}
                                />

                                <PreferenceToggle 
                                    title="Dashboard Sound Effects" 
                                    description="Putar suara 'Chaching!' saat ada transaksi berhasil di dashboard."
                                    icon={<Volume2 size={20} className="text-emerald-500" />}
                                    checked={data.notif_sound}
                                    onChange={val => setData('notif_sound', val)}
                                />
                            </div>
                        </div>

                        {/* Section 2: Automated Reports */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                    <FileText size={24}/>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800">Automated Reports</h3>
                                    <p className="text-xs text-slate-400 font-medium">Laporan otomatis yang dikirimkan langsung ke email Anda.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <PreferenceToggle 
                                    title="Daily Sales Summary" 
                                    description="Kirim rekap penjualan harian ke email admin setiap jam 23:59."
                                    icon={<Mail size={20} className="text-purple-500" />}
                                    checked={data.notif_email|| false}
                                    onChange={val => setData('notif_email', val)}
                                />
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start gap-4">
                            <div className="p-2 bg-amber-200 text-amber-700 rounded-lg mt-1">
                                <Bell size={18} />
                            </div>
                            <div>
                                <h5 className="font-bold text-amber-900 text-sm">Pro Tip: Browser Permissions</h5>
                                <p className="text-amber-700/80 text-xs mt-1 leading-relaxed">
                                    Pastikan Anda memberikan izin notifikasi pada browser agar "Real-time Alerts" dan "Sound Effects" dapat berjalan dengan maksimal saat tab ini terbuka.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 3: PAYMENTS & SHIPPING (BARU) --- */}
                {activeTab === 'payment' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Bank Account Info */}
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 p-8 md:p-12 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Landmark size={24}/></div>
                                <div>
                                    <h3 className="font-black text-slate-800">Bank Transfer Info</h3>
                                    <p className="text-xs text-slate-400 font-medium">Rekening tujuan pembayaran pelanggan.</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Nama Bank" value={data.bank_name} onChange={v => setData('bank_name', v)} placeholder="Contoh: BCA / Mandiri" />
                                <InputField label="Atas Nama (Pemilik)" value={data.bank_holder} onChange={v => setData('bank_holder', v)} placeholder="Contoh: Andi Wijaya" />
                                <div className="md:col-span-2">
                                    <InputField label="Nomor Rekening" value={data.bank_account} onChange={v => setData('bank_account', v)} placeholder="000-000-000" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Config */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Truck size={24}/></div>
                                <div>
                                    <h3 className="font-black text-slate-800">Shipping Config</h3>
                                    <p className="text-xs text-slate-400 font-medium">Pengaturan logistik dan ongkir.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Kota Asal Pengiriman" value={data.shipping_origin} onChange={v => setData('shipping_origin', v)} placeholder="Contoh: Jakarta Selatan" />
                                <InputField label="Biaya Ongkir Flat (Rp)" value={data.shipping_flat_rate} onChange={v => setData('shipping_flat_rate', v)} placeholder="Contoh: 10000 (Hanya angka)" />
                            </div>
                        </div>
                    </div>
                )}  

                {/* Save Button */}
                <div className="mt-12 flex flex-col-reverse md:flex-row items-center justify-end gap-6 pb-20 relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <button disabled={processing} className="bg-slate-900 text-white px-14 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:scale-95 flex items-center gap-4 group">
                        <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                            <Save size={18} />
                        </div>
                        {processing ? 'Saving...' : 'Update System'}
                    </button>

                    <button 
                        type="button"
                        onClick={handleReset}
                        className="px-8 py-4 bg-white text-rose-500 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all border-2 border-rose-100 flex items-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100 active:scale-95"
                        >
                        <RotateCcw size={16} /> 
                        Factory Reset
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

// Komponen Pembantu agar kode bersih
function TabButton({ active, onClick, icon, label }) {
    return (
        <button type="button" onClick={onClick} className={`relative flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 z-10 overflow-hidden ${active ? 'text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-800'}`}>
            {active && (
                <div className="absolute inset-0 bg-blue-600 rounded-[1.5rem] -z-10 animate-in zoom-in-95 duration-200"></div>
            )}
            <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                {icon}
            </div>
            {label}
        </button>
    );
}

function InputField({ label, value, onChange, placeholder }) {
    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 group-focus-within:text-blue-600 uppercase tracking-widest ml-2 transition-colors">{label}</label>
            <input 
                type="text" 
                value={value} 
                onChange={e => onChange(e.target.value)} 
                placeholder={placeholder}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white rounded-3xl focus:border-blue-200 focus:ring-4 focus:ring-blue-50 focus:scale-[1.01] hover:bg-slate-100 transition-all duration-300 font-bold text-slate-700 placeholder:text-slate-300 shadow-inner focus:shadow-xl focus:shadow-blue-100/50" 
            />
        </div>
    );
}

function PreferenceToggle({ title, description, icon, checked, onChange }) {
    return (
        <div className="flex items-center justify-between p-8 bg-slate-50/80 rounded-[2.5rem] border-2 border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group cursor-pointer" onClick={() => onChange(!checked)}>
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${checked ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white text-slate-400 group-hover:text-blue-500'}`}>
                    {icon}
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-300">{title}</h4>
                    <p className="text-[11px] text-slate-400 font-bold mt-1 pr-4">{description}</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                <input type="checkbox" className="sr-only peer" checked={checked} readOnly />
                <div className="w-16 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[24px] after:w-[24px] after:transition-all peer-checked:bg-blue-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/40"></div>
            </label>
        </div>
    );
}