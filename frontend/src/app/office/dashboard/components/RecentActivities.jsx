import { UserCheck, FileDigit, Ticket, IndianRupee } from 'lucide-react';

export default function RecentActivities() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Recent Activities</h3>
            <div className="space-y-5">
                {[
                    { user: 'Sarah J.', action: 'assigned booking', target: '#JB-2021 to Amit K.', time: '10 mins ago', icon: UserCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                    { user: 'System', action: 'generated invoice', target: '#INV-0892', time: '25 mins ago', icon: FileDigit, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                    { user: 'Customer', action: 'raised ticket', target: '#TCK-011', time: '1 hour ago', icon: Ticket, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/30' },
                    { user: 'Admin', action: 'updated pricing for', target: 'AC Services', time: '2 hours ago', icon: IndianRupee, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                ].map((activity, idx) => (
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
                ))}
            </div>
        </div>
    );
}
