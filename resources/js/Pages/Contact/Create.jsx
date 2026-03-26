import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { MessageCircle, Send, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactCreate({ shopEmail, shopPhone, shopAddress }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'));
    };

    return (
        <UserLayout user={auth?.user}>
            <Head title="Hubungi Kami - Contact Us" />
            
            <main className="max-w-4xl mx-auto py-16 px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                        <MessageCircle size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic mb-4">
                        Hubungi Kami
                    </h1>
                    <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest max-w-xl mx-auto">
                        Kami siap membantu menjawab pertanyaan dan keluhan Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Contact Info Cards */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
                            <Mail size={24} className="text-blue-600" />
                        </div>
                        <h3 className="font-black text-slate-800 text-[12px] uppercase mb-2">Email</h3>
                        <p className="text-slate-600 text-[11px] font-bold">
                            {shopEmail}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
                            <Phone size={24} className="text-blue-600" />
                        </div>
                        <h3 className="font-black text-slate-800 text-[12px] uppercase mb-2">Telepon</h3>
                        <p className="text-slate-600 text-[11px] font-bold">
                            {shopPhone}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
                            <MapPin size={24} className="text-blue-600" />
                        </div>
                        <h3 className="font-black text-slate-800 text-[12px] uppercase mb-2">Alamat</h3>
                        <p className="text-slate-600 text-[11px] font-bold">
                            {shopAddress}
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-8">Kirim Pesan</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[12px]"
                                placeholder="Masukkan nama lengkap Anda"
                            />
                            {errors.name && <p className="text-red-600 text-[10px] font-bold mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[12px]"
                                placeholder="Masukkan email Anda"
                            />
                            {errors.email && <p className="text-red-600 text-[10px] font-bold mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2">
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[12px]"
                                placeholder="Masukkan nomor telepon Anda"
                            />
                            {errors.phone && <p className="text-red-600 text-[10px] font-bold mt-1">{errors.phone}</p>}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2">
                                Subjek
                            </label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[12px]"
                                placeholder="Masukkan subjek pesan Anda"
                            />
                            {errors.subject && <p className="text-red-600 text-[10px] font-bold mt-1">{errors.subject}</p>}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2">
                                Pesan
                            </label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows="6"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[12px] resize-none"
                                placeholder="Tulis pesan Anda di sini..."
                            />
                            {errors.message && <p className="text-red-600 text-[10px] font-bold mt-1">{errors.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                            >
                                {processing ? 'Mengirim...' : (<><Send size={16} /> Kirim Pesan</>)}
                            </button>
                            <Link
                                href={route('dashboard')}
                                className="flex-1 bg-slate-100 text-slate-800 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all inline-flex items-center justify-center"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </UserLayout>
    );
}
