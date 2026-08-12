import { MessageSquare, Star, ThumbsUp, Reply, AlertCircle, HeartHandshake, TrendingUp, TrendingDown } from 'lucide-react';

export default function ReviewStatsCards() {
    const stats = [
        {
            title: 'Total Reviews',
            value: '2,482',
            trend: 'up',
            trendValue: '+156 this month',
            icon: MessageSquare,
            description: 'All-time reviews received',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Average Rating',
            value: '4.8',
            trend: 'up',
            trendValue: '+0.1 from last month',
            icon: Star,
            description: 'Across all categories',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            title: '5 Star Reviews',
            value: '1,890',
            trend: 'up',
            trendValue: '76% of total',
            icon: ThumbsUp,
            description: 'Exceptional service',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Pending Replies',
            value: '42',
            trend: 'down',
            trendValue: '-12 since yesterday',
            icon: Reply,
            description: 'Requires attention',
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Negative Reviews',
            value: '18',
            trend: 'down',
            trendValue: '-5% vs last month',
            icon: AlertCircle,
            description: '3 stars or below',
            color: 'bg-rose-50 text-rose-600',
        },
        {
            title: 'Customer Satisfaction',
            value: '94%',
            trend: 'up',
            trendValue: '+2% industry avg',
            icon: HeartHandshake,
            description: 'CSAT Score (Last 30d)',
            color: 'bg-violet-50 text-violet-600',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            {stat.trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-emerald-500" />
                            )}
                        </div>
                        
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <div className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                        
                        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium">
                            <span className="text-slate-400">{stat.description}</span>
                            <span className={stat.trend === 'up' ? 'text-emerald-600' : 'text-emerald-600'}>
                                {stat.trendValue}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
