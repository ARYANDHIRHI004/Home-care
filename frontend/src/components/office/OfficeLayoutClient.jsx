'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/office/Sidebar';
import TopRibbon from '@/components/office/TopRibbon';
import { ThemeProvider } from '@/context/ThemeContext';
import { fetchAdminProfile } from '@/store/slices/authSlice';

export default function OfficeLayoutClient({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchAdminProfile()).then((action) => {
            // If fetch failed or returned no payload → not authenticated
            if (fetchAdminProfile.rejected.match(action) || !action.payload) {
                router.replace('/login/office');
            }
            setAuthChecked(true);
        });
    }, [dispatch, router]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Show nothing while verifying session
    if (!authChecked) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Double-check: if somehow still not authenticated after check, show nothing while redirecting
    if (!isAuthenticated) {
        return null;
    }

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
