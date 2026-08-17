'use client';
import { MoreVertical, Eye, UserPlus, Calendar as CalendarIcon, XCircle, FileDigit } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/office/ui/Badge';
import { titleCase } from '@/lib/officeApiMappers';

export default function WorkOrderRow({ wo, onClick, onEdit, onDelete }) {
    return (
        <tr onClick={onClick} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500" />
            </td>
            <td className="p-4">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800 transition-colors">
                    {wo.id}
                </span>
            </td>
            <td className="p-4">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{wo.bookingId}</span>
            </td>
            <td className="p-4">
                <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{wo.customer}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{wo.service}</div>
            </td>
            <td className="p-4 text-slate-600 dark:text-slate-400">
                {wo.assignedTo !== 'Unassigned' ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {wo.assignedTo.charAt(0)}
                        </div>
                        <span className="text-xs font-medium">{wo.assignedTo}</span>
                    </div>
                ) : (
                    <span className="text-slate-400 dark:text-slate-500 italic text-xs">Unassigned</span>
                )}
            </td>
            <td className="p-4">
                <span className={`text-xs font-medium ${wo.date.includes('Today') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}>
                    {wo.date}
                </span>
            </td>
            <td className="p-4">
                <PriorityBadge priority={titleCase(wo.priority)} />
            </td>
            <td className="p-4">
                <StatusBadge status={titleCase(wo.status)} />
            </td>
            <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                {wo.createdDate}
            </td>
            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group/action">
                    <MoreVertical className="w-4 h-4" />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-20 py-1">
                        <div onClick={onClick} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Eye className="w-4 h-4 text-slate-400" /> View Details</div>
                        <div onClick={onEdit} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><UserPlus className="w-4 h-4 text-slate-400" /> Reassign Partner</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><CalendarIcon className="w-4 h-4 text-slate-400" /> Reschedule</div>
                        
                        {(wo.status === 'completed' || wo.status === 'invoiced' || wo.status === 'paid' || wo.status === 'closed') && (
                            <>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><FileDigit className="w-4 h-4 text-slate-400" /> Generate Invoice</div>
                            </>
                        )}
                        
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <div onClick={onDelete} className="px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"><XCircle className="w-4 h-4" /> Cancel Work Order</div>
                    </div>
                </button>
            </td>
        </tr>
    );
}
