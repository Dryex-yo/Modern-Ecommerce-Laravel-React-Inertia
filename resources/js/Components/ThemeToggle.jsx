import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemeToggle({ minimal = false }) {
    const { isDark, toggleTheme } = useTheme();

    if (minimal) {
        return (
            <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
            >
                <div className="relative w-5 h-5">
                    <Sun
                        size={20}
                        className={`absolute inset-0 transform transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                    />
                    <Moon
                        size={20}
                        className={`absolute inset-0 transform transition-all duration-500 ${!isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                    />
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md active:scale-95"
        >
            <div className="relative w-5 h-5">
                <Sun
                    size={20}
                    className={`absolute inset-0 text-amber-500 transform transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                />
                <Moon
                    size={20}
                    className={`absolute inset-0 text-blue-400 transform transition-all duration-500 ${!isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                {isDark ? 'Dark' : 'Light'}
            </span>
        </button>
    );
}