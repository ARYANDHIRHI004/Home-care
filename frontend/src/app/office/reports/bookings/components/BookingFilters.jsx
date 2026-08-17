'use client';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const DATE_RANGES = ['Today', 'This Week', 'This Month', 'This Year', 'Custom'];

const STATUS_OPTIONS = ['All Statuses', 'active', 'upcoming', 'confirmed', 'pending_assignment', 'in_progress', 'completed', 'cancelled'];
const PAYMENT_STATUS_OPTIONS = ['Any', 'pending', 'partial', 'paid', 'under_verification'];

function toLabel(value) {
    if (value === 'All Statuses' || value === 'Any') return value;
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BookingFilters({
    activeRange, setActiveRange,
    customFrom, setCustomFrom,
    customTo, setCustomTo,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    paymentStatusFilter, setPaymentStatusFilter,
    categories = [],
}) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-2">
                    {DATE_RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => setActiveRange(r)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                                activeRange === r
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                    {activeRange === 'Custom' && (
                        <div className="flex items-center gap-2 ml-1">
                            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <span className="text-slate-400 text-xs font-medium">to</span>
                            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}
                </div>
                <div className="flex-1" />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                        showFilters ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> More Filters
                </button>
            </div>

            {showFilters && (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Booking Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{toLabel(o)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Category</label>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <option value="All Categories">All Categories</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Status</label>
                        <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{toLabel(o)}</option>)}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
