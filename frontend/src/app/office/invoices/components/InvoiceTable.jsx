import { MoreHorizontal, ChevronUp, ChevronDown, FileText, CheckCircle2, Clock, Send, FileEdit, Download } from 'lucide-react';
import { useState } from 'react';

const mockInvoices = [
    { id: 'INV-2023-001', customer: 'Rahul Sharma', booking: 'BKG-2401', subtotal: 2118, gst: 381, discount: 0, total: 2500, status: 'Paid', date: '24 Oct 2023' },
    { id: 'INV-2023-002', customer: 'Sneha Patel', booking: 'BKG-2402', subtotal: 4237, gst: 763, discount: 200, total: 4800, status: 'Sent', date: '24 Oct 2023' },
    { id: 'INV-2023-003', customer: 'Vikram Singh', booking: 'BKG-2403', subtotal: 1271, gst: 229, discount: 0, total: 1500, status: 'Draft', date: '23 Oct 2023' },
    { id: 'INV-2023-004', customer: 'Pooja Desai', booking: 'BKG-2404', subtotal: 10169, gst: 1831, discount: 0, total: 12000, status: 'Overdue', date: '15 Oct 2023' },
    { id: 'INV-2023-005', customer: 'Amit Verma', booking: 'BKG-2405', subtotal: 2712, gst: 488, discount: 0, total: 3200, status: 'Paid', date: '22 Oct 2023' },
];

export default function InvoiceTable({ searchQuery, onRowClick, onEditInvoice }) {
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

    const filtered = mockInvoices.filter(i =>
        !searchQuery ||
        i.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case 'Sent': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200"><Send className="w-3 h-3" /> Sent</span>;
            case 'Draft': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200"><FileEdit className="w-3 h-3" /> Draft</span>;
            case 'Overdue': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200"><Clock className="w-3 h-3" /> Overdue</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Invoices</h3>
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
                            {['Invoice Number', 'Customer', 'Booking', 'Amount', 'Status', 'Date', 'Actions'].map((col, i) => (
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
                        {filtered.map((inv) => (
                            <tr key={inv.id} onClick={() => onRowClick(inv)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={ev => ev.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-bold text-blue-600 text-sm flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" /> {inv.id}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-semibold text-slate-900">{inv.customer}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block border border-slate-200">
                                        {inv.booking}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-bold text-slate-900">₹{inv.total.toLocaleString()}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">Includes ₹{inv.gst.toLocaleString()} GST</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {getStatusBadge(inv.status)}
                                </td>
                                <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                                    {inv.date}
                                </td>
                                <td className="px-4 py-3.5" onClick={ev => ev.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === inv.id && (
                                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button onClick={() => onRowClick(inv)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><FileText className="w-4 h-4"/> View Details</button>
                                                {inv.status !== 'Paid' && (
                                                    <button onClick={() => onEditInvoice(inv)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><FileEdit className="w-4 h-4"/> Edit Invoice</button>
                                                )}
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Download className="w-4 h-4"/> Download PDF</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Send className="w-4 h-4"/> Send via Email</button>
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
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">No Invoices Found</h3>
                        <p className="text-slate-500 text-xs mb-4">Try adjusting your filters or create a new invoice.</p>
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
