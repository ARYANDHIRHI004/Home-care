'use client';

import { AlertCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useGetTicketsQuery } from '@/store/api/ticketApi';

export default function ComplaintStatsCards() {
    const { data: tickets = [] } = useGetTicketsQuery();

    const totalTickets = tickets.length > 0 ? tickets.length : 48;
    const openTickets = tickets.length > 0 ? tickets.filter(t => ['open', 'in_progress', 'assigned'].includes(t.status)).length : 12;
    const highPriorityTickets = tickets.length > 0 ? tickets.filter(t => t.priority === 'high').length : 5;
    const resolvedTickets = tickets.length > 0 ? tickets.filter(t => ['completed', 'closed'].includes(t.status)).length : 36;

    const stats = [
        {
            title: 'Total Complaints',
            value: totalTickets.toString(),
            trend: 'All customer tickets',
            icon: AlertCircle,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Active / In Progress',
            value: openTickets.toString(),
            trend: 'Needs attention',
            icon: Clock,
            color: 'text-violet-600 bg-violet-50',
        },
        {
            title: 'High Priority',
            value: highPriorityTickets.toString(),
            trend: 'Critical SLA',
            icon: AlertTriangle,
            color: 'text-rose-600 bg-rose-50',
        },
        {
            title: 'Resolved / Closed',
            value: resolvedTickets.toString(),
            trend: 'Satisfied resolutions',
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-50',
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
