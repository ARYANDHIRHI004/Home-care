import { CheckCircle2, Clock, AlertCircle, AlertTriangle, Send } from 'lucide-react';
import { topServices, topCustomers, recentPayments } from '../data/revenueData';

function StatusBadge({ status }) {
    switch (status) {
        case 'Paid': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
        case 'Pending': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
        case 'Partial': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200"><AlertCircle className="w-3 h-3" /> Partial</span>;
        case 'Failed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Failed</span>;
        default: return null;
    }
}

export function TopServicesTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Top Revenue Generating Services</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ranked by total revenue in selected period</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Service</th>
                            <th className="px-6 py-3 text-center">Bookings</th>
                            <th className="px-6 py-3 text-right">Revenue</th>
                            <th className="px-6 py-3 text-right">Avg Ticket</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {topServices.map((s, i) => (
                            <tr key={s.service} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500'}`}>
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">{s.service}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold">{s.bookings}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{s.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-slate-600 font-medium">₹{s.avgTicket.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function TopCustomersTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Top Customers by Revenue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Highest spending customers in selected period</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-center">Bookings</th>
                            <th className="px-6 py-3 text-right">Total Revenue</th>
                            <th className="px-6 py-3 text-right">Outstanding</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {topCustomers.map((c, i) => (
                            <tr key={c.customer} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500'}`}>
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{c.customer}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{c.email}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold">{c.bookings}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{c.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    {c.outstanding > 0
                                        ? <span className="font-bold text-rose-600">₹{c.outstanding.toLocaleString()}</span>
                                        : <span className="text-emerald-600 font-semibold text-xs">Cleared</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function RecentPaymentsTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Payments</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest payment transactions</p>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 text-left">Invoice</th>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-center">Method</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recentPayments.map((p) => (
                            <tr key={p.invoice} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-blue-600">{p.invoice}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{p.customer}</td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-medium">{p.method}</span>
                                </td>
                                <td className="px-6 py-4 text-center"><StatusBadge status={p.status} /></td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500 whitespace-nowrap">{p.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
