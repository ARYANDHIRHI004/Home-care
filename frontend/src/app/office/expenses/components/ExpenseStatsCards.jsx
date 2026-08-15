import { Receipt, TrendingDown, Fuel, UserPlus, Zap } from 'lucide-react';

const stats = [
    {
        title: 'Total Monthly Expenses',
        value: '₹1,45,200',
        trend: '+4% from last month',
        icon: Receipt,
        color: 'text-rose-600 bg-rose-50',
    },
    {
        title: 'Today\'s Expenses',
        value: '₹4,800',
        trend: '12 transactions',
        icon: TrendingDown,
        color: 'text-orange-600 bg-orange-50',
    },
    {
        title: 'Fuel & Transport',
        value: '₹42,500',
        trend: '29% of total',
        icon: Fuel,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Partner Advances',
        value: '₹65,000',
        trend: '45% of total',
        icon: UserPlus,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Office Utilities',
        value: '₹22,000',
        trend: '15% of total',
        icon: Zap,
        color: 'text-indigo-600 bg-indigo-50',
    },
];

export default function ExpenseStatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 font-medium">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
