'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PageHeader from '@/components/office/PageHeader';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import NewBookingCard from './components/NewBookingCard';
import LiveJobStatus from './components/LiveJobStatus';
import TodaySchedule from './components/TodaySchedule';
import RecentActivities from './components/RecentActivities';
import PartnerStatus from './components/PartnerStatus';
import { apiSlice } from '@/store/apiSlice';

export default function OfficeDashboard() {
    const dispatch = useDispatch();
    const [isSpinning, setIsSpinning] = useState(false);

    const handleRefresh = () => {
        dispatch(apiSlice.util.invalidateTags([
            { type: 'Enquiry', id: 'LIST' },
            { type: 'WorkOrder', id: 'LIST' },
            { type: 'Invoice', id: 'LIST' },
            { type: 'Payment', id: 'LIST' },
            { type: 'Partner', id: 'LIST' },
            { type: 'Dashboard', id: 'STATS' },
        ]));
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 600);
    };

    return (
        <div className="pb-10">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Dashboard' }]}
                title="Good Morning, Admin 👋"
                description="Here's what's happening with your operations today."
                actions={
                    <>
                        <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <Link href="/office/bookings" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            New Booking
                        </Link>
                    </>
                }
            />

            {/* Stats Grid */}
            <DashboardStats />

            {/* Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <NewBookingCard />
                </div>
                <div className="lg:col-span-3">
                    <QuickActions />
                </div>
            </div>

            {/* Main Grid for Tables and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <LiveJobStatus />
                <TodaySchedule />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivities />
                <PartnerStatus />
            </div>

        </div>
    );
}
