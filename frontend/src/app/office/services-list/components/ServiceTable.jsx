'use client';

import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, XCircle, Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useGetServicesQuery, useToggleServiceMutation, useDeleteServiceMutation } from '@/store/api/serviceApi';

const fallbackServices = [
    { id: 'SRV-001', _id: '1', name: 'Deep Home Cleaning (3 BHK)', category: 'Deep Cleaning', price: '₹4,499', basePrice: 4499, duration: '5-6 Hours', warranty: '30 Days', status: 'Active', active: true, featured: true },
    { id: 'SRV-002', _id: '2', name: 'Split AC Servicing', category: 'AC Repair', price: '₹599', basePrice: 599, duration: '45 Mins', warranty: '30 Days', status: 'Active', active: true, featured: true },
    { id: 'SRV-003', _id: '3', name: 'Wash Basin Pipe Repair', category: 'Plumbing', price: '₹149', basePrice: 149, duration: '30 Mins', warranty: '-', status: 'Active', active: true, featured: false },
    { id: 'SRV-004', _id: '4', name: 'Termite Control (2 BHK)', category: 'Pest Control', price: '₹3,199', basePrice: 3199, duration: '2 Hours', warranty: '1 Year', status: 'Active', active: true, featured: false },
    { id: 'SRV-005', _id: '5', name: 'Sofa Cleaning (3 Seater)', category: 'Deep Cleaning', price: '₹899', basePrice: 899, duration: '1.5 Hours', warranty: '-', status: 'Inactive', active: false, featured: false },
];

export default function ServiceTable({ searchQuery, onRowClick }) {
    const { data: rawServices = [], isLoading } = useGetServicesQuery();
    const [toggleService] = useToggleServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

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

    const services = rawServices.length > 0
        ? rawServices.map(s => ({
            id: `SRV-${s._id?.slice(-4).toUpperCase()}`,
            _id: s._id,
            name: s.name,
            category: s.categoryId?.name || (typeof s.categoryId === 'string' ? s.categoryId : 'General'),
            categoryId: s.categoryId?._id || s.categoryId,
            price: `₹${(s.basePrice || 0).toLocaleString()}`,
            basePrice: s.basePrice || 0,
            duration: s.duration || '1-2 Hours',
            warranty: s.warranty || '30 Days',
            status: s.active !== false ? 'Active' : 'Inactive',
            active: s.active !== false,
            featured: !!s.featured,
            description: s.description || '',
            _raw: s,
        }))
        : fallbackServices;

    const filtered = services.filter(s =>
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggle = async (id, e) => {
        e?.stopPropagation();
        try {
            await toggleService(id).unwrap();
        } catch (err) {
            console.error('Failed to toggle service status', err);
        }
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteService(id).unwrap();
                setOpenMenuId(null);
            } catch (err) {
                console.error('Failed to delete service', err);
            }
        }
    };

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
                            {['Service', 'Category', 'Base Price', 'Duration', 'Warranty', 'Status', 'Actions'].map((col, i) => (
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
                            <tr key={s._id || s.id} onClick={() => onRowClick(s)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
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
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <button 
                                        onClick={(e) => s._raw ? handleToggle(s._id, e) : null}
                                        className="cursor-pointer"
                                    >
                                        {s.status === 'Active' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                                                <CheckCircle2 className="w-3 h-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                                <XCircle className="w-3 h-3" /> Inactive
                                            </span>
                                        )}
                                    </button>
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
                                                <button onClick={() => { onRowClick(s); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                    <Edit className="w-3.5 h-3.5" /> Edit Service
                                                </button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button onClick={(e) => s._raw ? handleDelete(s._id, e) : null} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
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
