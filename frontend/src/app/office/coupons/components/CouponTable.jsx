import { MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2, Clock, PauseCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const mockCoupons = [
    { id: 'CPN-001', code: 'DIWALI20', campaign: 'Diwali Festival Bonanza', discount: '20% OFF', type: 'percentage', services: 'All Services', usage: '450 / 1000', validity: '10 Nov - 20 Nov', status: 'Active', createdBy: 'Admin' },
    { id: 'CPN-002', code: 'FIRST500', campaign: 'New User Acquisition', discount: '₹500 OFF', type: 'flat', services: 'Deep Cleaning', usage: '12 / ∞', validity: 'Until Cancelled', status: 'Active', createdBy: 'Marketing' },
    { id: 'CPN-003', code: 'FREEVISIT', campaign: 'Weekend Plumbing Push', discount: 'Free Visit', type: 'free_visit', services: 'Plumbing', usage: '0 / 50', validity: 'Starts 25 Nov', status: 'Scheduled', createdBy: 'Admin' },
    { id: 'CPN-004', code: 'WINTERCLEAN', campaign: 'Winter Prep', discount: '15% OFF', type: 'percentage', services: 'All Services', usage: '100 / 100', validity: '1 Nov - 10 Nov', status: 'Expired', createdBy: 'Marketing' },
    { id: 'CPN-005', code: 'SORRY100', campaign: 'Customer Retention', discount: '₹100 OFF', type: 'flat', services: 'Any Service', usage: '5 / 20', validity: 'Until Cancelled', status: 'Paused', createdBy: 'Support' },
];

export default function CouponTable({ searchQuery, onRowClick }) {
    const [sortCol, setSortCol] = useState('code');
    const [sortDir, setSortDir] = useState('asc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const filtered = mockCoupons.filter(c =>
        !searchQuery ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Active</span>;
            case 'Scheduled': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700"><Clock className="w-3 h-3" /> Scheduled</span>;
            case 'Paused': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700"><PauseCircle className="w-3 h-3" /> Paused</span>;
            case 'Expired': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600"><XCircle className="w-3 h-3" /> Expired</span>;
            default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">{status}</span>;
        }
    };

    const getDiscountBadge = (discount, type) => {
        let color = 'bg-blue-100 text-blue-700 border-blue-200';
        if (type === 'percentage') color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (type === 'free_visit') color = 'bg-purple-100 text-purple-700 border-purple-200';
        
        return <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold border ${color}`}>{discount}</span>;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">All Coupons</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} coupons found</p>
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
                            {['Coupon Code', 'Discount', 'Services', 'Usage', 'Validity', 'Status', 'Created By', 'Actions'].map((col, i) => (
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
                                    <div className="font-bold text-slate-900 font-mono text-sm tracking-wide">{c.code}</div>
                                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{c.campaign}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {getDiscountBadge(c.discount, c.type)}
                                </td>
                                <td className="px-4 py-3.5 text-xs font-medium text-slate-600">
                                    {c.services}
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                                        {c.usage}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                                    {c.validity}
                                </td>
                                <td className="px-4 py-3.5">
                                    {getStatusBadge(c.status)}
                                </td>
                                <td className="px-4 py-3.5 text-xs text-slate-500">
                                    {c.createdBy}
                                </td>
                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === c.id && (
                                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit Coupon</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Analytics</button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Duplicate</button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                {c.status === 'Active' ? (
                                                    <button className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">Pause Coupon</button>
                                                ) : (
                                                    <button className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50">Activate Coupon</button>
                                                )}
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Archive</button>
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
                            <Ticket className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">No Coupons Found</h3>
                        <p className="text-slate-500 text-xs mb-4">Create promotional coupons to increase bookings.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            + Create Coupon
                        </button>
                    </div>
                )}
            </div>
            
            {filtered.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1–{filtered.length} of {filtered.length} coupons</span>
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
