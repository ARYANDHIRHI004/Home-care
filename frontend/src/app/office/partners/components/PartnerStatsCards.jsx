import { Users, UserCheck, UserMinus, ShieldAlert, Star, Briefcase } from 'lucide-react';

const stats = [
    {
        title: 'Total Partners',
        value: '184',
        trend: '+12 this month',
        icon: Users,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Available Today',
        value: '64',
        trend: 'Ready for jobs',
        icon: UserCheck,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Busy on Jobs',
        value: '92',
        trend: 'Currently serving',
        icon: Briefcase,
        color: 'text-indigo-600 bg-indigo-50',
    },
    {
        title: 'Inactive / On Leave',
        value: '28',
        trend: 'Not available today',
        icon: UserMinus,
        color: 'text-slate-600 bg-slate-100',
    },
    {
        title: 'Avg. Rating',
        value: '4.8',
        trend: 'Across all categories',
        icon: Star,
        color: 'text-amber-600 bg-amber-50',
    },
    {
        title: 'Completed Jobs Today',
        value: '112',
        trend: 'Successfully closed',
        icon: ShieldAlert, // Reused icon style
        color: 'text-teal-600 bg-teal-50',
    },
];

export default function PartnerStatsCards() {
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
