'use client';
import { Clock, MoreVertical, Eye, Edit, Phone, MessageCircle, FileText, Calendar, ArrowRightLeft, Trash2 } from 'lucide-react';
import { PriorityBadge, StatusBadge, SourceBadge } from '@/components/office/ui/Badge';

export default function EnquiryRow({ enq, onClick, onEdit, onDelete }) {
    return (
        <tr onClick={onClick} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
            <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500" /></td>
            <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{enq.id}</td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                        {enq.initial}
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{enq.customer}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{enq.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 text-slate-600 dark:text-slate-400">{enq.phone}</td>
            <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{enq.service}</td>
            <td className="p-4"><SourceBadge source={enq.source} /></td>
            <td className="p-4"><PriorityBadge priority={enq.priority} /></td>
            <td className="p-4 text-slate-600 dark:text-slate-400">
                {enq.assignedTo !== 'Unassigned' ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {enq.assignedTo.charAt(0)}
                        </div>
                        {enq.assignedTo}
                    </div>
                ) : (
                    <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                )}
            </td>
            <td className="p-4 text-slate-600 dark:text-slate-400 text-xs">
                {enq.nextFollowUp !== 'None' ? (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        {enq.nextFollowUp}
                    </div>
                ) : (
                    <span className="text-slate-400 dark:text-slate-500">None</span>
                )}
            </td>
            <td className="p-4"><StatusBadge status={enq.status} /></td>
            <td className="p-4 text-slate-500 dark:text-slate-400">{enq.date}</td>
            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group/action">
                    <MoreVertical className="w-4 h-4" />
                    {/* Action Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-10 py-1">
                        <div onClick={onClick} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Eye className="w-4 h-4 text-slate-400" /> View Details</div>
                        <div onClick={onEdit} className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Edit className="w-4 h-4 text-slate-400" /> Edit Enquiry</div>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Phone className="w-4 h-4 text-blue-500" /> Call</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp</div>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><FileText className="w-4 h-4 text-slate-400" /> Create Estimate</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><Calendar className="w-4 h-4 text-slate-400" /> Schedule Follow-up</div>
                        <div className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"><ArrowRightLeft className="w-4 h-4 text-emerald-600" /> Convert to Booking</div>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <div onClick={onDelete} className="px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"><Trash2 className="w-4 h-4" /> Delete</div>
                    </div>
                </button>
            </td>
        </tr>
    );
}
