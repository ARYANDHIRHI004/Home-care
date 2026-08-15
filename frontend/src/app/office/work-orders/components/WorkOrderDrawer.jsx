'use client';
import { X, MapPin, Phone, CheckCircle2, Paperclip, FileDigit } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/office/ui/Badge';
import Timeline from '@/components/office/ui/Timeline';

export default function WorkOrderDrawer({ isOpen, onClose, workOrder }) {
    if (!isOpen) return null;

    const timelineData = [
        { title: 'Work Completed', status: workOrder?.status === 'Completed' || workOrder?.status === 'Closed' ? 'done' : 'pending', date: 'Oct 25, 12:30 PM', actor: workOrder?.assignedTo },
        { title: 'Work Started', status: ['Work Started', 'Completed', 'Closed'].includes(workOrder?.status) ? 'done' : 'pending', date: 'Oct 25, 10:15 AM', actor: workOrder?.assignedTo },
        { title: 'On Route to Location', status: ['On Route', 'Work Started', 'Completed', 'Closed'].includes(workOrder?.status) ? 'done' : 'pending', date: 'Oct 25, 09:45 AM', actor: workOrder?.assignedTo },
        { title: 'Work Order Accepted', status: ['Accepted', 'On Route', 'Work Started', 'Completed', 'Closed'].includes(workOrder?.status) ? 'done' : 'pending', date: 'Oct 24, 08:30 PM', actor: workOrder?.assignedTo },
        { title: 'Partner Assigned', status: workOrder?.assignedTo !== 'Unassigned' ? 'done' : 'pending', date: 'Oct 24, 08:00 PM', actor: 'Admin' },
        { title: 'Work Order Created', status: 'done', date: 'Oct 24, 07:45 PM', actor: 'System' },
    ].reverse();

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0 transition-colors">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">{workOrder?.id}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Ref: {workOrder?.bookingId}</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Work Order Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                    
                    {/* Status & Priority Overview */}
                    <div className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Status</div>
                            <StatusBadge status={workOrder?.status || 'Assigned'} />
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Priority</div>
                            <PriorityBadge priority={workOrder?.priority || 'Normal'} />
                        </div>
                    </div>

                    {/* General Information */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Customer Details</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{workOrder?.customer}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> +91 98765 43210
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Service Address</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">124, Shanti Nagar, Mumbai</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Job Information</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Service Required</div>
                                <div className="text-sm font-bold text-blue-700 dark:text-blue-400">{workOrder?.service}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Scheduled For</div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{workOrder?.date}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Est. Duration</div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-200">2 Hours</div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mt-2">
                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Internal Notes:</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Bring extra vacuum bags. Customer is very particular about dust.</p>
                            </div>
                        </div>
                    </div>

                    {/* Partner Details */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Assignment</h4>
                        {workOrder?.assignedTo !== 'Unassigned' ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                    {workOrder?.assignedTo.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{workOrder?.assignedTo}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Field Professional</div>
                                </div>
                                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No professional assigned yet.</p>
                                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full">
                                    Assign Partner
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Execution Timeline</h4>
                        <Timeline items={timelineData} />
                    </div>

                    {/* Completion Report (Only if completed) */}
                    {(workOrder?.status === 'Completed' || workOrder?.status === 'Closed') && (
                        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-5 shadow-sm transition-colors">
                            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-4 uppercase tracking-wider border-b border-emerald-100 dark:border-emerald-900/30 pb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Completion Report
                            </h4>
                            <p className="text-sm text-emerald-800 dark:text-emerald-300 mb-4">Job completed successfully. Customer was satisfied with the deep cleaning.</p>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <Paperclip className="w-3.5 h-3.5" /> before_after.jpg
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 flex gap-3 transition-colors">
                    <button className="flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-center">
                        Edit
                    </button>
                    {(workOrder?.status === 'Completed' || workOrder?.status === 'Closed') ? (
                        <button className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <FileDigit className="w-4 h-4" /> Generate Invoice
                        </button>
                    ) : (
                        <button className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm">
                            Update Status
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
