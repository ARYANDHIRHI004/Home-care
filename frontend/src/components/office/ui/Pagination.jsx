'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
    totalItems = 124, 
    itemsPerPage = 10, 
    currentPage = 1,
    onPageChange = () => {},
    onItemsPerPageChange = () => {}
}) {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Rows per page:</span>
                <select 
                    className="bg-transparent font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400 mr-4">
                    {startIndex}-{endIndex} of {totalItems}
                </span>
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                    disabled={endIndex >= totalItems}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
