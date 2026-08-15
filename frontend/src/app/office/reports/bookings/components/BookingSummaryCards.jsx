import { CalendarDays, CheckCircle2, Clock, XCircle, Percent, Timer, RefreshCcw } from 'lucide-react';
import { summaryStats } from '../data/bookingData';

const cards = [
    { title: 'Total Bookings', key: 'totalBookings', format: (v) => v.toLocaleString(), trend: '+14.2% this month', icon: CalendarDays, color: 'text-blue-600 bg-blue-50', trendUp: true },
    { title: 'Completed Jobs', key: 'completedJobs', format: (v) => v.toLocaleString(), trend: '68.9% of total', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', trendUp: true },
    { title: 'Pending Jobs', key: 'pendingJobs', format: (v) => v.toLocaleString(), trend: 'Needs scheduling', icon: Clock, color: 'text-amber-600 bg-amber-50', trendUp: false },
    { title: 'Cancellations', key: 'cancelledBookings', format: (v) => v.toLocaleString(), trend: '9.5% cancel rate', icon: XCircle, color: 'text-rose-600 bg-rose-50', trendUp: false },
    { title: 'Completion Rate', key: 'completionRate', format: (v) => `${v}%`, trend: '+2.1% vs last month', icon: Percent, color: 'text-indigo-600 bg-indigo-50', trendUp: true },
    { title: 'Avg. Completion', key: 'avgCompletionTime', format: (v) => v, trend: 'Per service visit', icon: Timer, color: 'text-slate-600 bg-slate-100', trendUp: null },
    { title: 'Repeat Customers', key: 'repeatCustomers', format: (v) => `${v}%`, trend: 'Re-booking rate', icon: RefreshCcw, color: 'text-violet-600 bg-violet-50', trendUp: true },
];

export default function BookingSummaryCards() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            {cards.map((card) => {
                const Icon = card.icon;
                const value = summaryStats[card.key];
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
