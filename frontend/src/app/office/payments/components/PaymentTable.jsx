import { MoreHorizontal, ChevronUp, ChevronDown, Receipt, CheckCircle2, Clock, AlertTriangle, AlertCircle, Phone } from 'lucide-react';
import { useState } from 'react';

const mockPayments = [
    { id: 'PAY-1001', customer: 'Rahul Sharma', phone: '9876543210', booking: 'BKG-2401', invoice: 'INV-001', amount: 2500, paid: 2500, due: 0, method: 'UPI', status: 'Paid', date: '24 Oct 2023, 10:30 AM', collector: 'Online' },
    { id: 'PAY-1002', customer: 'Sneha Patel', phone: '9876543211', booking: 'BKG-2402', invoice: 'INV-002', amount: 4800, paid: 2000, due: 2800, method: 'Cash', status: 'Partial', date: '24 Oct 2023, 11:15 AM', collector: 'Partner' },
    { id: 'PAY-1003', customer: 'Vikram Singh', phone: '9876543212', booking: 'BKG-2403', invoice: 'INV-003', amount: 1500, paid: 0, due: 1500, method: '-', status: 'Pending', date: '-', collector: '-' },
    { id: 'PAY-1004', customer: 'Pooja Desai', phone: '9876543213', booking: 'BKG-2404', invoice: 'INV-004', amount: 12000, paid: 0, due: 12000, method: 'Credit Card', status: 'Failed', date: '23 Oct 2023, 04:45 PM', collector: 'Online' },
    { id: 'PAY-1005', customer: 'Amit Verma', phone: '9876543214', booking: 'BKG-2405', invoice: 'INV-005', amount: 3200, paid: 3200, due: 0, method: 'Bank Transfer', status: 'Paid', date: '22 Oct 2023, 09:00 AM', collector: 'Admin' },
];

export default function PaymentTable({ searchQuery, onRowClick, onReceivePayment }) {
    const [sortCol, setSortCol] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = mockPayments.filter(p =>
        !searchQuery ||
        p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.booking.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case 'Pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
            case 'Partial': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200"><AlertCircle className="w-3 h-3" /> Partial</span>;
            case 'Failed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Failed</span>;
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
                                                {(p.status === 'Pending' || p.status === 'Partial' || p.status === 'Failed') && (
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
