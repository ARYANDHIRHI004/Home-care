'use client';
import { CalendarIcon, User, Wrench } from 'lucide-react';
import { PriorityBadge } from '@/components/office/ui/Badge';

export default function WorkOrderCard({ wo, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800 transition-colors">
                    {wo.id}
                </span>
                <PriorityBadge priority={wo.priority} />
            </div>
            
            <div className="mb-4">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{wo.customer}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span className="truncate">{wo.service}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    {wo.date.split(',')[0]}
                </div>
                
                {wo.assignedTo !== 'Unassigned' ? (
                    <div className="flex items-center gap-1.5" title={wo.assignedTo}>
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {wo.assignedTo.charAt(0)}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded transition-colors">
                        <User className="w-3 h-3" /> Assign
                    </div>
                )}
            </div>
        </div>
    );
}
