import { Briefcase, CalendarClock, Loader2, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

const stats = [
    {
        title: 'Active Work Orders',
        value: '428',
        trend: '+12% this week',
        trendUp: true,
        description: 'Total active jobs',
        icon: Briefcase,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: "Today's Scheduled",
        value: '84',
        trend: '12 unassigned',
        trendUp: false,
        description: 'Scheduled for today',
        icon: CalendarClock,
        color: 'text-indigo-600 bg-indigo-50',
    },
    {
        title: 'In Progress',
        value: '35',
        trend: 'On track',
        trendUp: true,
        description: 'Partners on site',
        icon: Loader2,
        color: 'text-violet-600 bg-violet-50',
    },
    {
        title: 'Completed Today',
        value: '42',
        trend: '+8 vs yesterday',
        trendUp: true,
        description: 'Jobs finished today',
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Pending Invoice',
        value: '18',
        trend: 'Needs generation',
        trendUp: false,
        description: 'Jobs awaiting invoice',
        icon: FileText,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Overdue Jobs',
        value: '6',
        trend: 'Critical action',
        trendUp: false,
        description: 'Past scheduled date',
        icon: AlertTriangle,
        color: 'text-rose-600 bg-rose-50',
    },
];

export default function WorkOrderStatsCards() {
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
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stat.trendUp ? (stat.title === 'Overdue Jobs' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700') : (stat.title === 'Overdue Jobs' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600')}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 leading-tight">{stat.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
