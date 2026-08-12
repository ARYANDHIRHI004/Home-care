import { Ticket, CheckCircle2, XCircle, CalendarClock, TrendingUp, IndianRupee } from 'lucide-react';

const stats = [
    {
        title: 'Total Coupons',
        value: '145',
        trend: 'All time created',
        icon: Ticket,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Active Coupons',
        value: '24',
        trend: 'Currently running',
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Expired Coupons',
        value: '118',
        trend: 'Past campaigns',
        icon: XCircle,
        color: 'text-slate-600 bg-slate-100',
    },
    {
        title: 'Upcoming',
        value: '3',
        trend: 'Scheduled to start',
        icon: CalendarClock,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Total Redemptions',
        value: '4,289',
        trend: 'Uses across platform',
        icon: TrendingUp,
        color: 'text-indigo-600 bg-indigo-50',
    },
    {
        title: 'Discount Given',
        value: '₹1.2M',
        trend: 'Total savings offered',
        icon: IndianRupee,
        color: 'text-rose-600 bg-rose-50',
    },
];

export default function CouponStatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-1">{stat.title}</p>
                        <p className="text-xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 leading-tight">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
