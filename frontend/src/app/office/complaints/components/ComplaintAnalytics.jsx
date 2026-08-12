import { BarChart3, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

const topServices = [
    { name: 'AC Repair & Service', count: 84, pct: 84 },
    { name: 'Plumbing', count: 67, pct: 67 },
    { name: 'Electrical', count: 52, pct: 52 },
    { name: 'Deep Cleaning', count: 38, pct: 38 },
    { name: 'Appliance Repair', count: 29, pct: 29 },
];

const topPartners = [
    { name: 'Amit Kumar', count: 18, color: 'bg-rose-400' },
    { name: 'Sunil Das', count: 14, color: 'bg-orange-400' },
    { name: 'Dev Sharma', count: 11, color: 'bg-amber-400' },
    { name: 'Manoj T.', count: 8, color: 'bg-slate-300' },
];

const categories = [
    { label: 'Service Quality', pct: 42, color: 'bg-rose-400' },
    { label: 'Technician Behavior', pct: 28, color: 'bg-orange-400' },
    { label: 'Delayed Arrival', pct: 18, color: 'bg-amber-400' },
    { label: 'Pricing Issue', pct: 12, color: 'bg-blue-400' },
];

export default function ComplaintAnalytics() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">

            {/* Complaint Categories */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Complaint Categories</h3>
                </div>
                <div className="space-y-3">
                    {categories.map((cat, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-600 font-medium">{cat.label}</span>
                                <span className="text-slate-500">{cat.pct}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Most Complained Services */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Most Complained Services</h3>
                </div>
                <div className="space-y-3">
                    {topServices.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-4 font-mono">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-700 font-medium truncate mr-2">{s.name}</span>
                                    <span className="text-slate-500 flex-shrink-0">{s.count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                                    <div className="h-full rounded-full bg-rose-400" style={{ width: `${s.pct}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Most Complained Partners + Avg Resolution */}
            <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-900">Partner Complaint Count</h3>
                    </div>
                    <div className="space-y-3">
                        {topPartners.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0">
                                    {p.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-700 font-medium truncate mr-2">{p.name}</span>
                                        <span className="text-slate-500">{p.count} complaints</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full">
                                        <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.count / 18) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-200" />
                        <h3 className="text-sm font-semibold text-blue-100">Avg. Resolution Time</h3>
                    </div>
                    <div className="text-4xl font-bold mb-1">18h</div>
                    <div className="text-blue-200 text-xs">-2h vs last month · <span className="text-emerald-300 font-semibold">Improving ↑</span></div>
                    <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[10px] text-blue-200">Fastest</p>
                            <p className="text-sm font-bold">4h 20m</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-blue-200">Slowest</p>
                            <p className="text-sm font-bold">3d 14h</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
