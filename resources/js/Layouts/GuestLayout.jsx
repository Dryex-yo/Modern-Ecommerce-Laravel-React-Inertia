import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-slate-900 pt-6 sm:justify-center sm:pt-0 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-slate-400" />
                </Link>
                <div className="flex flex-col gap-2">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                    >
                        <Home size={14} />
                        Home
                    </Link>
                    <ThemeToggle />
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white dark:bg-slate-800 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg transition-colors duration-300">
                {children}
            </div>
        </div>
    );
}
