import { Users, UserPlus, UserCheck, Repeat, TrendingUp, Star } from 'lucide-react';
import { useGetCustomersQuery } from '@/store/api/customerApi';

export default function CustomerStatsCards() {
    const { data: rawCustomers = [] } = useGetCustomersQuery();

    const totalCustomers = rawCustomers.length;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
    const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));

    const newThisMonth = rawCustomers.filter(c => new Date(c.createdAt) >= thirtyDaysAgo).length;
    const newPrevMonth = rawCustomers.filter(c => {
        const d = new Date(c.createdAt);
        return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    }).length;

    const activeCustomers = rawCustomers.filter(c => c.lastBookingDate && new Date(c.lastBookingDate) >= ninetyDaysAgo).length;
    const repeatCustomers = rawCustomers.filter(c => (c.totalBookings || 0) > 1).length;
    
    const totalSpend = rawCustomers.reduce((acc, c) => acc + (c.lifetimeSpend || 0), 0);
    const avgLtv = totalCustomers ? (totalSpend / totalCustomers).toFixed(0) : 0;

    const customersWithRating = rawCustomers.filter(c => c.rating);
    const totalRating = customersWithRating.reduce((acc, c) => acc + c.rating, 0);
    const avgRating = customersWithRating.length ? (totalRating / customersWithRating.length).toFixed(1) : 'N/A';

    // Compute growth labels from real data
    const newGrowthPct = newPrevMonth > 0
        ? ((newThisMonth - newPrevMonth) / newPrevMonth * 100).toFixed(0)
        : null;
    const newGrowthLabel = newGrowthPct !== null
        ? `${newGrowthPct >= 0 ? '+' : ''}${newGrowthPct}%`
        : newThisMonth > 0 ? `+${newThisMonth} new` : '—';

    const repeatPct = totalCustomers > 0
        ? ((repeatCustomers / totalCustomers) * 100).toFixed(0)
        : 0;

    const stats = [
        {
            title: 'Total Customers',
            value: totalCustomers.toLocaleString(),
            growth: totalCustomers > 0 ? `${totalCustomers} registered` : '—',
            trend: 'neutral',
            icon: Users,
            description: 'Total registered accounts',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'New This Month',
            value: newThisMonth.toString(),
            growth: newGrowthLabel,
            trend: newGrowthPct === null ? 'neutral' : newGrowthPct >= 0 ? 'up' : 'down',
            icon: UserPlus,
            description: 'New signups in 30 days',
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Active Customers',
            value: activeCustomers.toString(),
            growth: totalCustomers > 0 ? `${((activeCustomers / totalCustomers) * 100).toFixed(0)}% active` : '—',
            trend: 'neutral',
            icon: UserCheck,
            description: 'Booked in last 90 days',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Repeat Customers',
            value: repeatCustomers.toString(),
            growth: totalCustomers > 0 ? `${repeatPct}% retention` : '—',
            trend: 'neutral',
            icon: Repeat,
            description: 'More than 1 booking',
            color: 'bg-violet-50 text-violet-600',
        },
        {
            title: 'Customer LTV',
            value: `₹${Number(avgLtv).toLocaleString()}`,
            growth: totalCustomers > 0 ? `₹${Number(totalSpend).toLocaleString()} total` : '—',
            trend: 'neutral',
            icon: TrendingUp,
            description: 'Average lifetime spend',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Average Rating',
            value: avgRating.toString(),
            growth: customersWithRating.length > 0 ? `${customersWithRating.length} reviews` : '—',
            trend: 'neutral',
            icon: Star,
            description: `From ${customersWithRating.length} reviews`,
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
                                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                                stat.trend === 'down' ? 'bg-rose-50 text-rose-600' :
                                'bg-slate-50 text-slate-500'
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
