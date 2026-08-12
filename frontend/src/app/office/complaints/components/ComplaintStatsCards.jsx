import { AlertCircle, AlertTriangle, Loader2, CheckCircle2, ShieldAlert, Clock, TrendingDown, TrendingUp } from 'lucide-react';

const stats = [
    {
        title: 'Total Complaints',
        value: '1,284',
        trend: '+48 this month',
        trendUp: true,
        description: 'All time complaints',
        icon: AlertCircle,
        color: 'text-slate-600 bg-slate-100',
    },
    {
        title: 'Open Complaints',
        value: '183',
        trend: '+12 since yesterday',
        trendUp: true,
        description: 'Awaiting action',
        icon: AlertTriangle,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Under Investigation',
        value: '56',
        trend: '-4 vs last week',
        trendUp: false,
        description: 'Being reviewed',
        icon: Loader2,
        color: 'text-violet-600 bg-violet-50',
    },
    {
        title: 'Resolved',
        value: '994',
        trend: '77% resolution rate',
        trendUp: true,
        description: 'Closed successfully',
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'High Priority',
        value: '24',
        trend: '3 critical alerts',
        trendUp: false,
        description: 'Immediate attention',
        icon: ShieldAlert,
        color: 'text-rose-600 bg-rose-50',
    },
    {
        title: 'Avg. Resolution',
        value: '18h',
        trend: '-2h vs last month',
        trendUp: false,
        description: 'Average resolution time',
        icon: Clock,
        color: 'text-amber-600 bg-amber-50',
    },
];

export default function ComplaintStatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
                return (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <TrendIcon className={`w-3.5 h-3.5 ${stat.trendUp ? 'text-rose-400' : 'text-emerald-500'}`} />
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 leading-tight">{stat.description}</p>
                            <p className={`text-[10px] font-semibold mt-0.5 ${stat.trendUp ? 'text-rose-500' : 'text-emerald-600'}`}>{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
