import { CheckCircle2, Clock, XCircle, Loader2, Star } from 'lucide-react';

function toLabel(value) {
    return String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function StatusBadge({ status }) {
    switch (status) {
        case 'completed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
        case 'in_progress': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200"><Loader2 className="w-3 h-3" /> In Progress</span>;
        case 'cancelled': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
        default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> {toLabel(status)}</span>;
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

export function RecentBookingsTable({ bookings = [], partners = [] }) {
    const partnerNameById = partners.reduce((acc, p) => { acc[p._id] = p.name; return acc; }, {});

    const recentBookingsList = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((b) => ({
            id: b.bookingNumber || `#BKG-${b._id?.slice(-4).toUpperCase()}`,
            customer: b.customerName || 'Customer',
            service: b.serviceName || b.category || 'Service',
            partner: partnerNameById[b.partnerId?._id || b.partnerId] || b.assignedTo || 'Unassigned',
            status: b.status || 'upcoming',
            amount: b.amount || 0,
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-',
        }));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Bookings</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest booking activity</p>
                </div>
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
                        {recentBookingsList.length > 0 ? recentBookingsList.map((b) => (
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
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{Number(b.amount).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500 whitespace-nowrap">{b.date}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-400">No data yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function TopServicesTable({ bookings = [] }) {
    const servicesMap = bookings.reduce((acc, b) => {
        const service = b.serviceName || b.category || 'Unknown Service';
        if (!acc[service]) acc[service] = { service, bookings: 0, completed: 0, revenue: 0 };
        acc[service].bookings += 1;
        acc[service].revenue += (b.amount || 0);
        if (b.status === 'completed') acc[service].completed += 1;
        return acc;
    }, {});

    const topServicesList = Object.values(servicesMap)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5)
        .map((s) => ({
            ...s,
            completionRate: s.bookings > 0 ? ((s.completed / s.bookings) * 100).toFixed(0) : 0
        }));

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
                        {topServicesList.length > 0 ? topServicesList.map((s, i) => (
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
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{Number(s.revenue).toLocaleString()}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">No data yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function TopPartnersTable({ bookings = [], partners = [] }) {
    const partnerStats = partners.map((p) => {
        const jobs = bookings.filter((b) => (b.partnerId?._id || b.partnerId) === p._id);
        const completedJobs = jobs.filter((b) => b.status === 'completed').length;
        const totalAssigned = jobs.length;

        return {
            id: p._id,
            partner: p.name || 'Unknown Partner',
            completedJobs,
            rating: p.avgRating || 0,
            acceptanceRate: totalAssigned > 0 ? (((totalAssigned - jobs.filter((b) => b.status === 'cancelled').length) / totalAssigned) * 100).toFixed(0) : 100
        };
    });

    const topPartnersList = partnerStats
        .filter((p) => p.completedJobs > 0)
        .sort((a, b) => b.completedJobs - a.completedJobs)
        .slice(0, 5);

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
                        {topPartnersList.length > 0 ? topPartnersList.map((p, i) => (
                            <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
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
                        )) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">No data yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
