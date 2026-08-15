'use client';
import { MoreVertical, Eye, Edit, UserPlus, Calendar as CalendarIcon, FileDigit, List, XCircle } from 'lucide-react';
import { StatusBadge, PaymentBadge } from '@/components/office/ui/Badge';

export default function BookingRow({ bkg, onClick, onEdit, onDelete }) {
    return (
        <tr onClick={onClick} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
            <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500" /></td>
            <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{bkg.id}</td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                        {bkg.initial}
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{bkg.customer}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{bkg.phone}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{bkg.service}</td>
            <td className="p-4">
                <div className="text-slate-900 dark:text-slate-100 font-medium">{bkg.date}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{bkg.time}</div>
            </td>
            <td className="p-4 text-slate-600 dark:text-slate-400">
                {bkg.assignedTo !== 'Unassigned' ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {bkg.assignedTo.charAt(0)}
                        </div>
                        {bkg.assignedTo}
                    </div>
                ) : (
                    <button className="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors" onClick={(e) => { e.stopPropagation(); alert('Assign Professional Modal'); }}>
                        Assign Now
                    </button>
                )}
            </td>
            <td className="p-4"><StatusBadge status={bkg.status} /></td>
            <td className="p-4"><PaymentBadge status={bkg.payment} /></td>
            <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{bkg.amount}</td>
            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group/action">
                    <MoreVertical className="w-4 h-4" />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-20 py-1">
                        <div onClick={onClick} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Eye className="w-4 h-4 text-slate-400" /> View Details</div>
                        <div onClick={onEdit} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Edit className="w-4 h-4 text-slate-400" /> Edit Booking</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><UserPlus className="w-4 h-4 text-slate-400" /> Assign Professional</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><CalendarIcon className="w-4 h-4 text-slate-400" /> Reschedule</div>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><FileDigit className="w-4 h-4 text-slate-400" /> Generate Invoice</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><List className="w-4 h-4 text-slate-400" /> Customer Timeline</div>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <div onClick={onDelete} className="px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"><XCircle className="w-4 h-4" /> Cancel Booking</div>
                    </div>
                </button>
            </td>
        </tr>
    );
}
