'use client';

import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';

export default function LiveJobStatus() {
    const { data: workOrders = [], isLoading } = useGetWorkOrdersQuery();

    const displayJobs = workOrders.length > 0
        ? workOrders.filter(wo => ['New', 'Open', 'Assigned', 'In Progress'].includes(wo.status)).slice(0, 5).map(wo => ({
            id: wo.workOrderNumber || `#WO-${wo._id?.slice(-4).toUpperCase()}`,
            service: wo.enquiryId?.serviceCategory || wo.title || 'Home Care Service',
            customer: wo.customerId?.name || 'Customer',
            partner: wo.assignedPartnerId?.name || 'Unassigned',
            time: wo.createdAt ? new Date(wo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            status: wo.status || 'Open'
        }))
        : [];

    const getStatusBadge = (status) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                );
            case 'in progress':
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                        <Clock className="w-3.5 h-3.5" /> In Progress
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                        <AlertCircle className="w-3 h-3" /> {status}
                    </span>
                );
        }
    };

    return (
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-6 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live Job Status</h3>
                <Link href="/office/work-orders" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    View all
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <th className="pb-3 pr-4">Job ID</th>
                            <th className="pb-3 pr-4">Service</th>
                            <th className="pb-3 pr-4">Customer</th>
                            <th className="pb-3 pr-4">Partner</th>
                            <th className="pb-3 pr-4">Time</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {displayJobs.length > 0 ? (
                            displayJobs.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-200">{item.id}</td>
                                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{item.service}</td>
                                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{item.customer}</td>
                                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{item.partner}</td>
                                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-500">{item.time}</td>
                                    <td className="py-3">{getStatusBadge(item.status)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-slate-500">
                                    No live jobs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
