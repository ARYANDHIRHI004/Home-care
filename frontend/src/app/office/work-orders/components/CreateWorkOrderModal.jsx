'use client';
import { useMemo, useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useGetBookingsQuery } from '@/store/api/bookingApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import { useCreateWorkOrderMutation, useAssignWorkOrderPartnerMutation, useGetWorkOrdersQuery } from '@/store/api/workOrderApi';
import { shortDate } from '@/lib/officeApiMappers';
import { useGetEnumsQuery } from '@/store/api/configApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function CreateWorkOrderModal({ isOpen, onClose }) {
    const [bookingId, setBookingId] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const [priority, setPriority] = useState('normal');
    const [createWorkOrder, { isLoading: isCreating, error: createError }] = useCreateWorkOrderMutation();
    const [assignPartner] = useAssignWorkOrderPartnerMutation();

    // Only confirmed / pending-assignment bookings can receive a work order —
    // completed and cancelled ones have nothing left to dispatch.
    const { data: bookingData, isLoading: bookingsLoading } = useGetBookingsQuery(undefined, { skip: !isOpen });
    const { data: partnerData, isLoading: partnersLoading } = useGetPartnersQuery(undefined, { skip: !isOpen });
    const { data: workOrderData } = useGetWorkOrdersQuery(undefined, { skip: !isOpen });
    const { data: enums = {} } = useGetEnumsQuery(undefined, { skip: !isOpen });

    const bookings = useMemo(
        () =>
            (Array.isArray(bookingData) ? bookingData : []).filter((b) =>
                ['confirmed', 'pending_assignment', 'upcoming'].includes(b.status)
            ),
        [bookingData]
    );

    // Decision support for partner assignment — a bare name dropdown gives the
    // admin no way to choose well between a dozen partners. Surfacing rating and
    // current workload turns this into an actual decision instead of a guess.
    // ServicePartner has no geo fields (no lat/lng anywhere in the system), so
    // there's no real distance to show — a prior version of this fabricated
    // `distanceKm`/`jobsToday` from fields that don't exist on the model
    // (`rating`, `isActive`) and always rendered zero/blank. `jobsToday` here
    // is computed from real open work orders currently assigned to each
    // partner instead. Sorted best-rated first.
    const activeWorkOrderCountByPartner = useMemo(() => {
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
                    rating: Number(p.avgRating || 0),
                    activeJobs: activeWorkOrderCountByPartner.get(p._id) || 0,
                }))
                .toSorted((a, b) => b.rating - a.rating),
        [partnerData, activeWorkOrderCountByPartner]
    );

    const raw = bookings.find((b) => b._id === bookingId);
    const selectedBooking = raw && {
        customer: raw.customerId?.name || raw.customerName,
        phone: raw.customerId?.phone || raw.phone,
        category: raw.category,
        address: raw.address,
        service: raw.serviceName,
        date: shortDate(raw.scheduledDate),
        time: raw.scheduledTime,
        estimate: `₹${Number(raw.amount || 0).toLocaleString('en-IN')}`,
    };
    // A WorkOrder requires enquiryId + customerId (see work-order.model.js) —
    // both only resolve if the booking's estimate is populated with its
    // source enquiry. If either is missing, this booking genuinely can't
    // become a work order yet rather than silently create a broken one.
    const derivedEnquiryId = raw?.estimateId?.enquiryId;
    const derivedCustomerId = raw?.customerId?._id || raw?.customerId;
    const canSubmit = !!(bookingId && derivedEnquiryId && derivedCustomerId);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        try {
            const workOrder = await createWorkOrder({
                enquiryId: derivedEnquiryId,
                customerId: derivedCustomerId,
                customerName: selectedBooking?.customer,
                customerPhone: selectedBooking?.phone,
                priority,
            }).unwrap();
            if (partnerId) {
                await assignPartner({ id: workOrder._id, assignedPartnerId: partnerId }).unwrap();
            }
            setBookingId('');
            setPartnerId('');
            setPriority('normal');
            onClose();
        } catch {
            // createError below the form already surfaces this
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Generate Work Order" maxWidth="max-w-4xl">
            <div className="p-6">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* SECTION 1: Booking Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">1. Booking Selection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search Booking *</label>
                                <select 
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    value={bookingId}
                                    onChange={(e) => setBookingId(e.target.value)}
                                >
                                    <option value="">
                                        {bookingsLoading
                                            ? 'Loading bookings…'
                                            : bookings.length
                                              ? 'Select Confirmed Booking'
                                              : 'No bookings awaiting a work order'}
                                    </option>
                                    {bookings.map((b) => (
                                        <option key={b._id} value={b._id}>
                                            {b.bookingNumber} - {b.customerName}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a booking to auto-populate details.</p>
                                {bookingId && !canSubmit && (
                                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                                        This booking has no linked enquiry — a work order can&apos;t be generated from it yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Read Only Auto-populated fields */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border transition-colors ${bookingId ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700' : 'bg-slate-50/20 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 opacity-50 pointer-events-none'}`}>
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Customer Name</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.customer || '--'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Phone</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.phone || '--'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Service Category</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.category || '--'}</div>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Address</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.address || '--'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Specific Service</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.service || '--'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Preferred Date</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.date || '--'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Preferred Time</label>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking?.time || '--'}</div>
                            </div>
                             <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimate Amount</label>
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedBooking?.estimate || '--'}</div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Assignment — Schedule Date/Time, Estimated
                        Duration, Required Materials, Special Instructions and
                        Internal Notes were removed: the WorkOrder model has
                        no fields for any of them, so they were collected and
                        silently discarded on every save. Internal notes can
                        still be added after creation via the work order's own
                        Add Note action, which is properly wired to the model. */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">2. Assignment</h3>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign Partner</label>
                            <select
                                value={partnerId}
                                onChange={(e) => setPartnerId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                <option value="">
                                    {partnersLoading
                                        ? 'Loading partners…'
                                        : partners.length
                                          ? 'Unassigned (assign later)'
                                          : 'No active partners available'}
                                </option>
                                {partners.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} — ★{p.rating.toFixed(1)} · {p.activeJobs} active job{p.activeJobs === 1 ? '' : 's'}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sorted by rating — active job count shown so a busy partner isn&apos;t picked blind.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                {(enums.workOrder?.priority || ['low', 'normal', 'high']).map(p => (
                                    <option key={p} value={p}>{formatEnum(p)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SECTION 4: Pricing Summary */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">4. Pricing Summary (Read Only)</h3>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-center">
                            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-8 text-center md:text-left">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimate</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">{selectedBooking?.estimate || '--'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Discount</div>
                                    <div className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">- ₹0</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Coupon</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">--</div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-8">
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Final Amount</div>
                                    <div className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-1">{selectedBooking?.estimate || '--'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: Footer */}
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="flex items-center gap-2 mr-auto text-sm text-slate-500 dark:text-slate-400">
                            Status will default to <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{partnerId ? 'Assigned' : 'Open'}</span>
                        </div>
                        {createError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400">{createError.data?.message || 'Could not create the work order.'}</p>
                        )}
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit || isCreating}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Creating…' : 'Generate Work Order'}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
