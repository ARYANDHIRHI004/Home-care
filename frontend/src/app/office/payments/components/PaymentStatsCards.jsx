import { IndianRupee, Clock, TrendingUp, AlertCircle, CheckCircle2, Wallet } from 'lucide-react';

const stats = [
    {
        title: 'Total Payments Received',
        value: '₹14,50,000',
        trend: '+12% from last month',
        icon: IndianRupee,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Pending Payments',
        value: '₹2,45,000',
        trend: '42 invoices unpaid',
        icon: Clock,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Today\'s Collection',
        value: '₹45,200',
        trend: '12 payments today',
        icon: Wallet,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'This Month Revenue',
        value: '₹3,20,500',
        trend: 'Projected: ₹4.5L',
        icon: TrendingUp,
        color: 'text-indigo-600 bg-indigo-50',
    },
    {
        title: 'Overdue Payments',
        value: '₹85,000',
        trend: 'Needs immediate follow-up',
        icon: AlertCircle,
        color: 'text-rose-600 bg-rose-50',
    },
    {
        title: 'Avg. Collection Time',
        value: '4 Days',
        trend: 'Improved by 1 day',
        icon: CheckCircle2,
        color: 'text-slate-600 bg-slate-100',
    },
];

export default function PaymentStatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider line-clamp-1">{stat.title}</p>
                        <p className="text-xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 font-medium">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
