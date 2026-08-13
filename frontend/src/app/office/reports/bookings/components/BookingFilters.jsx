'use client';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const DATE_RANGES = ['Today', 'This Week', 'This Month', 'This Year', 'Custom'];

export default function BookingFilters({ activeRange, setActiveRange }) {
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
                            <input type="date" className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <span className="text-slate-400 text-xs font-medium">to</span>
                            <input type="date" className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Booking Status', options: ['All Statuses', 'Completed', 'In Progress', 'Pending', 'Cancelled'] },
                        { label: 'Service Category', options: ['All Categories', 'Deep Cleaning', 'Pest Control', 'Painting', 'Plumbing', 'Electrical'] },
                        { label: 'Partner', options: ['All Partners', 'Suresh Kumar', 'Ravi Sharma', 'Priya Tiwari'] },
                        { label: 'City', options: ['All Cities', 'Mumbai', 'Pune', 'Nagpur'] },
                        { label: 'Source', options: ['All Sources', 'Website', 'Phone', 'WhatsApp', 'Referral'] },
                        { label: 'Payment Status', options: ['Any', 'Paid', 'Pending', 'Partial'] },
                    ].map((f) => (
                        <div key={f.label}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                            <select className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                {f.options.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
