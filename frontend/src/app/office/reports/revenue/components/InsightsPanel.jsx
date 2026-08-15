import { TrendingUp, Star, User, AlertCircle, Receipt } from 'lucide-react';
import { insights } from '../data/revenueData';

const items = [
    {
        label: 'Highest Revenue Month',
        value: insights.highestRevenueMonth,
        icon: TrendingUp,
        color: 'text-blue-600 bg-blue-50 border-blue-100',
        sub: 'Based on current year data',
    },
    {
        label: 'Best Selling Service',
        value: insights.bestSellingService,
        icon: Star,
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        sub: '248 bookings this year',
    },
    {
        label: 'Top Paying Customer',
        value: insights.highestPayingCustomer,
        icon: User,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        sub: '₹48,500 total spend',
    },
    {
        label: 'Outstanding Collections',
        value: `₹${(insights.outstandingCollections / 1000).toFixed(0)}K`,
        icon: AlertCircle,
        color: 'text-rose-600 bg-rose-50 border-rose-100',
        sub: 'Requires follow-up',
    },
    {
        label: 'Average Invoice Value',
        value: `₹${insights.avgInvoiceValue.toLocaleString()}`,
        icon: Receipt,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        sub: 'Per booking average',
    },
];

export default function InsightsPanel() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">Key Insights</h3>
                <p className="text-xs text-slate-500 mt-0.5">Performance highlights for selected period</p>
            </div>
            <div className="space-y-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl border ${item.color} transition-all hover:brightness-95 cursor-default`}>
                            <div className={`p-2.5 rounded-xl bg-white/60 flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-current/70 uppercase tracking-wider mb-0.5">{item.label}</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{item.value}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right flex-shrink-0 hidden sm:block max-w-[100px]">{item.sub}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
