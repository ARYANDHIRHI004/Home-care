'use client';

import { Users, UserCheck, ShieldCheck, Clock } from 'lucide-react';
import { useGetPartnersQuery } from '@/store/api/partnerApi';

export default function PartnerStatsCards() {
    const { data: partners = [] } = useGetPartnersQuery();

    const totalPartners = partners.length;
    const activePartners = partners.filter(p => p.active !== false).length;
    const busyPartners = partners.filter(p => p.active !== false && p.isBusy).length;
    const offlinePartners = partners.filter(p => p.active === false).length;

    const stats = [
        {
            title: 'Total Partners',
            value: totalPartners.toString(),
            trend: 'Registered professionals',
            icon: Users,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Active & Verified',
            value: activePartners.toString(),
            trend: 'Available for work orders',
            icon: UserCheck,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'On-Job Partners',
            value: busyPartners.toString(),
            trend: 'Currently on assignment',
            icon: Clock,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Offline / Inactive',
            value: offlinePartners.toString(),
            trend: 'Not taking bookings',
            icon: ShieldCheck,
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
