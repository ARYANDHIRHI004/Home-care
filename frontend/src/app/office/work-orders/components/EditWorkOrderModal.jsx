'use client';
import { useEffect, useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useGetEnumsQuery } from '@/store/api/configApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import { useUpdateWorkOrderStatusMutation, useAssignWorkOrderPartnerMutation } from '@/store/api/workOrderApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function EditWorkOrderModal({ isOpen, onClose, workOrder }) {
    const { data: enums = {} } = useGetEnumsQuery();
    const { data: partnerData = [] } = useGetPartnersQuery(undefined, { skip: !isOpen });
    const [updateStatus, { isLoading: isSavingStatus, error: statusError }] = useUpdateWorkOrderStatusMutation();
    const [assignPartner, { isLoading: isSavingPartner, error: partnerError }] = useAssignWorkOrderPartnerMutation();

    const [status, setStatus] = useState('');
    const [partnerId, setPartnerId] = useState('');

    useEffect(() => {
        if (!workOrder) return;
        setStatus(workOrder._raw?.status || workOrder.status || '');
        setPartnerId(workOrder._raw?.assignedPartnerId?._id || '');
    }, [workOrder]);

    if (!workOrder) return null;

    const partners = Array.isArray(partnerData) ? partnerData.filter((p) => p.isActive !== false) : [];
    const isSaving = isSavingStatus || isSavingPartner;

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const originalPartnerId = workOrder._raw?.assignedPartnerId?._id || '';
            const originalStatus = workOrder._raw?.status || workOrder.status || '';
            if (partnerId !== originalPartnerId) {
                await assignPartner({ id: workOrder.id, assignedPartnerId: partnerId || null }).unwrap();
            }
            // assignPartner already flips status to "assigned" on the backend —
            // only send an explicit status change if the user picked something
            // different from what assigning a partner would already produce.
            if (status !== originalStatus && !(partnerId !== originalPartnerId && status === 'assigned')) {
                await updateStatus({ id: workOrder.id, status }).unwrap();
            }
            onClose();
        } catch {
            // statusError/partnerError below already surface this
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Edit Work Order ${workOrder.displayId || workOrder.id}`} maxWidth="max-w-xl">
            <div className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Partner</label>
                            <select
                                value={partnerId}
                                onChange={(e) => setPartnerId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Unassigned</option>
                                {partners.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                {(enums.workOrder?.status || []).map(s => (
                                    <option key={s} value={s}>{formatEnum(s)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {(statusError || partnerError) && (
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                            {statusError?.data?.message || partnerError?.data?.message || 'Could not save changes.'}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
