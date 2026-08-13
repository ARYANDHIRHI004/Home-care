import { Clock } from 'lucide-react';

export default function LiveJobStatus() {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-6 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live Job Status</h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View all</button>
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
                        {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-200">#JB-202{item}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">AC Deep Cleaning</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">Rahul Sharma</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">Amit Kumar</td>
                                <td className="py-3 pr-4 text-slate-500 dark:text-slate-500">10:00 AM</td>
                                <td className="py-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                        <Clock className="w-3.5 h-3.5" /> In Progress
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
