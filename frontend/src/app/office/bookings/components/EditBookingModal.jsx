'use client';
import { useEffect, useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useGetEnumsQuery } from '@/store/api/configApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import { useUpdateBookingMutation } from '@/store/api/bookingApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const TIME_SLOTS = ['9 - 11', '11 - 1', '2 - 4', '4 - 6'];

export default function EditBookingModal({ isOpen, onClose, booking }) {
    const { data: enums = {} } = useGetEnumsQuery();
    const { data: partnerData = [] } = useGetPartnersQuery(undefined, { skip: !isOpen });
    const [updateBooking, { isLoading: isSaving, error: saveError }] = useUpdateBookingMutation();

    const [status, setStatus] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    useEffect(() => {
        if (!booking) return;
        const raw = booking._raw || {};
        setStatus(raw.status || '');
        setPartnerId(raw.partnerId?._id || '');
        setScheduledDate(raw.scheduledDate ? new Date(raw.scheduledDate).toISOString().slice(0, 10) : '');
        setScheduledTime(raw.scheduledTime || '');
    }, [booking]);

    if (!booking) return null;

    const partners = Array.isArray(partnerData) ? partnerData.filter((p) => p.isActive !== false) : [];

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateBooking({
                id: booking._id,
                status,
                partnerId: partnerId || null,
                scheduledDate: scheduledDate || null,
                scheduledTime,
            }).unwrap();
            onClose();
        } catch {
            // saveError below already surfaces this
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Edit Booking ${booking.id}`} maxWidth="max-w-xl">
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
                                {(enums.booking?.status || ['pending_assignment', 'confirmed', 'in_progress', 'completed', 'cancelled']).map(s => (
                                    <option key={s} value={s}>{formatEnum(s)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                            <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Time Slot</label>
                            <select
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Select slot</option>
                                {TIME_SLOTS.map((slot) => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {saveError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400">{saveError.data?.message || 'Could not save changes.'}</p>
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
