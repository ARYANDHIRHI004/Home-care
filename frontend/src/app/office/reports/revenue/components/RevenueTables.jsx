import { CheckCircle2, Clock, AlertCircle, AlertTriangle } from 'lucide-react';

function toLabel(value) {
    return String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function StatusBadge({ status }) {
    switch (status) {
        case 'verified': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
        case 'pending': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
        case 'failed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Failed</span>;
        default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-50 text-slate-700 border border-slate-200"><AlertCircle className="w-3 h-3" /> {toLabel(status)}</span>;
    }
}

export function TopServicesTable({ bookings = [] }) {
    const servicesMap = bookings.reduce((acc, b) => {
        const service = b.serviceName || b.category || 'Unknown Service';
        if (!acc[service]) acc[service] = { service, bookings: 0, revenue: 0 };
        acc[service].bookings += 1;
        acc[service].revenue += (b.amount || 0);
        return acc;
    }, {});

    const topServices = Object.values(servicesMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((s) => ({ ...s, avgTicket: s.bookings > 0 ? Math.round(s.revenue / s.bookings) : 0 }));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Top Revenue Generating Services</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ranked by total revenue</p>
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
                        {topServices.length > 0 ? topServices.map((s, i) => (
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
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{Number(s.revenue).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-slate-600 font-medium">₹{Number(s.avgTicket).toLocaleString()}</td>
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

export function TopCustomersTable({ bookings = [] }) {
    const customerMap = bookings.reduce((acc, b) => {
        const key = b.customerId?._id || b.customerId || b.phone || b.customerName;
        if (!key) return acc;
        if (!acc[key]) acc[key] = { id: key, customer: b.customerName || 'Unknown', phone: b.phone || '', bookings: 0, revenue: 0, outstanding: 0 };
        acc[key].bookings += 1;
        acc[key].revenue += (b.amount || 0);
        if (b.paymentStatus !== 'paid') acc[key].outstanding += (b.amount || 0);
        return acc;
    }, {});

    const topCustomersList = Object.values(customerMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Top Customers by Revenue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Highest spending customers</p>
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
                        {topCustomersList.length > 0 ? topCustomersList.map((c, i) => (
                            <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500'}`}>
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{c.customer}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{c.phone}</div>
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
                        )) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">No data yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function RecentPaymentsTable({ payments = [], invoices = [] }) {
    const customerByInvoiceId = invoices.reduce((acc, inv) => {
        const name = inv.workOrderId?.customerId?.name || inv.workOrderId?.customerName;
        if (name) acc[inv._id] = name;
        return acc;
    }, {});

    const recentPaymentsList = [...payments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((p) => {
            const invoiceId = p.invoiceId?._id || p.invoiceId;
            return {
                id: p._id,
                invoice: p.invoiceId?.invoiceNumber || `#INV-${p._id?.slice(-4).toUpperCase()}`,
                customer: customerByInvoiceId[invoiceId] || 'Customer',
                amount: p.amount || 0,
                method: toLabel(p.method || 'cash'),
                status: p.status || 'pending',
                date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-',
            };
        });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Payments</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest payment transactions</p>
                </div>
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
                        {recentPaymentsList.length > 0 ? recentPaymentsList.map((p) => (
                            <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-blue-600">{p.invoice}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{p.customer}</td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-medium">{p.method}</span>
                                </td>
                                <td className="px-6 py-4 text-center"><StatusBadge status={p.status} /></td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500 whitespace-nowrap">{p.date}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400">No data yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
