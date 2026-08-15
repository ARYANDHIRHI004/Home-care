'use client';

import { MoreHorizontal, ChevronUp, ChevronDown, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useGetTicketsQuery, useDeleteTicketMutation, useUpdateTicketStatusMutation } from '@/store/api/ticketApi';

const fallbackComplaints = [
    { id: 'CMP-4821', customer: 'Priya Patel', booking: 'BKG-84915', service: 'AC Repair', partner: 'Amit Kumar', priority: 'High', status: 'Open', created: 'Nov 04, 2023', assignedTo: 'Riya (Manager)' },
    { id: 'CMP-4820', customer: 'Rahul Sharma', booking: 'BKG-84910', service: 'Deep Cleaning', partner: 'Vikram Singh', priority: 'High', status: 'In Progress', created: 'Nov 03, 2023', assignedTo: 'Sameer' },
    { id: 'CMP-4819', customer: 'Sneha Gupta', booking: 'BKG-84905', service: 'Plumbing', partner: 'Rajesh K.', priority: 'Normal', status: 'Open', created: 'Nov 02, 2023', assignedTo: 'Preet' },
    { id: 'CMP-4818', customer: 'Arjun Mehta', booking: 'BKG-84900', service: 'Electrical', partner: 'Sunil Das', priority: 'Low', status: 'Closed', created: 'Nov 01, 2023', assignedTo: 'Riya (Manager)' },
    { id: 'CMP-4817', customer: 'Kavya Nair', booking: 'BKG-84898', service: 'Pest Control', partner: 'Manoj T.', priority: 'High', status: 'Open', created: 'Oct 30, 2023', assignedTo: 'Unassigned' },
    { id: 'CMP-4816', customer: 'Rohit Sinha', booking: 'BKG-84892', service: 'Appliance Repair', partner: 'Dev Sharma', priority: 'Normal', status: 'Closed', created: 'Oct 28, 2023', assignedTo: 'Sameer' },
];

const priorityConfig = {
    high:     'bg-orange-100 text-orange-700 border-orange-200',
    High:     'bg-orange-100 text-orange-700 border-orange-200',
    normal:   'bg-amber-100 text-amber-700 border-amber-200',
    Normal:   'bg-amber-100 text-amber-700 border-amber-200',
    low:      'bg-slate-100 text-slate-600 border-slate-200',
    Low:      'bg-slate-100 text-slate-600 border-slate-200',
};

const statusConfig = {
    open:         'bg-blue-50 text-blue-700 border-blue-200',
    Open:         'bg-blue-50 text-blue-700 border-blue-200',
    in_progress:  'bg-violet-50 text-violet-700 border-violet-200',
    'In Progress':'bg-violet-50 text-violet-700 border-violet-200',
    completed:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    Resolved:     'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed:       'bg-slate-100 text-slate-500 border-slate-200',
    Closed:       'bg-slate-100 text-slate-500 border-slate-200',
};

export default function ComplaintTable({ searchQuery, onRowClick }) {
    const { data: rawTickets = [], isLoading } = useGetTicketsQuery();
    const [deleteTicket] = useDeleteTicketMutation();
    const [updateStatus] = useUpdateTicketStatusMutation();

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

    const tickets = rawTickets.length > 0
        ? rawTickets.map(t => ({
            id: t.ticketNumber || `TCK-${t._id?.slice(-4).toUpperCase()}`,
            _id: t._id,
            customer: t.customerId?.name || t.customerName || 'Customer',
            booking: t.enquiryId?._id ? `ENQ-${t.enquiryId._id.slice(-4).toUpperCase()}` : 'BKG-84915',
            service: t.enquiryId?.serviceCategory || 'Service Issue',
            partner: t.assignedPartnerId?.name || 'Unassigned',
            priority: t.priority || 'normal',
            status: t.status || 'open',
            created: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Today',
            assignedTo: t.assignedPartnerId?.name || 'Support Desk',
            _raw: t,
        }))
        : fallbackComplaints;

    const filtered = tickets.filter(c =>
        !searchQuery ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.booking.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this complaint / ticket?')) {
            try {
                await deleteTicket(id).unwrap();
                setOpenMenuId(null);
            } catch (err) {
                console.error('Failed to delete ticket', err);
            }
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Complaints</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} complaints found</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                            <th className="py-3 px-4 w-10 text-center">
                                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th onClick={() => toggleSort('id')} className="py-3 px-4 cursor-pointer hover:text-slate-700">
                                <div className="flex items-center gap-1">Complaint ID <SortIcon col="id" /></div>
                            </th>
                            <th onClick={() => toggleSort('customer')} className="py-3 px-4 cursor-pointer hover:text-slate-700">
                                <div className="flex items-center gap-1">Customer <SortIcon col="customer" /></div>
                            </th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Partner</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4">Status</th>
                            <th onClick={() => toggleSort('created')} className="py-3 px-4 cursor-pointer hover:text-slate-700">
                                <div className="flex items-center gap-1">Created <SortIcon col="created" /></div>
                            </th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                        {filtered.map((c) => (
                            <tr
                                key={c._id || c.id}
                                onClick={() => onRowClick(c)}
                                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                            >
                                <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="py-3.5 px-4 font-mono font-medium text-blue-600 group-hover:underline">
                                    {c.id}
                                </td>
                                <td className="py-3.5 px-4 font-medium text-slate-900">
                                    {c.customer}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">{c.service}</td>
                                <td className="py-3.5 px-4 text-slate-600">{c.partner}</td>
                                <td className="py-3.5 px-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border capitalize ${priorityConfig[c.priority] || priorityConfig.normal}`}>
                                        {c.priority}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusConfig[c.status] || statusConfig.open}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 text-xs">{c.created}</td>
                                <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === c.id && (
                                            <div className="absolute right-0 top-7 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-xs">
                                                <button onClick={() => { onRowClick(c); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5">
                                                    <Edit className="w-3 h-3" /> View Details
                                                </button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button onClick={(e) => c._raw ? handleDelete(c._id, e) : null} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5">
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-sm">
                        No complaints match your search.
                    </div>
                )}
            </div>
        </div>
    );
}
