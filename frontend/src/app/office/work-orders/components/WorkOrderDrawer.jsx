'use client';
import { X, MapPin, Phone, Mail, UserPlus, RefreshCw } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/office/ui/Badge';
import Timeline from '@/components/office/ui/Timeline';
import { titleCase } from '@/lib/officeApiMappers';

const STATUS_LABELS = {
    open: 'Open',
    estimate_sent: 'Estimate Sent',
    approved: 'Approved',
    assigned: 'Assigned',
    accepted: 'Accepted',
    on_route: 'On Route',
    in_progress: 'In Progress',
    completed: 'Completed',
    invoiced: 'Invoiced',
    paid: 'Paid',
    declined: 'Declined',
    closed: 'Closed',
};

export default function WorkOrderDrawer({ isOpen, onClose, workOrder, onAssignPartner, onUpdateStatus }) {
    if (!isOpen || !workOrder) return null;

    const raw = workOrder._raw || {};
    const status = raw.status || 'open';
    const timelineData = (raw.timeline || [])
        .slice()
        .reverse()
        .map((t) => ({
            title: STATUS_LABELS[t.status] || t.status,
            status: 'done',
            date: t.timestamp ? new Date(t.timestamp).toLocaleString() : '—',
            actor: t.byEmployeeId ? 'Staff' : 'System',
        }));

    const { name, email, phone, addresses } = raw.customerId || {};
    const enquiryAddress = raw.enquiryId?.address;
    const customerFallback = addresses && addresses.length > 0 ? addresses[0].addressText : null;
    const jobAddress = raw.address || enquiryAddress || customerFallback;
    const service = raw.enquiryId?.serviceCategory || 'N/A';
    const assignedPartner = raw.assignedPartnerId;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0 transition-colors">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">{workOrder?.displayId}</span>
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
                            <StatusBadge status={titleCase(status)} />
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Priority</div>
                            <PriorityBadge priority={titleCase(raw.priority || 'normal')} />
                        </div>
                    </div>

                    {status === 'declined' && raw.declineReason && (
                        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl p-4">
                            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wide mb-1">Decline Reason</p>
                            <p className="text-sm text-rose-800 dark:text-rose-300">{raw.declineReason}</p>
                        </div>
                    )}

                    {/* General Information */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Customer Details</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{name || workOrder.customer}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> {phone || '—'}
                                </div>
                            </div>
                            <div>
                                {email && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {email}</div>
                                )}
                                {jobAddress && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        <span className="leading-tight">{jobAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Job Information</h4>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Service Required</div>
                            <div className="text-sm font-bold text-blue-700 dark:text-blue-400">{service}</div>
                        </div>
                    </div>

                    {/* Partner Details */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Assignment</h4>
                        {assignedPartner ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                    {assignedPartner.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{assignedPartner.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Field Professional</div>
                                </div>
                                <button
                                    onClick={onAssignPartner}
                                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                                    title="Reassign Partner"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No professional assigned yet.</p>
                                <button
                                    onClick={onAssignPartner}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full flex items-center justify-center gap-2"
                                >
                                    <UserPlus className="w-4 h-4" /> Assign Partner
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Execution Timeline</h4>
                        {timelineData.length > 0 ? (
                            <Timeline items={timelineData} />
                        ) : (
                            <p className="text-sm text-slate-400 dark:text-slate-500">No status history yet.</p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 flex gap-3 transition-colors">
                    <button
                        onClick={onAssignPartner}
                        className="flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-center"
                    >
                        {assignedPartner ? 'Reassign' : 'Assign Partner'}
                    </button>
                    <button
                        onClick={onUpdateStatus}
                        className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
}
