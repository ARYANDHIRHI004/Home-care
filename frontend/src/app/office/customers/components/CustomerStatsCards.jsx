import { Users, UserPlus, UserCheck, Repeat, TrendingUp, Star } from 'lucide-react';

export default function CustomerStatsCards() {
    const stats = [
        {
            title: 'Total Customers',
            value: '4,892',
            growth: '+12%',
            trend: 'up',
            icon: Users,
            description: 'Total registered accounts',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'New This Month',
            value: '342',
            growth: '+8%',
            trend: 'up',
            icon: UserPlus,
            description: 'New signups in 30 days',
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Active Customers',
            value: '2,145',
            growth: '+4%',
            trend: 'up',
            icon: UserCheck,
            description: 'Booked in last 90 days',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Repeat Customers',
            value: '1,820',
            growth: '+15%',
            trend: 'up',
            icon: Repeat,
            description: 'More than 2 bookings',
            color: 'bg-violet-50 text-violet-600',
        },
        {
            title: 'Customer LTV',
            value: '₹14,250',
            growth: '+5%',
            trend: 'up',
            icon: TrendingUp,
            description: 'Average lifetime spend',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Average Rating',
            value: '4.8',
            growth: '+0.2',
            trend: 'up',
            icon: Star,
            description: 'From 3,240 reviews',
            color: 'bg-yellow-50 text-yellow-600',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {stat.growth}
                            </span>
                        </div>
                        
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <div className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                        <p className="text-xs text-slate-400 mt-auto font-medium">{stat.description}</p>
                    </div>
                );
            })}
        </div>
    );
}
