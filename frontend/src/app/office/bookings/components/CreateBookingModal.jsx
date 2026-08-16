'use client';
import { useMemo, useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useGetEstimatesQuery, useConvertEstimateToBookingMutation } from '@/store/api/estimateApi';

/**
 * Deliberately "select an Approved Estimate," not "pick any customer + any
 * service" — a Booking is only ever supposed to come from an estimate the
 * customer has actually agreed a price on (see convertToBooking on the
 * backend, the only code path that creates a Booking). A free customer/service
 * picker here would let staff skip that price-agreement step entirely, the
 * same problem this project already fixed once on the Estimates page.
 * Mirrors CreateWorkOrderModal's "select one thing → auto-load its details"
 * pattern one level up the chain.
 */
export default function CreateBookingModal({ isOpen, onClose }) {
    const [estimateId, setEstimateId] = useState('');
    const [convertEstimateToBooking, { isLoading: isConverting, error: convertError }] = useConvertEstimateToBookingMutation();

    const { data: estimateData, isLoading: estimatesLoading, isError: estimatesError } = useGetEstimatesQuery('approvalStatus=approved', { skip: !isOpen });

    // Only Approved, not-yet-converted estimates can become a booking — once
    // converted, status flips to "Converted" and it drops out of this list.
    const estimates = useMemo(
        () => (Array.isArray(estimateData) ? estimateData : []).filter((e) => e.status === 'Approved' && !e.bookingId),
        [estimateData]
    );

    const selected = estimates.find((e) => e._id === estimateId);

    const handleClose = () => {
        setEstimateId('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!estimateId) return;
        try {
            await convertEstimateToBooking(estimateId).unwrap();
            handleClose();
        } catch {
            // error surfaced below the select via convertError
        }
    };

    let emptyLabel = 'Select Approved Estimate';
    if (estimatesLoading) emptyLabel = 'Loading approved estimates…';
    else if (estimatesError) emptyLabel = 'Failed to load estimates — try again';
    else if (estimates.length === 0) emptyLabel = 'No approved estimates yet';

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} title="Create Booking from Estimate" maxWidth="max-w-2xl">
            <div className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Approved Estimate *</label>
                        <select
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            value={estimateId}
                            onChange={(e) => setEstimateId(e.target.value)}
                            disabled={estimatesLoading || estimatesError}
                        >
                            <option value="">{emptyLabel}</option>
                            {estimates.map((e) => (
                                <option key={e._id} value={e._id}>
                                    {e.estimateNumber || e._id} — {e.customerName || 'Unknown'} · ₹{Number(e.total || 0).toLocaleString('en-IN')}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Only estimates the customer has approved can become a booking — the price is agreed before the job is, never after.
                        </p>
                        {estimatesError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Could not load estimates. Check your connection and try again.</p>
                        )}
                    </div>

                    {/* Read-only auto-populated summary, same convention as CreateWorkOrderModal */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border transition-colors ${selected ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700' : 'bg-slate-50/20 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 opacity-50 pointer-events-none'}`}>
                        <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Customer</label>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selected?.customerName || '--'}</div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Phone</label>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selected?.phone || '--'}</div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Service</label>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selected?.serviceName || selected?.lineItems?.[0]?.name || '--'}</div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Approved Amount</label>
                            <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selected ? `₹${Number(selected.total || 0).toLocaleString('en-IN')}` : '--'}</div>
                        </div>
                    </div>

                    {convertError && (
                        <p className="text-sm text-rose-600 dark:text-rose-400">
                            {convertError.data?.message || 'Could not create the booking. Please try again.'}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!estimateId || isConverting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isConverting ? 'Creating…' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
