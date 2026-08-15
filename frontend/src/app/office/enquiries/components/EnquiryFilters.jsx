'use client';
import { Search, ChevronDown } from 'lucide-react';

export default function EnquiryFilters({ searchQuery, onSearchChange }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
            <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search customer, phone, enquiry ID..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {['Status', 'Priority', 'Service Category', 'Lead Source', 'Assigned Employee', 'Date Range'].map((filter) => (
                    <button key={filter} className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors">
                        {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                ))}
                <button className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                    Reset Filters
                </button>
            </div>
        </div>
    );
}
