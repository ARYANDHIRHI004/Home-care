'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
    Menu, 
    Search, 
    Bell, 
    Plus,
    User,
    Settings,
    LogOut,
    ChevronDown
} from 'lucide-react';

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
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                
                <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
                    {formatPageTitle(pathname)}
                </h1>
            </div>

            <div className="flex-1 max-w-xl mx-4 sm:mx-8">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                    <input 
                        type="text" 
                        placeholder="Search anything... (Bookings, Customers, Invoices)" 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-medium text-slate-400">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-medium text-slate-400">K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden lg:flex flex-col items-end mr-2">
                    <span className="text-sm font-semibold text-slate-700">{currentTime}</span>
                    <span className="text-[11px] text-slate-500">{currentDate}</span>
                </div>

                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                </button>

                <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>Quick Add</span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <button className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                    <div className="flex flex-col items-end hidden md:flex mr-1">
                        <span className="text-sm font-medium text-slate-700 leading-tight">Admin User</span>
                        <span className="text-[11px] text-slate-500">Super Admin</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        A
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>
            </div>
        </header>
    );
}
