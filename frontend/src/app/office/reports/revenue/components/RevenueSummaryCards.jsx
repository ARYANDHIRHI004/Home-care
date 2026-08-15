import { IndianRupee, Wallet, AlertCircle, TrendingUp, Clock, BarChart2, ArrowUpRight } from 'lucide-react';
import { summaryStats } from '../data/revenueData';

const cards = [
    {
        title: 'Total Revenue',
        key: 'totalRevenue',
        format: (v) => `₹${(v / 100000).toFixed(2)}L`,
        trend: '+18.4% YoY',
        icon: IndianRupee,
        color: 'text-blue-600 bg-blue-50',
        trendUp: true,
    },
    {
        title: 'Collected Amount',
        key: 'collectedAmount',
        format: (v) => `₹${(v / 100000).toFixed(2)}L`,
        trend: '91.5% collection rate',
        icon: Wallet,
        color: 'text-emerald-600 bg-emerald-50',
        trendUp: true,
    },
    {
        title: 'Outstanding Amount',
        key: 'outstandingAmount',
        format: (v) => `₹${(v / 1000).toFixed(0)}K`,
        trend: 'Needs follow-up',
        icon: AlertCircle,
        color: 'text-rose-600 bg-rose-50',
        trendUp: false,
    },
    {
        title: 'Avg Booking Value',
        key: 'avgBookingValue',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: '+5.2% from last month',
        icon: TrendingUp,
        color: 'text-indigo-600 bg-indigo-50',
        trendUp: true,
    },
    {
        title: "Today's Revenue",
        key: 'todayRevenue',
        format: (v) => `₹${(v / 1000).toFixed(1)}K`,
        trend: '12 payments received',
        icon: Clock,
        color: 'text-amber-600 bg-amber-50',
        trendUp: true,
    },
    {
        title: 'Monthly Growth',
        key: 'monthlyGrowth',
        format: (v) => `+${v}%`,
        trend: 'vs last month',
        icon: BarChart2,
        color: 'text-violet-600 bg-violet-50',
        trendUp: true,
    },
    {
        title: 'Net Profit',
        key: 'netProfit',
        format: (v) => `₹${(v / 100000).toFixed(2)}L`,
        trend: 'Revenue minus expenses',
        icon: ArrowUpRight,
        color: 'text-emerald-600 bg-emerald-50',
        trendUp: true,
    },
];

export default function RevenueSummaryCards() {
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
                            <p className={`text-[10px] font-medium ${card.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>{card.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
