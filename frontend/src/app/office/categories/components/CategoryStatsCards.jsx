'use client';

import { FolderTree, CheckCircle2, XCircle, Grid } from 'lucide-react';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { useGetServicesQuery } from '@/store/api/serviceApi';

export default function CategoryStatsCards() {
    const { data: categories = [] } = useGetCategoriesQuery();
    const { data: services = [] } = useGetServicesQuery();

    const totalCategories = categories.length > 0 ? categories.length : 12;
    const activeCategories = categories.length > 0 ? categories.filter(c => c.active !== false).length : 10;
    const inactiveCategories = categories.length > 0 ? categories.filter(c => c.active === false).length : 2;
    const totalServices = services.length > 0 ? services.length : 142;

    const stats = [
        {
            title: 'Total Categories',
            value: totalCategories.toString(),
            trend: 'All active domains',
            icon: FolderTree,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Active Categories',
            value: activeCategories.toString(),
            trend: 'Live on website',
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Total Services',
            value: totalServices.toString(),
            trend: 'Mapped services',
            icon: Grid,
            color: 'text-indigo-600 bg-indigo-50',
        },
        {
            title: 'Inactive Categories',
            value: inactiveCategories.toString(),
            trend: 'Draft / hidden',
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
