'use client';
import { useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useUpdateWorkOrderStatusMutation } from '@/store/api/workOrderApi';

// Mirrors STATUS_TRANSITIONS in backend/src/controllers/work-order.controller.js.
// Only the states below are ever offered here — the backend re-validates the
// transition server-side too, since a direct API call could still bypass this.
const STATUS_TRANSITIONS = {
    open: ['assigned'],
    assigned: ['accepted', 'declined'],
    accepted: ['on_route'],
    on_route: ['in_progress'],
    in_progress: ['completed'],
    completed: ['invoiced'],
    invoiced: ['paid'],
    declined: ['assigned'],
    paid: [],
    closed: [],
    estimate_sent: [],
    approved: [],
};

const STATUS_LABELS = {
    assigned: 'Assigned',
    accepted: 'Accepted',
    declined: 'Declined',
    on_route: 'On Route',
    in_progress: 'In Progress',
    completed: 'Completed',
    invoiced: 'Invoiced',
    paid: 'Paid',
};

const DECLINE_REASONS = [
    'Partner unavailable',
    'Outside service area',
    'Job scope mismatch',
    'Customer unreachable',
    'Other',
];

export default function UpdateWorkOrderStatusModal({ isOpen, onClose, workOrder }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [declineReason, setDeclineReason] = useState('');
    const [updateStatus, { isLoading, error }] = useUpdateWorkOrderStatusMutation();

    if (!isOpen || !workOrder) return null;

    const currentStatus = workOrder._raw?.status || workOrder.status || 'open';
    const nextOptions = STATUS_TRANSITIONS[currentStatus] || [];

    const handleConfirm = async () => {
        if (!selectedStatus) return;
        if (selectedStatus === 'declined' && !declineReason) return;
        try {
            await updateStatus({
                id: workOrder.id,
                status: selectedStatus,
                ...(selectedStatus === 'declined' ? { declineReason } : {}),
            }).unwrap();
            setSelectedStatus('');
            setDeclineReason('');
            onClose();
        } catch {
            // error below already surfaces this
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Update Status" maxWidth="max-w-md">
            <div className="p-6 space-y-5">
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Status</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{STATUS_LABELS[currentStatus] || currentStatus}</p>
                </div>

                {nextOptions.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">This work order has no further status transitions available.</p>
                ) : (
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Move to</label>
                        <div className="grid grid-cols-2 gap-2">
                            {nextOptions.map((s) => (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => { setSelectedStatus(s); setDeclineReason(''); }}
                                    className={`px-3 py-2.5 rounded-xl text-sm border transition-colors font-medium ${
                                        selectedStatus === s
                                            ? s === 'declined'
                                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                                                : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {STATUS_LABELS[s] || s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selectedStatus === 'declined' && (
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Reason for decline</label>
                        <div className="space-y-2">
                            {DECLINE_REASONS.map((r) => (
                                <button
                                    type="button"
                                    key={r}
                                    onClick={() => setDeclineReason(r)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                                        declineReason === r
                                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 font-medium'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Declined work orders return to Assign Partner for reassignment.</p>
                    </div>
                )}

                {error && (
                    <p className="text-xs text-rose-600 dark:text-rose-400">{error.data?.message || 'Could not update the status.'}</p>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!selectedStatus || (selectedStatus === 'declined' && !declineReason) || isLoading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Updating…' : 'Confirm'}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
