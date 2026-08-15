'use client';

import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { useGetServicesQuery } from '@/store/api/serviceApi';

const fallbackPricing = [
    { id: 'PRC-101', service: 'Deep Home Cleaning (3 BHK)', category: 'Deep Cleaning', base: 4000, visit: 0, labour: 800, gst: 18, emergency: 500, weekend: 200, status: 'Active' },
    { id: 'PRC-102', service: 'Split AC Servicing', category: 'AC Repair', base: 400, visit: 150, labour: 200, gst: 18, emergency: 200, weekend: 100, status: 'Active' },
    { id: 'PRC-103', service: 'Wash Basin Pipe Repair', category: 'Plumbing', base: 0, visit: 149, labour: 150, gst: 18, emergency: 100, weekend: 50, status: 'Active' },
    { id: 'PRC-104', service: 'Termite Control (2 BHK)', category: 'Pest Control', base: 2500, visit: 0, labour: 500, gst: 18, emergency: 0, weekend: 300, status: 'Active' },
];

export default function PricingTable({ searchQuery, onRowClick }) {
    const { data: rawServices = [], isLoading } = useGetServicesQuery();
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

    const pricing = rawServices.length > 0
        ? rawServices.map(s => ({
            id: `PRC-${s._id?.slice(-4).toUpperCase()}`,
            _id: s._id,
            service: s.name,
            category: s.categoryId?.name || 'General',
            base: s.basePrice || 0,
            visit: s.visitCharges || 0,
            labour: Math.round((s.basePrice || 0) * 0.2),
            gst: 18,
            emergency: 200,
            weekend: 100,
            status: s.active !== false ? 'Active' : 'Inactive',
            _raw: s,
        }))
        : fallbackPricing;

    const filtered = pricing.filter(p =>
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
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="w-8 pl-5 py-3"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                            {['Service', 'Category', 'Base Price', 'Visit Charge', 'Estimated Labour', 'GST Rate', 'Status', 'Actions'].map((col, i) => (
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
                            <tr key={p._id || p.id} onClick={() => onRowClick?.(p)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-medium text-slate-900">{p.service}</div>
                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{p.id}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{p.category}</span>
                                </td>
                                <td className="px-4 py-3.5 font-bold text-slate-900">₹{p.base.toLocaleString()}</td>
                                <td className="px-4 py-3.5 text-slate-600">₹{p.visit.toLocaleString()}</td>
                                <td className="px-4 py-3.5 text-slate-600">₹{p.labour.toLocaleString()}</td>
                                <td className="px-4 py-3.5 text-slate-500">{p.gst}%</td>
                                <td className="px-4 py-3.5">
                                    {p.status === 'Active' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                                            Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => onRowClick?.(p)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Edit Rates
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
