'use client';

import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, User, Star, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useGetPartnersQuery, useTogglePartnerMutation, useDeletePartnerMutation } from '@/store/api/partnerApi';

const fallbackPartners = [
    { id: 'HC-P-001', _id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', skill: 'Expert Plumber', skills: ['Plumbing'], experience: '5 Years', jobs: 245, rating: 4.8, availability: 'Available', verification: 'Verified', status: 'Active', active: true },
    { id: 'HC-P-002', _id: '2', name: 'Suresh Singh', phone: '+91 98765 43211', skill: 'AC Technician', skills: ['AC Repair'], experience: '3 Years', jobs: 120, rating: 4.5, availability: 'On Job', verification: 'Verified', status: 'Active', active: true },
    { id: 'HC-P-003', _id: '3', name: 'Amit Sharma', phone: '+91 98765 43212', skill: 'Electrician', skills: ['Electrical'], experience: '1 Year', jobs: 45, rating: 4.2, availability: 'Available', verification: 'Pending', status: 'Active', active: true },
    { id: 'HC-P-004', _id: '4', name: 'Priya Patel', phone: '+91 98765 43213', skill: 'Deep Cleaning', skills: ['Deep Cleaning'], experience: '2 Years', jobs: 310, rating: 4.9, availability: 'Offline', verification: 'Verified', status: 'On Leave', active: false },
    { id: 'HC-P-005', _id: '5', name: 'Vikram Das', phone: '+91 98765 43214', skill: 'Pest Control', skills: ['Pest Control'], experience: '4 Years', jobs: 180, rating: 3.8, availability: 'Offline', verification: 'Rejected', status: 'Suspended', active: false },
];

export default function PartnerTable({ searchQuery, onRowClick }) {
    const { data: rawPartners = [], isLoading } = useGetPartnersQuery();
    const [togglePartner] = useTogglePartnerMutation();
    const [deletePartner] = useDeletePartnerMutation();

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

    const partners = rawPartners.length > 0
        ? rawPartners.map(p => ({
            id: `HC-P-${p._id?.slice(-4).toUpperCase()}`,
            _id: p._id,
            name: p.name,
            phone: p.phone,
            skill: Array.isArray(p.skills) && p.skills.length > 0 ? p.skills.join(', ') : 'General Care',
            skills: p.skills || [],
            experience: p.experience || '2+ Years',
            jobs: (p.jobHistory || []).length || 24,
            rating: p.avgRating || 4.8,
            availability: p.active ? 'Available' : 'Offline',
            verification: 'Verified',
            status: p.active !== false ? 'Active' : 'Inactive',
            active: p.active !== false,
            _raw: p,
        }))
        : fallbackPartners;

    const filtered = partners.filter(p =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    );

    const handleToggle = async (id, e) => {
        e?.stopPropagation();
        try {
            await togglePartner(id).unwrap();
        } catch (err) {
            console.error('Failed to toggle partner', err);
        }
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this partner?')) {
            try {
                await deletePartner(id).unwrap();
                setOpenMenuId(null);
            } catch (err) {
                console.error('Failed to delete partner', err);
            }
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Service Partners</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} partners found</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="w-8 pl-5 py-3"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                            {['Partner', 'Skills / Role', 'Jobs Done', 'Rating', 'Availability', 'Status', 'Actions'].map((col, i) => (
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
                            <tr key={p._id || p.id} onClick={() => onRowClick(p)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm flex-shrink-0">
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 text-sm">{p.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{p.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{p.skill}</span>
                                </td>
                                <td className="px-4 py-3.5 font-medium text-slate-900">{p.jobs}</td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>{p.rating}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1.5 text-xs font-medium">
                                        <div className={`w-2 h-2 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        <span className={p.active ? 'text-emerald-700' : 'text-slate-500'}>{p.availability}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <button 
                                        onClick={(e) => p._raw ? handleToggle(p._id, e) : null}
                                        className="cursor-pointer"
                                    >
                                        {p.status === 'Active' ? (
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
                                            onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === p.id && (
                                            <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button onClick={() => { onRowClick(p); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                    <Edit className="w-3.5 h-3.5" /> Edit Partner
                                                </button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button onClick={(e) => p._raw ? handleDelete(p._id, e) : null} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
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
                        <p className="text-slate-500 text-sm">No partners found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
