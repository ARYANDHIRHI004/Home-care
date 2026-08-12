import { IndianRupee, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';

const stats = [
    {
        title: 'Avg Service Price',
        value: '₹1,240',
        trend: '+₹120 vs last month',
        icon: IndianRupee,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Highest Price',
        value: '₹14,999',
        trend: 'Full Home Deep Clean',
        icon: ArrowUpCircle,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Lowest Price',
        value: '₹149',
        trend: 'Wash Basin Repair',
        icon: ArrowDownCircle,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Recently Updated',
        value: '12',
        trend: 'Prices changed this week',
        icon: Clock,
        color: 'text-violet-600 bg-violet-50',
    },
];

export default function PricingStatsCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                        <p className="text-2xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 leading-tight">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
