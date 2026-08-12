import { MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const mockComplaints = [
    { id: 'CMP-4821', customer: 'Priya Patel', booking: 'BKG-84915', service: 'AC Repair', partner: 'Amit Kumar', priority: 'Critical', status: 'Open', created: 'Nov 04, 2023', assignedTo: 'Riya (Manager)' },
    { id: 'CMP-4820', customer: 'Rahul Sharma', booking: 'BKG-84910', service: 'Deep Cleaning', partner: 'Vikram Singh', priority: 'High', status: 'Investigating', created: 'Nov 03, 2023', assignedTo: 'Sameer' },
    { id: 'CMP-4819', customer: 'Sneha Gupta', booking: 'BKG-84905', service: 'Plumbing', partner: 'Rajesh K.', priority: 'Medium', status: 'Waiting Customer', created: 'Nov 02, 2023', assignedTo: 'Preet' },
    { id: 'CMP-4818', customer: 'Arjun Mehta', booking: 'BKG-84900', service: 'Electrical', partner: 'Sunil Das', priority: 'Low', status: 'Resolved', created: 'Nov 01, 2023', assignedTo: 'Riya (Manager)' },
    { id: 'CMP-4817', customer: 'Kavya Nair', booking: 'BKG-84898', service: 'Pest Control', partner: 'Manoj T.', priority: 'High', status: 'New', created: 'Oct 30, 2023', assignedTo: 'Unassigned' },
    { id: 'CMP-4816', customer: 'Rohit Sinha', booking: 'BKG-84892', service: 'Appliance Repair', partner: 'Dev Sharma', priority: 'Medium', status: 'Closed', created: 'Oct 28, 2023', assignedTo: 'Sameer' },
];

const priorityConfig = {
    Critical: 'bg-rose-100 text-rose-700 border-rose-200',
    High:     'bg-orange-100 text-orange-700 border-orange-200',
    Medium:   'bg-amber-100 text-amber-700 border-amber-200',
    Low:      'bg-slate-100 text-slate-600 border-slate-200',
};

const statusConfig = {
    New:              'bg-blue-50 text-blue-700 border-blue-200',
    Open:             'bg-indigo-50 text-indigo-700 border-indigo-200',
    Investigating:    'bg-violet-50 text-violet-700 border-violet-200',
    'Waiting Customer': 'bg-amber-50 text-amber-700 border-amber-200',
    Resolved:         'bg-emerald-50 text-emerald-700 border-emerald-200',
    Closed:           'bg-slate-100 text-slate-500 border-slate-200',
    Rejected:         'bg-rose-50 text-rose-700 border-rose-200',
};

const priorityDot = {
    Critical: 'bg-rose-500',
    High:     'bg-orange-400',
    Medium:   'bg-amber-400',
    Low:      'bg-slate-400',
};

export default function ComplaintTable({ searchQuery, onRowClick }) {
    const [sortCol, setSortCol] = useState('created');
    const [sortDir, setSortDir] = useState('desc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = mockComplaints.filter(c =>
        !searchQuery ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.booking.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = ['id', 'customer', 'booking', 'service', 'partner', 'priority', 'status', 'created', 'assignedTo'];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Complaints</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} complaints found</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Show</span>
                    <select className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none">
                        <option>25</option><option>50</option><option>100</option>
                    </select>
                    <span className="text-xs text-slate-500">per page</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="w-8 pl-5 py-3"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                            {['Complaint ID', 'Customer', 'Booking', 'Service', 'Partner', 'Priority', 'Status', 'Created', 'Assigned To', 'Actions'].map((col, i) => (
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
                        {filtered.map((c) => (
                            <tr key={c.id} onClick={() => onRowClick(c)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{c.id}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-medium text-slate-900 text-sm">{c.customer}</div>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 text-xs">{c.booking}</td>
                                <td className="px-4 py-3.5 text-slate-700 text-sm">{c.service}</td>
                                <td className="px-4 py-3.5 text-slate-600 text-sm">{c.partner}</td>
                                <td className="px-4 py-3.5">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityConfig[c.priority]}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[c.priority]}`}></span>
                                        {c.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[c.status] || statusConfig['New']}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{c.created}</td>
                                <td className="px-4 py-3.5 text-slate-700 text-sm">{c.assignedTo}</td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === c.id && (
                                            <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Assign Manager</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Create Ticket</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Booking</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50">Resolve</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Close</button>
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
                        <p className="text-slate-500 text-sm">No complaints match your search.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1–{filtered.length} of {filtered.length} complaints</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Previous</button>
                    <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</span>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
