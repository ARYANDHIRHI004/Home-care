import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

const mockPricing = [
    { id: 'PRC-101', service: 'Deep Home Cleaning (3 BHK)', category: 'Deep Cleaning', base: 4000, visit: 0, labour: 800, gst: 18, emergency: 500, weekend: 200, status: 'Active' },
    { id: 'PRC-102', service: 'Split AC Servicing', category: 'AC Repair', base: 400, visit: 150, labour: 200, gst: 18, emergency: 200, weekend: 100, status: 'Scheduled' },
    { id: 'PRC-103', service: 'Wash Basin Pipe Repair', category: 'Plumbing', base: 0, visit: 149, labour: 150, gst: 18, emergency: 100, weekend: 50, status: 'Active' },
    { id: 'PRC-104', service: 'Termite Control (2 BHK)', category: 'Pest Control', base: 2500, visit: 0, labour: 500, gst: 18, emergency: 0, weekend: 300, status: 'Active' },
];

export default function PricingTable({ searchQuery, onRowClick }) {
    const [sortCol, setSortCol] = useState('service');
    const [sortDir, setSortDir] = useState('asc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = mockPricing.filter(p =>
        !searchQuery ||
        p.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Pricing Configurations</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} configurations found</p>
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
                            {['Service', 'Category', 'Base Price', 'Visit Charge', 'Labour', 'GST', 'Emergency', 'Weekend', 'Status', 'Actions'].map((col, i) => (
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
                                    <div className="font-medium text-slate-900 text-sm">{p.service}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{p.category}</span>
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-slate-900">₹{p.base}</td>
                                <td className="px-4 py-3.5 text-slate-600">₹{p.visit}</td>
                                <td className="px-4 py-3.5 text-slate-600">₹{p.labour}</td>
                                <td className="px-4 py-3.5 text-slate-500">{p.gst}%</td>
                                <td className="px-4 py-3.5 text-rose-600 font-medium">+₹{p.emergency}</td>
                                <td className="px-4 py-3.5 text-amber-600 font-medium">+₹{p.weekend}</td>
                                <td className="px-4 py-3.5">
                                    {p.status === 'Active' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                                            <Clock className="w-3 h-3" /> Scheduled
                                        </span>
                                    )}
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
                                            <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit Pricing</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View History</button>
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
                        <p className="text-slate-500 text-sm">No pricing configurations found.</p>
                    </div>
                )}
            </div>
            
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1–{filtered.length} of {filtered.length} prices</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Previous</button>
                    <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</span>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
