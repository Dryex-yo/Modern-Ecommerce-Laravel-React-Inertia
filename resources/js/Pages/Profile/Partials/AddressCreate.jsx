import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { MapPin, Save, Home, Building2, X, RefreshCw } from 'lucide-react';

export default function AddressCreate({ onClose, address = null }) {
    // Jika address ada, berarti mode Edit. Jika null, berarti mode Create.
    const isEdit = !!address;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        label: address?.label || '',
        receiver_name: address?.receiver_name || '',
        phone_number: address?.phone_number || '',
        full_address: address?.full_address || '',
        province: address?.province || '',
        city: address?.city || '',
        district: address?.district || '',
        postal_code: address?.postal_code || '',
        is_default: address?.is_default || false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('addresses.update', address.id), {
                onSuccess: () => onClose(),
                preserveScroll: true,
            });
        } else {
            post(route('addresses.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-200 animate-in fade-in zoom-in duration-300 mb-8 shadow-inner">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-black italic uppercase text-slate-800 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isEdit ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isEdit ? <RefreshCw size={18} /> : <MapPin size={18} />}
                    </div>
                    {isEdit ? 'Update Location' : 'New Destination'}
                </h4>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="flex gap-4">
                    {['Home', 'Office'].map((lbl) => (
                        <button 
                            key={lbl}
                            type="button"
                            onClick={() => setData('label', lbl)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all font-black uppercase text-[10px] ${data.label === lbl ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-white bg-white text-slate-400'}`}
                        >
                            {lbl === 'Home' ? <Home size={14} /> : <Building2 size={14} />} {lbl}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <input 
                        className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                        placeholder="Custom Label (e.g. Apartment)"
                        value={data.label}
                        onChange={e => setData('label', e.target.value)}
                    />
                    {errors.label && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.label}</p>}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input 
                                className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                placeholder="Receiver Name"
                                value={data.receiver_name}
                                onChange={e => setData('receiver_name', e.target.value)}
                            />
                            {errors.receiver_name && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.receiver_name}</p>}
                        </div>
                        <div>
                            <input 
                                className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                placeholder="Phone Number"
                                value={data.phone_number}
                                onChange={e => setData('phone_number', e.target.value)}
                            />
                            {errors.phone_number && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.phone_number}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input 
                                className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                placeholder="Province"
                                value={data.province}
                                onChange={e => setData('province', e.target.value)}
                            />
                            {errors.province && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.province}</p>}
                        </div>
                        <div>
                            <input 
                                className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                placeholder="City"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                            />
                            {errors.city && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.city}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input 
                                className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                placeholder="District (Kecamatan)"
                                value={data.district}
                                onChange={e => setData('district', e.target.value)}
                            />
                            {errors.district && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.district}</p>}
                        </div>
                        <div>
                            <input 
                                className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                placeholder="Postal Code"
                                value={data.postal_code}
                                onChange={e => setData('postal_code', e.target.value)}
                            />
                            {errors.postal_code && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.postal_code}</p>}
                        </div>
                    </div>

                    <div>
                        <textarea 
                            className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all placeholder:text-slate-300 min-h-[100px]"
                            placeholder="Full Address Details (Street, Building, RT/RW, etc)"
                            value={data.full_address}
                            onChange={e => setData('full_address', e.target.value)}
                        />
                        {errors.full_address && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.full_address}</p>}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-blue-600"
                            checked={data.is_default}
                            onChange={e => setData('is_default', e.target.checked)}
                        />
                        <span className="text-[9px] font-black uppercase text-slate-400">Set Primary</span>
                    </label>
                    <button 
                        disabled={processing}
                        className={`px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isEdit ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-900 hover:bg-blue-600 text-white'}`}
                    >
                        {processing ? 'Saving...' : isEdit ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
}