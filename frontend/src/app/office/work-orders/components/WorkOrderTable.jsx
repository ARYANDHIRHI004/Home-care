import { MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const mockOrders = [
    { id: 'WO-10592', bookingId: 'BKG-8492', customer: 'Priya Patel', service: 'Deep Home Cleaning', assignedTo: 'Amit Kumar', date: 'Today, 10:00 AM', status: 'Work Started', progress: 40, invoice: 'Draft', payment: 'Pending' },
    { id: 'WO-10591', bookingId: 'BKG-8491', customer: 'Rahul Sharma', service: 'AC Repair & Service', assignedTo: 'Unassigned', date: 'Today, 2:00 PM', status: 'Pending Assignment', progress: 0, invoice: '-', payment: 'Pending' },
    { id: 'WO-10590', bookingId: 'BKG-8490', customer: 'Sneha Gupta', service: 'Plumbing Service', assignedTo: 'Vikram Singh', date: 'Today, 9:00 AM', status: 'Completed', progress: 100, invoice: 'Generated', payment: 'Paid' },
    { id: 'WO-10589', bookingId: 'BKG-8489', customer: 'Arjun Mehta', service: 'Electrical Repair', assignedTo: 'Sunil Das', date: 'Tomorrow, 11:00 AM', status: 'Assigned', progress: 0, invoice: '-', payment: 'Partial' },
    { id: 'WO-10588', bookingId: 'BKG-8488', customer: 'Kavya Nair', service: 'Pest Control', assignedTo: 'Manoj T.', date: 'Today, 1:00 PM', status: 'On The Way', progress: 10, invoice: '-', payment: 'Pending' },
];

const statusConfig = {
    'Pending Assignment': 'bg-rose-50 text-rose-700 border-rose-200',
    'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
    'Accepted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'On The Way': 'bg-amber-50 text-amber-700 border-amber-200',
    'Arrived': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    'Work Started': 'bg-violet-50 text-violet-700 border-violet-200',
    'Paused': 'bg-slate-100 text-slate-700 border-slate-300',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Closed': 'bg-slate-100 text-slate-500 border-slate-200',
    'Cancelled': 'bg-rose-100 text-rose-800 border-rose-300',
};

const invoiceConfig = {
    '-': 'text-slate-400',
    'Draft': 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full',
    'Generated': 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full',
    'Sent': 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full',
    'Outstanding': 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full',
    'Paid': 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full',
};

const paymentConfig = {
    'Pending': 'text-rose-600',
    'Partial': 'text-amber-600',
    'Paid': 'text-emerald-600',
    'Refunded': 'text-slate-500',
};

export default function WorkOrderTable({ searchQuery, onRowClick }) {
    const [sortCol, setSortCol] = useState('date');
    const [sortDir, setSortDir] = useState('asc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = mockOrders.filter(o =>
        !searchQuery ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Work Orders</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} work orders found</p>
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
                            {['WO ID', 'Booking', 'Customer / Service', 'Partner', 'Scheduled', 'Status', 'Progress', 'Invoice', 'Payment', 'Actions'].map((col, i) => (
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
                        {filtered.map((o) => (
                            <tr key={o.id} onClick={() => onRowClick(o)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{o.id}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="text-xs text-slate-500">{o.bookingId}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-medium text-slate-900 text-sm">{o.customer}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{o.service}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {o.assignedTo === 'Unassigned' ? (
                                        <span className="text-slate-400 italic text-xs">Unassigned</span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                                {o.assignedTo.charAt(0)}
                                            </div>
                                            <span className="text-slate-700 text-xs font-medium">{o.assignedTo}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className={`text-xs font-medium ${o.date.includes('Today') ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>{o.date}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[o.status] || statusConfig['Pending Assignment']}`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${o.progress}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-500 w-6">{o.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className={`text-[10px] font-bold tracking-wide uppercase ${invoiceConfig[o.invoice] || ''}`}>{o.invoice}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className={`text-xs font-semibold ${paymentConfig[o.payment] || ''}`}>{o.payment}</span>
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === o.id ? null : o.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === o.id && (
                                            <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Assign Partner</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Update Status</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Reschedule</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Generate Invoice</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Print Job Sheet</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Close Work Order</button>
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
                        <p className="text-slate-500 text-sm">No work orders found.</p>
                    </div>
                )}
            </div>
            
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1–{filtered.length} of {filtered.length} orders</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Previous</button>
                    <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</span>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
