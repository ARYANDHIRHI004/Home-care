import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function ComplaintFilters({ searchQuery, onSearchChange, statusFilter, onStatusChange, priorityFilter, onPriorityChange }) {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Matches Ticket.status / Ticket.priority's real enums (see ticket.model.js).
    // 'Investigating' / 'Waiting Customer' / 'Rejected' / 'Critical' / 'Medium'
    // were never real values — every complaint fell through to the default
    // option and the filter did nothing.
    const statusOptions = ['All Statuses', 'open', 'estimate_sent', 'approved', 'assigned', 'in_progress', 'completed', 'closed'];
    const priorityOptions = ['All Priorities', 'low', 'normal', 'high'];

    const hasActiveFilters = searchQuery || (statusFilter && statusFilter !== 'All Statuses') || (priorityFilter && priorityFilter !== 'All Priorities');

    const handleClear = () => {
        onSearchChange('');
        onStatusChange('All Statuses');
        onPriorityChange('All Priorities');
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 sticky top-20 z-10 min-w-0">
            <div className="flex gap-3 min-w-0">
                <div className="relative flex-1 min-w-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SlidersHorizontal className="h-4 w-4 text-slate-400 opacity-0" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="block w-full min-w-0 pl-3 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        placeholder="Search complaint ID, customer name, booking ID..."
                    />
                </div>
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        isFiltersOpen
                            ? 'border-blue-300 bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                </button>
            </div>

            <div className={`${isFiltersOpen ? 'grid' : 'hidden'} lg:grid grid-cols-2 gap-2 mt-3`}>
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer capitalize"
                >
                    {statusOptions.map((opt, i) => (
                        <option key={i} value={opt} className="capitalize">{opt === 'All Statuses' ? opt : opt.replace('_', ' ')}</option>
                    ))}
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer capitalize"
                >
                    {priorityOptions.map((opt, i) => (
                        <option key={i} value={opt} className="capitalize">{opt}</option>
                    ))}
                </select>
            </div>

            {isFiltersOpen && hasActiveFilters && (
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
}
