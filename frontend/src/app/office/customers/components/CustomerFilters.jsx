import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function CustomerFilters() {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const filterOptions = [
        { label: 'City', options: ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
        { label: 'Service Category', options: ['All Services', 'Cleaning', 'Plumbing', 'Electrical', 'Painting'] },
        { label: 'Customer Status', options: ['All Statuses', 'Active', 'Inactive', 'Blocked', 'VIP'] },
        { label: 'Registration Date', options: ['Any Time', 'Last 7 Days', 'Last 30 Days', 'This Year'] },
        { label: 'Booking Count', options: ['Any', '0', '1-5', '6-10', '10+'] },
        { label: 'Rating', options: ['Any', '5 Stars', '4+ Stars', '3+ Stars', 'Below 3'] },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                        placeholder="Search customer by name, phone, email, or ID..."
                    />
                </div>

                {/* Mobile Filter Toggle */}
                <div className="flex items-center gap-3 lg:hidden">
                    <button 
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className="flex items-center justify-center w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Desktop Filters / Expanded Mobile Filters */}
                <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:flex flex-col lg:flex-row items-start lg:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:flex gap-3 w-full lg:w-auto">
                        {filterOptions.slice(0, 3).map((filter, index) => (
                            <select 
                                key={index}
                                className="block w-full lg:w-36 pl-3 pr-8 py-2 text-sm border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white shadow-sm border"
                            >
                                {filter.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                    
                    <button className="flex items-center px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors whitespace-nowrap mt-2 lg:mt-0">
                        <Filter className="w-4 h-4 mr-2" />
                        More Filters
                    </button>
                    
                    <button className="flex items-center px-3 py-2 text-sm text-rose-500 hover:text-rose-700 transition-colors whitespace-nowrap lg:ml-2">
                        <X className="w-4 h-4 mr-1" />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
