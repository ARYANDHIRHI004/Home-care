'use client';
import { useMemo, useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import { useGetWorkOrdersQuery, useAssignWorkOrderPartnerMutation } from '@/store/api/workOrderApi';
import { Phone, Star, Briefcase } from 'lucide-react';

export default function AssignPartnerModal({ isOpen, onClose, workOrder }) {
    const [partnerId, setPartnerId] = useState('');
    const [assignPartner, { isLoading, error }] = useAssignWorkOrderPartnerMutation();

    const { data: partnerData, isLoading: partnersLoading } = useGetPartnersQuery(undefined, { skip: !isOpen });
    const { data: workOrderData } = useGetWorkOrdersQuery(undefined, { skip: !isOpen });

    // Same decision-support pattern as CreateWorkOrderModal's partner picker:
    // real rating (avgRating) and real current workload (count of that
    // partner's own active work orders), not a bare name list. ServicePartner
    // has no geo fields anywhere in the system, so there's no real distance
    // to show — showing one would mean fabricating it.
    const activeJobCounts = useMemo(() => {
        const counts = new Map();
        (Array.isArray(workOrderData) ? workOrderData : []).forEach((wo) => {
            if (!wo.assignedPartnerId) return;
            if (['completed', 'invoiced', 'paid', 'closed', 'declined'].includes(wo.status)) return;
            const pid = wo.assignedPartnerId?._id || wo.assignedPartnerId;
            counts.set(pid, (counts.get(pid) || 0) + 1);
        });
        return counts;
    }, [workOrderData]);

    const partners = useMemo(
        () =>
            (Array.isArray(partnerData) ? partnerData : [])
                .filter((p) => p.active !== false)
                .map((p) => ({
                    id: p._id,
                    name: p.name,
                    phone: p.phone,
                    rating: Number(p.avgRating || 0),
                    activeJobs: activeJobCounts.get(p._id) || 0,
                }))
                .toSorted((a, b) => b.rating - a.rating),
        [partnerData, activeJobCounts]
    );

    if (!isOpen || !workOrder) return null;

    const currentPartner = workOrder._raw?.assignedPartnerId;
    const isReassign = !!currentPartner;

    const handleConfirm = async () => {
        if (!partnerId) return;
        try {
            await assignPartner({ id: workOrder.id, assignedPartnerId: partnerId }).unwrap();
            setPartnerId('');
            onClose();
        } catch {
            // error below already surfaces this
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={isReassign ? 'Reassign Partner' : 'Assign Partner'} maxWidth="max-w-lg">
            <div className="p-6 space-y-5">
                {currentPartner && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">Currently Assigned</p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-700 dark:text-amber-400 text-sm">
                                {currentPartner.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentPartner.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {currentPartner.phone}</p>
                            </div>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">Choosing a partner below will reassign this work order and reset its status to Assigned.</p>
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        {isReassign ? 'Reassign to' : 'Assign to'}
                    </label>
                    {partnersLoading && <p className="text-xs text-slate-500 dark:text-slate-400">Loading partners…</p>}
                    <div className="max-h-72 overflow-y-auto space-y-2">
                        {partners.map((p) => (
                            <button
                                type="button"
                                key={p.id}
                                onClick={() => setPartnerId(p.id)}
                                className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-colors ${
                                    partnerId === p.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {p.rating.toFixed(1)}</span>
                                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {p.activeJobs} active job{p.activeJobs === 1 ? '' : 's'}</span>
                                    </p>
                                </div>
                                {partnerId === p.id && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Selected</span>}
                            </button>
                        ))}
                        {!partnersLoading && partners.length === 0 && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No active partners available.</p>
                        )}
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-rose-600 dark:text-rose-400">{error.data?.message || 'Could not assign the partner.'}</p>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!partnerId || isLoading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Assigning…' : isReassign ? 'Reassign' : 'Assign'}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
