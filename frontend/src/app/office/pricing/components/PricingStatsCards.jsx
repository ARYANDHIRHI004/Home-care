import { IndianRupee, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { useGetServicesQuery } from '@/store/api/serviceApi';

export default function PricingStatsCards() {
    const { data: rawServices = [] } = useGetServicesQuery();

    const validPrices = rawServices.filter(s => s.basePrice !== undefined && s.basePrice !== null);
    
    let avgPrice = 0;
    let highestPrice = { value: 0, name: '-' };
    let lowestPrice = { value: 0, name: '-' };
    
    if (validPrices.length > 0) {
        const total = validPrices.reduce((sum, s) => sum + s.basePrice, 0);
        avgPrice = Math.round(total / validPrices.length);
        
        const sortedDesc = [...validPrices].sort((a, b) => b.basePrice - a.basePrice);
        highestPrice = { value: sortedDesc[0].basePrice, name: sortedDesc[0].name };
        
        const sortedAsc = [...validPrices].sort((a, b) => a.basePrice - b.basePrice);
        lowestPrice = { value: sortedAsc[0].basePrice, name: sortedAsc[0].name };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = rawServices.filter(s => new Date(s.updatedAt) >= sevenDaysAgo).length;

    const stats = [
        {
            title: 'Avg Service Price',
            value: `₹${avgPrice.toLocaleString()}`,
            trend: 'Across all services',
            icon: IndianRupee,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Highest Price',
            value: `₹${highestPrice.value.toLocaleString()}`,
            trend: highestPrice.name,
            icon: ArrowUpCircle,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Lowest Price',
            value: `₹${lowestPrice.value.toLocaleString()}`,
            trend: lowestPrice.name,
            icon: ArrowDownCircle,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Recently Updated',
            value: recentCount.toString(),
            trend: 'Prices changed this week',
            icon: Clock,
            color: 'text-violet-600 bg-violet-50',
        },
    ];

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
