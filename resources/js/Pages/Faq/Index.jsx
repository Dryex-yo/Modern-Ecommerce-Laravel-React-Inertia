import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, usePage } from '@inertiajs/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqIndex() {
    const { auth } = usePage().props;
    const [openItems, setOpenItems] = useState([]);

    const faqs = [
        {
            id: 1,
            question: 'Bagaimana cara melakukan pembayaran?',
            answer: 'Anda dapat melakukan pembayaran melalui berbagai metode termasuk transfer bank, kartu kredit, dan e-wallet. Pilih metode pembayaran yang diinginkan saat checkout.'
        },
        {
            id: 2,
            question: 'Berapa lama pengiriman barang?',
            answer: 'Waktu pengiriman tergantung lokasi Anda. Umumnya pengiriman membutuhkan 2-5 hari kerja untuk area Jabodetabek dan 3-7 hari kerja untuk area lainnya.'
        },
        {
            id: 3,
            question: 'Apakah ada garansi untuk produk?',
            answer: 'Ya, semua produk kami dilengkapi dengan garansi sesuai dengan kebijakan masing-masing produk. Detail garansi dapat dilihat di halaman detail produk.'
        },
        {
            id: 4,
            question: 'Bagaimana cara melakukan pengembalian barang?',
            answer: 'Jika ada ketidakpuasan dengan produk, Anda dapat mengajukan pengembalian dalam waktu 14 hari setelah menerima barang. Hubungi customer service kami untuk informasi lebih lanjut.'
        },
        {
            id: 5,
            question: 'Apakah ada biaya ongkir?',
            answer: 'Ya, biaya ongkir dihitung berdasarkan berat barang dan lokasi tujuan pengiriman. Biaya ongkir akan ditampilkan sebelum Anda menyelesaikan pesanan.'
        },
        {
            id: 6,
            question: 'Bagaimana cara melacak pesanan saya?',
            answer: 'Anda dapat melacak pesanan melalui dashboard Anda atau email notifikasi yang kami kirim. Klik menu "Pesanan" untuk melihat status pesanan terbaru.'
        }
    ];

    const toggleItem = (id) => {
        setOpenItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <UserLayout user={auth?.user}>
            <Head title="FAQ - Pertanyaan Umum" />
            
            <main className="max-w-4xl mx-auto py-16 px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                        <HelpCircle size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic mb-4">
                        Pertanyaan Umum
                    </h1>
                    <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest max-w-xl mx-auto">
                        Temukan jawaban atas pertanyaan yang sering diajukan oleh pelanggan kami
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <button
                                onClick={() => toggleItem(faq.id)}
                                className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                            >
                                <h3 className="text-left font-black text-slate-800 text-[13px] uppercase tracking-tight leading-tight max-w-[80%]">
                                    {faq.question}
                                </h3>
                                <div className={`flex-shrink-0 w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all ${openItems.includes(faq.id) ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={18} className="text-blue-600 transition-transform" />
                                </div>
                            </button>

                            {openItems.includes(faq.id) && (
                                <div className="px-8 pb-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-slate-600 text-[12px] leading-relaxed font-medium">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="mt-16 bg-gradient-to-r from-blue-50 to-slate-50 p-10 rounded-[2.5rem] border border-blue-100 text-center">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-3">
                        Tidak menemukan jawaban?
                    </h3>
                    <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest mb-6">
                        Tim customer service kami siap membantu Anda
                    </p>
                    <a 
                        href={route('contact.create')} 
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </main>
        </UserLayout>
    );
}
