import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, XCircle, Image as ImageIcon, Star } from 'lucide-react';
import { useState } from 'react';

const mockServices = [
    { id: 'SRV-001', name: 'Deep Home Cleaning (3 BHK)', category: 'Deep Cleaning', price: '₹4,499', duration: '5-6 Hours', warranty: '30 Days', status: 'Active', featured: true },
    { id: 'SRV-002', name: 'Split AC Servicing', category: 'AC Repair', price: '₹599', duration: '45 Mins', warranty: '30 Days', status: 'Active', featured: true },
    { id: 'SRV-003', name: 'Wash Basin Pipe Repair', category: 'Plumbing', price: '₹149', duration: '30 Mins', warranty: '-', status: 'Active', featured: false },
    { id: 'SRV-004', name: 'Termite Control (2 BHK)', category: 'Pest Control', price: '₹3,199', duration: '2 Hours', warranty: '1 Year', status: 'Active', featured: false },
    { id: 'SRV-005', name: 'Sofa Cleaning (3 Seater)', category: 'Deep Cleaning', price: '₹899', duration: '1.5 Hours', warranty: '-', status: 'Inactive', featured: false },
];

export default function ServiceTable({ searchQuery, onRowClick }) {
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

    const filtered = mockServices.filter(s =>
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Services</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} services found</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Show</span>
                    <select className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none">
                        <option>25</option><option>50</option><option>100</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="w-8 pl-5 py-3"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                            {['Service', 'Category', 'Base Price', 'Duration', 'Warranty', 'Status', 'Featured', 'Actions'].map((col, i) => (
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
                        {filtered.map((s) => (
                            <tr key={s.id} onClick={() => onRowClick(s)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 text-sm">{s.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{s.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{s.category}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="font-semibold text-slate-900">{s.price}</span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 text-xs font-medium">{s.duration}</td>
                                <td className="px-4 py-3.5 text-slate-500 text-xs">{s.warranty}</td>
                                <td className="px-4 py-3.5">
                                    {s.status === 'Active' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                                            <XCircle className="w-3 h-3" /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={s.featured} />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === s.id && (
                                            <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit Service</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Duplicate</button>
                                                <div className="border-t border-slate-100 my-1"></div>
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
                        <p className="text-slate-500 text-sm">No services found.</p>
                    </div>
                )}
            </div>
            
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1–{filtered.length} of {filtered.length} services</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Previous</button>
                    <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</span>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
