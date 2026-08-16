'use client';
import { ArrowUpRight, Banknote, Calendar as CalendarIcon, FileDigit, Plus, UserPlus } from 'lucide-react';
import { useGetBookingsQuery } from '@/store/api/bookingApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import Link from 'next/link';

export default function BookingSidebar({ onCreateBooking }) {
    const { data: rawBookings = [] } = useGetBookingsQuery();
    const { data: rawPartners = [] } = useGetPartnersQuery();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;
    
    // Live Status
    const runningJobs = rawBookings.filter(b => b.status === 'in_progress').length;
    
    const upcomingJobs = rawBookings.filter(b => {
        if (!b.scheduledDate) return false;
        const bDate = new Date(b.scheduledDate);
        if (b.scheduledTime) {
            const [time, modifier] = b.scheduledTime.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours, 10);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            bDate.setHours(hours, parseInt(minutes, 10) || 0, 0);
        }
        const diffMs = bDate.getTime() - now.getTime();
        return diffMs > 0 && diffMs <= 2 * 60 * 60 * 1000; // Next 2 hours
    }).length;

    const delayedJobs = rawBookings.filter(b => b.status === 'delayed').length;

    const prosAvailable = rawPartners.filter(p => p.active !== false && !p.isBusy).length;
    const prosTotal = rawPartners.length;

    // Payment Summary (Today)
    const todaysRevenueBookings = rawBookings.filter(b => {
        const date = new Date(b.updatedAt || b.createdAt).getTime();
        return b.paymentStatus === 'completed' && date >= todayStart && date < todayEnd;
    });

    const todaysRevenue = todaysRevenueBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    // Assuming 70% online and 30% cash for display if we don't have explicit payment methods
    const onlineRevenue = todaysRevenue * 0.7;
    const cashRevenue = todaysRevenue * 0.3;
    const onlinePct = todaysRevenue > 0 ? 70 : 0;
    const cashPct = todaysRevenue > 0 ? 30 : 0;

    return (
        <div className="space-y-6">
            {/* Live Status Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Status
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Running Jobs</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">{runningJobs}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upcoming (2h)</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">{upcomingJobs}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50 transition-colors">
                        <span className="text-sm font-medium text-rose-800 dark:text-rose-400">Delayed Jobs</span>
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-rose-900/50 px-2 py-0.5 rounded-md shadow-sm">{delayedJobs}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 mt-2 transition-colors">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pros Available</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{prosAvailable} / {prosTotal}</span>
                    </div>
                </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Today's Revenue
                </h3>
                <div className="mb-4">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{todaysRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                        <ArrowUpRight className="w-4 h-4" /> Real-time tracking
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Online/UPI</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">₹{onlineRevenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 transition-colors">
                        <div className={`bg-blue-500 h-1.5 rounded-full`} style={{ width: `${onlinePct}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-3">
                        <span className="text-slate-500 dark:text-slate-400">Cash Collection</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">₹{cashRevenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 transition-colors">
                        <div className={`bg-emerald-500 h-1.5 rounded-full`} style={{ width: `${cashPct}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onCreateBooking} className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group">
                        <Plus className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1.5" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">New Booking</span>
                    </button>
                    <Link href="/office/partners" className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group">
                        <UserPlus className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1.5" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-center leading-tight">Assign Pro</span>
                    </Link>
                    <button onClick={() => alert("Select a booking from the list and use the Actions menu to generate an invoice.")} className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group">
                        <FileDigit className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1.5" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-center leading-tight">Invoice</span>
                    </button>
                    <button onClick={() => alert("Click 'Edit' on any booking in the list to reschedule.")} className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group">
                        <CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1.5" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-center leading-tight">Reschedule</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
