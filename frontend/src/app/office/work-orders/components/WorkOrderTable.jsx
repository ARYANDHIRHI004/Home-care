'use client';
import { Briefcase } from 'lucide-react';
import WorkOrderRow from './WorkOrderRow';
import Pagination from '@/components/office/ui/Pagination';

export default function WorkOrderTable({ workOrders, onRowClick, onEdit, onDelete, currentPage, itemsPerPage, onPageChange, onItemsPerPageChange }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                            <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500" /></th>
                            <th className="p-4">WO ID</th>
                            <th className="p-4">Booking ID</th>
                            <th className="p-4">Customer / Service</th>
                            <th className="p-4">Assigned Partner</th>
                            <th className="p-4">Scheduled</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Created</th>
                            <th className="p-4 w-12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {workOrders.length > 0 ? (
                            workOrders.map((wo) => (
                                <WorkOrderRow 
                                    key={wo.id} 
                                    wo={wo} 
                                    onClick={() => onRowClick(wo)} 
                                    onEdit={() => onEdit(wo)} 
                                    onDelete={() => onDelete(wo)} 
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                                            <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">No work orders found</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">Generate your first work order from a confirmed booking.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {workOrders.length > 0 && (
                <Pagination 
                    totalItems={100}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    onItemsPerPageChange={onItemsPerPageChange}
                />
            )}
        </div>
    );
}
