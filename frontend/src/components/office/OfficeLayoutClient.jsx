'use client';

import { useState } from 'react';
import Sidebar from '@/components/office/Sidebar';
import TopRibbon from '@/components/office/TopRibbon';
import { ThemeProvider } from '@/context/ThemeContext';

export default function OfficeLayoutClient({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <ThemeProvider>
            <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
                <Sidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    <TopRibbon toggleSidebar={toggleSidebar} />
                    <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-6">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
