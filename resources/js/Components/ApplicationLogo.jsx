import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ className = '', ...props }) {
    // Ambil data settings dari Shared Data Inertia
    const { settings } = usePage().props;

    const logoUrl = settings?.shop_logo;
    const shopName = settings?.shop_name || 'DRYEX SHOP';

    return (
        <div {...props} className={`flex items-center gap-2 ${className}`}>
            {logoUrl ? (
                <img 
                    // Gunakan template literal yang benar
                    src={logoUrl} 
                    alt={shopName} 
                    className="h-9 w-auto object-contain" 
                    onError={(e) => {
                        console.error("Gagal memuat gambar:", e.target.src);
                        e.target.style.display = 'none';
                    }}
                />
            ) : (
                /* Icon default jika logo belum diupload di settings */
                <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
            )}
            
            {/* Nama Toko dari Settings */}
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                {shopName}
            </span>
        </div>
    );
}