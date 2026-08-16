import { UserCheck, FileDigit, Ticket, IndianRupee, Briefcase } from 'lucide-react';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';

export default function RecentActivities() {
    const { data: workOrders = [] } = useGetWorkOrdersQuery();

    const recentActivities = workOrders
        .filter(wo => wo.updatedAt || wo.createdAt)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5)
        .map(wo => {
            const timeAgo = (dateStr) => {
                const diff = (new Date() - new Date(dateStr)) / 1000;
                if (diff < 60) return 'Just now';
                if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
                if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
                return `${Math.floor(diff / 86400)} days ago`;
            };

            let action = 'updated work order';
            let icon = Briefcase;
            let color = 'text-blue-600 dark:text-blue-400';
            let bg = 'bg-blue-50 dark:bg-blue-900/30';

            if (wo.status === 'Completed') {
                action = 'completed work order';
                color = 'text-emerald-600 dark:text-emerald-400';
                bg = 'bg-emerald-50 dark:bg-emerald-900/30';
                icon = UserCheck;
            } else if (wo.status === 'Assigned') {
                action = `assigned to ${wo.assignedPartnerId?.name || 'partner'}`;
                color = 'text-amber-600 dark:text-amber-400';
                bg = 'bg-amber-50 dark:bg-amber-900/30';
                icon = UserCheck;
            } else if (wo.status === 'New') {
                action = 'created new work order';
                color = 'text-indigo-600 dark:text-indigo-400';
                bg = 'bg-indigo-50 dark:bg-indigo-900/30';
                icon = Ticket;
            }

            return {
                user: wo.customerId?.name || 'Customer',
                action,
                target: wo.workOrderNumber || `#WO-${wo._id?.slice(-4).toUpperCase()}`,
                time: timeAgo(wo.updatedAt || wo.createdAt),
                icon,
                color,
                bg
            };
        });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Recent Activities</h3>
            <div className="space-y-5">
                {recentActivities.length > 0 ? (
                    recentActivities.map((activity, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bg} ${activity.color}`}>
                                <activity.icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-900 dark:text-slate-300">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activity.user}</span> {activity.action} <span className="font-medium text-slate-900 dark:text-slate-100">{activity.target}</span>
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
                )}
            </div>
        </div>
    );
}
