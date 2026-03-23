import React from 'react';
import { Link } from '@inertiajs/react';


export default function SidebarItem({ icon, label, href, active }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm ${
                active 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}