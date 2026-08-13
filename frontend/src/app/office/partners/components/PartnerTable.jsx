import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, User, Star } from 'lucide-react';
import { useState } from 'react';

const mockPartners = [
    { id: 'HC-P-001', name: 'Rajesh Kumar', phone: '+91 98765 43210', skill: 'Expert Plumber', experience: '5 Years', jobs: 245, rating: 4.8, availability: 'Available', verification: 'Verified', status: 'Active' },
    { id: 'HC-P-002', name: 'Suresh Singh', phone: '+91 98765 43211', skill: 'AC Technician', experience: '3 Years', jobs: 120, rating: 4.5, availability: 'On Job', verification: 'Verified', status: 'Active' },
    { id: 'HC-P-003', name: 'Amit Sharma', phone: '+91 98765 43212', skill: 'Electrician', experience: '1 Year', jobs: 45, rating: 4.2, availability: 'Available', verification: 'Pending', status: 'Active' },
    { id: 'HC-P-004', name: 'Priya Patel', phone: '+91 98765 43213', skill: 'Deep Cleaning', experience: '2 Years', jobs: 310, rating: 4.9, availability: 'Offline', verification: 'Verified', status: 'On Leave' },
    { id: 'HC-P-005', name: 'Vikram Das', phone: '+91 98765 43214', skill: 'Pest Control', experience: '4 Years', jobs: 180, rating: 3.8, availability: 'Offline', verification: 'Rejected', status: 'Suspended' },
];

export default function PartnerTable({ searchQuery, onRowClick }) {
    const [sortCol, setSortCol] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = mockPartners.filter(p =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">Active</span>;
            case 'Inactive': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">Inactive</span>;
            case 'Suspended': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-700">Suspended</span>;
            case 'Training': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700">Training</span>;
            case 'On Leave': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700">On Leave</span>;
            default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">{status}</span>;
        }
    };

    const getAvailabilityBadge = (availability) => {
        switch (availability) {
            case 'Available': return <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>;
            case 'Busy': return <span className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Busy</span>;
            case 'On Job': return <span className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-blue-500"></div> On Job</span>;
            case 'Offline': return <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Offline</span>;
            default: return <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-slate-300"></div> {availability}</span>;
        }
    };

    const getVerificationBadge = (status) => {
        if (status === 'Verified') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200"><ShieldCheck className="w-3 h-3" /> Verified</span>;
        if (status === 'Pending') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
        if (status === 'Rejected') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Rejected</span>;
        return null;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Partners</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} partners found</p>
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
                            {['Partner', 'Experience', 'Jobs & Rating', 'Availability', 'Verification', 'Status', 'Actions'].map((col, i) => (
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
                                <td className="pl-5 py-3.5" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{p.id} • {p.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-sm font-medium text-slate-700">{p.skill}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{p.experience} Exp</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-sm font-semibold text-slate-700">{p.jobs} Jobs</div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {p.rating}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {getAvailabilityBadge(p.availability)}
                                </td>
                                <td className="px-4 py-3.5">
                                    {getVerificationBadge(p.verification)}
                                </td>
                                <td className="px-4 py-3.5">
                                    {getStatusBadge(p.status)}
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === p.id && (
                                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Profile</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Assign Work Order</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Call Partner</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">WhatsApp</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">Suspend Partner</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
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
                            <User className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">No Partners Found</h3>
                        <p className="text-slate-500 text-xs mb-4">Add your first service partner to start assigning work orders.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            + Add Partner
                        </button>
                    </div>
                )}
            </div>
            
            {filtered.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1–{filtered.length} of {filtered.length} partners</span>
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
