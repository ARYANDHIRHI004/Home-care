import { CalendarDays, CheckCircle2, Clock, XCircle, Percent, Timer, RefreshCcw } from 'lucide-react';

const cards = [
    { title: 'Total Bookings', key: 'totalBookings', format: (v) => v.toLocaleString(), trend: 'In selected period', icon: CalendarDays, color: 'text-blue-600 bg-blue-50', trendUp: true },
    { title: 'Completed Jobs', key: 'completedJobs', format: (v) => v.toLocaleString(), trend: 'Successfully finished', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', trendUp: true },
    { title: 'Pending Jobs', key: 'pendingJobs', format: (v) => v.toLocaleString(), trend: 'Awaiting completion', icon: Clock, color: 'text-amber-600 bg-amber-50', trendUp: false },
    { title: 'Cancellations', key: 'cancelledBookings', format: (v) => v.toLocaleString(), trend: 'Cancelled bookings', icon: XCircle, color: 'text-rose-600 bg-rose-50', trendUp: false },
    { title: 'Completion Rate', key: 'completionRate', format: (v) => `${v}%`, trend: 'Of total bookings', icon: Percent, color: 'text-indigo-600 bg-indigo-50', trendUp: true },
    { title: 'Avg. Turnaround', key: 'avgCompletionTime', format: (v) => v, trend: 'Created to last update', icon: Timer, color: 'text-slate-600 bg-slate-100', trendUp: null },
    { title: 'Repeat Customers', key: 'repeatCustomers', format: (v) => `${v}%`, trend: 'Re-booking rate', icon: RefreshCcw, color: 'text-violet-600 bg-violet-50', trendUp: true },
];

export default function BookingSummaryCards({ bookings = [] }) {
    const totalBookings = bookings.length;
    const completedJobs = bookings.filter((b) => b.status === 'completed').length;
    const pendingJobs = bookings.filter((b) => ['pending_assignment', 'upcoming', 'confirmed', 'active', 'in_progress'].includes(b.status)).length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

    const completionRate = totalBookings > 0 ? ((completedJobs / totalBookings) * 100).toFixed(1) : 0;

    // Avg turnaround: createdAt -> updatedAt diff for completed bookings (proxy — there is no
    // dedicated "completedAt" timestamp on the Booking model).
    const completedWithTimes = bookings.filter((b) => b.status === 'completed' && b.createdAt && b.updatedAt);
    const totalMs = completedWithTimes.reduce((acc, b) => acc + (new Date(b.updatedAt) - new Date(b.createdAt)), 0);
    const avgMs = completedWithTimes.length > 0 ? totalMs / completedWithTimes.length : 0;
    const avgHours = Math.floor(avgMs / (1000 * 60 * 60));
    const avgMins = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
    const avgCompletionTime = avgMs > 0 ? `${avgHours}h ${avgMins}m` : 'N/A';

    const customerCounts = bookings.reduce((acc, b) => {
        const key = b.customerId?._id || b.customerId || b.phone || b.customerName;
        if (key) acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const uniqueCustomers = Object.keys(customerCounts).length;
    const repeatCustomerCount = Object.values(customerCounts).filter((count) => count > 1).length;
    const repeatCustomers = uniqueCustomers > 0 ? ((repeatCustomerCount / uniqueCustomers) * 100).toFixed(1) : 0;

    const summaryStats = {
        totalBookings,
        completedJobs,
        pendingJobs,
        cancelledBookings,
        completionRate: Number(completionRate),
        avgCompletionTime,
        repeatCustomers: Number(repeatCustomers),
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            {cards.map((card) => {
                const Icon = card.icon;
                const value = summaryStats[card.key] ?? 0;
                return (
                    <div key={card.key} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">{card.title}</p>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">{card.format(value)}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className={`text-[10px] font-medium ${card.trendUp === true ? 'text-emerald-600' : card.trendUp === false ? 'text-rose-500' : 'text-slate-400'}`}>{card.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
