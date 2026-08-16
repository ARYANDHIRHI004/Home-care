import { MoreHorizontal, ChevronUp, ChevronDown, Receipt, CheckCircle2, Clock, AlertTriangle, AlertCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';

export default function PaymentTable({ searchQuery, onRowClick, onReceivePayment }) {
    const [sortCol, setSortCol] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [openMenuId, setOpenMenuId] = useState(null);
    const { data: rawPayments = [], isLoading, isError } = useGetPaymentsQuery();

    const payments = rawPayments.map(p => ({
        id: p._id,
        displayId: `PAY-${p._id.slice(-4).toUpperCase()}`,
        customer: p.invoiceId?.customerId?.name || p.customerId?.name || 'Unknown',
        phone: p.invoiceId?.customerId?.phone || p.customerId?.phone || '—',
        booking: p.workOrderId ? `WO-${String(p.workOrderId).slice(-4).toUpperCase()}` : '—',
        invoice: p.invoiceId ? `INV-${String(p.invoiceId._id || p.invoiceId).slice(-4).toUpperCase()}` : '—',
        amount: p.amount || 0,
        paid: p.amountPaid || p.amount || 0,
        due: (p.amount || 0) - (p.amountPaid || p.amount || 0),
        method: p.method || '—',
        status: p.status || 'Pending',
        date: p.paidAt ? new Date(p.paidAt).toLocaleString() : '—',
        collector: p.collectedBy || 'Online',
        _raw: p,
    }));

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = payments.filter(p =>
        !searchQuery ||
        p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.booking.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Matches Payment.status's real enum (pending/verified/failed — see
    // payment.model.js). 'Paid'/'Partial' aren't Payment statuses at all
    // (those belong to Invoice.paymentStatus), and the capitalized keys
    // here never matched the real lowercase values, so every real payment
    // fell through to the plain default badge before this fix.
    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
            case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
            case 'failed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Failed</span>;
            default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Payment History</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} records found</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Show</span>
                    <select className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none">
                        <option>25</option><option>50</option><option>100</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="w-8 pl-5 py-3"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                            {['Payment ID / Customer', 'References', 'Amount', 'Paid', 'Due', 'Method', 'Status', 'Date', 'Actions'].map((col, i) => (
                                <th key={i} onClick={() => col !== 'Actions' && toggleSort(col.toLowerCase())} className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${col !== 'Actions' ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        {col}
                                        {col !== 'Actions' && <SortIcon col={col.toLowerCase()} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading && (
                            <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">Loading payments…</td></tr>
                        )}
                        {isError && (
                            <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-rose-500">Failed to load payments.</td></tr>
                        )}
                        {filtered.map((p) => (
                            <tr key={p.id} onClick={() => onRowClick(p)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={ev => ev.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                        <Receipt className="w-3.5 h-3.5 text-slate-400" /> {p.id}
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1">{p.customer}</div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {p.phone}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mb-1 border border-slate-200">
                                        BKG: {p.booking}
                                    </div>
                                    <br />
                                    <div className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block border border-blue-100">
                                        INV: {p.invoice}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 font-bold text-slate-900">
                                    ₹{p.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-emerald-600">
                                    ₹{p.paid.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-rose-600">
                                    ₹{p.due.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-xs font-medium text-slate-700">{p.method}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">By: {p.collector}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {getStatusBadge(p.status)}
                                </td>
                                <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                                    {p.date}
                                </td>
                                <td className="px-4 py-3.5" onClick={ev => ev.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === p.id && (
                                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button onClick={() => onRowClick(p)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Details</button>
                                                {(p.status === 'pending' || p.status === 'failed') && (
                                                    <button onClick={() => onReceivePayment(p)} className="w-full text-left px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50">Receive Payment</button>
                                                )}
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Download Receipt</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Print</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">No Payments Found</h3>
                        <p className="text-slate-500 text-xs mb-4">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
            
            {filtered.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1–{filtered.length} of {filtered.length} records</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Previous</button>
                        <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</span>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}
