'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
    Menu,
    Search,
    Bell,
    Plus,
    LogOut,
    ChevronDown,
    Sun,
    Moon,
    Monitor,
    User,
    KeyRound,
    Check,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const THEMES = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System Default', icon: Monitor },
];

function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const current = THEMES.find((t) => t.id === theme) || THEMES[0];
    const CurrentIcon = current.icon;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Change theme"
            >
                <CurrentIcon className="w-5 h-5" />
            </button>

            {open && (
                <div className="absolute right-0 top-11 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                        Appearance
                    </p>
                    {THEMES.map((t) => {
                        const Icon = t.icon;
                        const isActive = theme === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => { setTheme(t.id); setOpen(false); }}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4" />
                                    {t.label}
                                </div>
                                {isActive && <Check className="w-3.5 h-3.5" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ProfileDropdown() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
                <div className="flex-col items-end hidden md:flex mr-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">Admin User</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Super Admin</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                    A
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Profile Header */}
                    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">A</div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Admin User</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">admin@homecare247.in</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-1">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setOpen(false)}>
                            <User className="w-4 h-4 text-slate-400" /> My Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setOpen(false)}>
                            <KeyRound className="w-4 h-4 text-slate-400" /> Change Password
                        </button>
                    </div>

                    {/* Theme sub-section */}
                    <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                        <p className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Theme</p>
                        {THEMES.map((t) => {
                            const Icon = t.icon;
                            const isActive = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => { setTheme(t.id); setOpen(false); }}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-4 h-4" />
                                        {t.label}
                                    </div>
                                    {isActive && <Check className="w-3.5 h-3.5" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                        <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors font-medium"
                            onClick={() => setOpen(false)}
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TopRibbon({ toggleSidebar }) {
    const pathname = usePathname();
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
            setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatPageTitle = (path) => {
        if (path === '/office/dashboard') return 'Dashboard';
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        if (!lastPart || lastPart === 'office') return 'Dashboard';
        return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 sticky top-0 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">
                    {formatPageTitle(pathname)}
                </h1>
            </div>

            <div className="flex-1 max-w-xl mx-4 sm:mx-8">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        placeholder="Search anything... (Bookings, Customers, Invoices)"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-200"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-400">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-400">K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden lg:flex flex-col items-end mr-1">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{currentTime}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{currentDate}</span>
                </div>

                <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                {/* Theme Switcher button */}
                <ThemeSwitcher />

                {/* <  */}

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                <ProfileDropdown />
            </div>
        </header>
    );
}
