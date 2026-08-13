import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const stats = [
    {
        title: 'Total Invoices',
        value: '1,248',
        trend: '+124 this month',
        icon: FileText,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Paid',
        value: '1,102',
        trend: '₹14.5L collected',
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Pending',
        value: '104',
        trend: '₹2.45L outstanding',
        icon: Clock,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Overdue',
        value: '42',
        trend: '₹85K overdue',
        icon: AlertCircle,
        color: 'text-rose-600 bg-rose-50',
    },
];

export default function InvoiceStatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
