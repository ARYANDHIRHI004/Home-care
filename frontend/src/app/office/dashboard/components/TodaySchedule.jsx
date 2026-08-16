'use client';

import { Plus } from 'lucide-react';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';

export default function TodaySchedule() {
    const { data: workOrders = [] } = useGetWorkOrdersQuery();
    
    const now = new Date();
    const todayStr = now.toDateString();

    const todaysSchedule = workOrders
        .filter(wo => wo.scheduledDate && new Date(wo.scheduledDate).toDateString() === todayStr)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .map(wo => ({
            time: new Date(wo.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: wo.title || (wo.enquiryId?.serviceCategory) || 'Home Care Service',
            type: `Work Order ${wo.workOrderNumber || ''}`,
        }));

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-6 transition-colors duration-200 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today's Schedule</h3>
                <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div className="space-y-4">
                {todaysSchedule.length > 0 ? (
                    todaysSchedule.map((event, idx) => (
                        <div key={idx} className="flex gap-4 items-start relative pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900"></div>
                            <div className="min-w-[65px] text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{event.time}</div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{event.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{event.type}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No scheduled items for today.</p>
                )}
            </div>
        </div>
    );
}
