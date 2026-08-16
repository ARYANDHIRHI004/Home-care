'use client';

import { Briefcase, Star, TrendingUp, XCircle } from 'lucide-react';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';

export default function ServiceStatsCards() {
    const { data: services = [] } = useGetServicesQuery();
    const { data: categories = [] } = useGetCategoriesQuery();

    const totalServices = services.length;
    const activeServices = services.filter(s => s.active !== false).length;
    const inactiveServices = services.filter(s => s.active === false).length;
    const totalCategories = categories.length;

    const stats = [
        {
            title: 'Total Services',
            value: totalServices.toString(),
            trend: `Across ${totalCategories} categories`,
            icon: Briefcase,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Active Services',
            value: activeServices.toString(),
            trend: 'Available for booking',
            icon: TrendingUp,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Categories',
            value: totalCategories.toString(),
            trend: 'Managed service groups',
            icon: Star,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Inactive Services',
            value: inactiveServices.toString(),
            trend: 'Draft or archived',
            icon: XCircle,
            color: 'text-slate-600 bg-slate-100',
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
