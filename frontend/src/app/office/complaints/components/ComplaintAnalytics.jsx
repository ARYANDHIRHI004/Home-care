import { BarChart3, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useGetTicketsQuery } from '@/store/api/ticketApi';

export default function ComplaintAnalytics() {
    const { data: tickets = [] } = useGetTicketsQuery();

    // Calculate top services
    const serviceCounts = {};
    tickets.forEach(t => {
        const service = t.enquiryId?.serviceCategory || 'Other';
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    const totalWithService = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
    const topServices = Object.entries(serviceCounts)
        .map(([name, count]) => ({
            name,
            count,
            pct: totalWithService > 0 ? Math.round((count / totalWithService) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Calculate top partners
    const partnerCounts = {};
    tickets.forEach(t => {
        if (t.assignedPartnerId?.name) {
            partnerCounts[t.assignedPartnerId.name] = (partnerCounts[t.assignedPartnerId.name] || 0) + 1;
        }
    });
    const maxPartnerCount = Math.max(...Object.values(partnerCounts), 1);
    const partnerColors = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-slate-300'];
    const topPartners = Object.entries(partnerCounts)
        .map(([name, count], i) => ({
            name,
            count,
            color: partnerColors[i % partnerColors.length]
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    // Calculate categories (we'll just use a few common ones or priority for now)
    const priorityCounts = {};
    tickets.forEach(t => {
        const priority = t.priority || 'normal';
        priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });
    const totalPriority = Object.values(priorityCounts).reduce((a, b) => a + b, 0);
    const catColors = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-blue-400'];
    const categories = Object.entries(priorityCounts)
        .map(([label, count], i) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1) + ' Priority',
            pct: totalPriority > 0 ? Math.round((count / totalPriority) * 100) : 0,
            color: catColors[i % catColors.length]
        }))
        .sort((a, b) => b.pct - a.pct);
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
                                        <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.count / maxPartnerCount) * 100}%` }}></div>
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
