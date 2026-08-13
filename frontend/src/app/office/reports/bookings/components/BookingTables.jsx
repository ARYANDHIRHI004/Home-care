import { CheckCircle2, Clock, XCircle, Loader2, Star } from 'lucide-react';
import { recentBookings, topServices, topPartners } from '../data/bookingData';

function StatusBadge({ status }) {
    switch (status) {
        case 'Completed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
        case 'In Progress': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200"><Loader2 className="w-3 h-3" /> In Progress</span>;
        case 'Pending': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
        case 'Cancelled': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
        default: return null;
    }
}

function RatingStars({ rating }) {
    return (
        <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-900">{rating}</span>
        </div>
    );
}

export function RecentBookingsTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Bookings</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest booking activity</p>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 text-left">Booking ID</th>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-left">Service</th>
                            <th className="px-6 py-3 text-left">Partner</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recentBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-blue-600">{b.id}</td>
                                <td className="px-6 py-4 font-semibold text-slate-900">{b.customer}</td>
                                <td className="px-6 py-4 text-slate-600">{b.service}</td>
                                <td className="px-6 py-4">
                                    {b.partner === 'Unassigned'
                                        ? <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Unassigned</span>
                                        : <span className="text-slate-700 font-medium">{b.partner}</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-center"><StatusBadge status={b.status} /></td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{b.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500 whitespace-nowrap">{b.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function TopServicesTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Top Services by Bookings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Most popular services and their performance</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Service</th>
                            <th className="px-6 py-3 text-center">Bookings</th>
                            <th className="px-6 py-3 text-center">Completion Rate</th>
                            <th className="px-6 py-3 text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {topServices.map((s, i) => (
                            <tr key={s.service} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : 'bg-slate-50 text-slate-500'}`}>
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">{s.service}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold">{s.bookings}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className={`h-full rounded-full ${s.completionRate >= 93 ? 'bg-emerald-500' : s.completionRate >= 88 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                style={{ width: `${s.completionRate}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 w-8 text-right">{s.completionRate}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{s.revenue.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function TopPartnersTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Top Performing Partners</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ranked by jobs completed and rating</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Partner</th>
                            <th className="px-6 py-3 text-center">Completed Jobs</th>
                            <th className="px-6 py-3 text-center">Rating</th>
                            <th className="px-6 py-3 text-center">Acceptance Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {topPartners.map((p, i) => (
                            <tr key={p.partner} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : 'bg-slate-50 text-slate-500'}`}>
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">{p.partner}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs font-bold">{p.completedJobs}</span>
                                </td>
                                <td className="px-6 py-4 text-center"><RatingStars rating={p.rating} /></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className={`h-full rounded-full ${p.acceptanceRate >= 95 ? 'bg-emerald-500' : p.acceptanceRate >= 90 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                style={{ width: `${p.acceptanceRate}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 w-8 text-right">{p.acceptanceRate}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
