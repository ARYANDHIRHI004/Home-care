import { Search, Filter, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function PaymentFilters({ searchQuery, onSearchChange }) {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const filterOptions = [
        { label: 'Payment Status', options: ['All Statuses', 'Verified', 'Pending', 'Failed'] },
        { label: 'Payment Method', options: ['All Methods', 'Cash', 'UPI', 'Razorpay'] },
        { label: 'Date Range', options: ['Any Time', 'Today', 'This Week', 'This Month', 'Last Month', 'Custom Range'] },
        { label: 'Collected By', options: ['Anyone', 'Admin', 'Partner', 'Auto-Debit'] },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 sticky top-20 z-10 min-w-0">
            {/* Row 1: Search */}
            <div className="flex gap-3 min-w-0">
                <div className="relative flex-1 min-w-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="block w-full min-w-0 pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        placeholder="Search by Customer, Booking ID, or Invoice Number..."
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

            {/* Row 2: Filters */}
            <div className={`${isFiltersOpen ? 'grid' : 'hidden'} lg:grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3`}>
                {filterOptions.map((filter, index) => (
                    <div key={index}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{filter.label}</label>
                        <select
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            {filter.options.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* Row 3: Advanced & Clear */}
            {isFiltersOpen && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                        <Filter className="w-3.5 h-3.5" />
                        More Filters
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors ml-2 border border-transparent">
                        <X className="w-3.5 h-3.5" />
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
}
