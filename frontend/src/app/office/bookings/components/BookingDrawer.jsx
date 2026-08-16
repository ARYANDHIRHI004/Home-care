'use client';
import { X, MapPin, Calendar as CalendarIcon, ShieldAlert, FileDigit, CheckCircle2, Plus, Wrench } from 'lucide-react';
import { StatusBadge, PaymentBadge } from '@/components/office/ui/Badge';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';
import { mapOfficeWorkOrder } from '@/lib/officeApiMappers';

export default function BookingDrawer({ isOpen, onClose, selectedRow }) {
    // A booking can spawn more than one work order (e.g. a measurement visit
    // followed by a separate installation visit), so this is a filtered list
    // rather than a single lookup. Skipped while the drawer is closed or before
    // a row is selected.
    const { data, isLoading, isError } = useGetWorkOrdersQuery(
        selectedRow?.id ? `bookingId=${selectedRow.id}` : '',
        { skip: !isOpen || !selectedRow?.id }
    );

    const workOrders = Array.isArray(data) ? data.map(mapOfficeWorkOrder) : [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
                {/* Drawer Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0 transition-colors">
                    <div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{selectedRow?.id}</div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Booking Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                    
                    {/* Customer & Service Info */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm relative overflow-hidden transition-colors">
                        {selectedRow?.status === 'Pending Assignment' && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                        )}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
                                {selectedRow?.initial}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedRow?.customer}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedRow?.phone}</p>
                            </div>
                            <StatusBadge status={selectedRow?.status} />
                        </div>
                        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 mb-4 transition-colors">
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mb-1">Service Requested</div>
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedRow?.service}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Schedule</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedRow?.date}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-500">{selectedRow?.time}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">124, Shanti Nagar, Mumbai</div>
                                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-0.5 font-medium">View on Map</button>
                            </div>
                        </div>
                    </div>

                    {/* Work Orders under this booking */}
                    {/* This replaces the old single "Assigned Professional" + inline ETA/
                        reassign section, which assumed exactly one execution per booking
                        with the partner and live progress living directly on the Booking
                        itself. That breaks for any multi-visit job (measurement + install,
                        AC gas refill + follow-up check, etc). Partner assignment, live
                        status, and completion now live on the Work Order(s) below, where
                        a booking can have one or several — matching the blueprint's
                        Booking 1-N Work Orders relationship. */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Work Orders</h4>
                        {isLoading ? (
                            <div className="space-y-2 mb-3">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="text-center p-4 border border-dashed border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 rounded-xl transition-colors mb-3">
                                <ShieldAlert className="w-8 h-8 text-rose-400 dark:text-rose-500 mx-auto mb-2" />
                                <div className="text-sm font-semibold text-rose-800 dark:text-rose-400">Couldn&apos;t load work orders</div>
                            </div>
                        ) : workOrders.length > 0 ? (
                            <div className="space-y-2 mb-3">
                                {workOrders.map((wo) => (
                                    <div key={wo.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <Wrench className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{wo.label}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{wo.displayId} • {wo.assignedTo} • {wo.date}</div>
                                            </div>
                                        </div>
                                        <StatusBadge status={wo.status} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-xl transition-colors mb-3">
                                <ShieldAlert className="w-8 h-8 text-amber-400 dark:text-amber-500 mx-auto mb-2" />
                                <div className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">No work order yet</div>
                                <div className="text-xs text-amber-600 dark:text-amber-500">Create one to assign a partner and schedule the visit.</div>
                            </div>
                        )}
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
                            <Plus className="w-4 h-4" /> New Work Order
                        </button>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider flex justify-between items-center">
                            Payment Details
                            <PaymentBadge status={selectedRow?.payment} />
                        </h4>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Service Charge</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">₹{selectedRow?.amount?.replace('₹', '')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Taxes (18% GST)</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">₹{selectedRow?.amount ? (parseInt(selectedRow.amount.replace('₹', '').replace(',', '')) * 0.18).toFixed(0) : '0'}</span>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between">
                                <span className="font-bold text-slate-900 dark:text-slate-100">Total Amount</span>
                                <span className="font-bold text-blue-700 dark:text-blue-400">₹{selectedRow?.amount ? (parseInt(selectedRow.amount.replace('₹', '').replace(',', '')) * 1.18).toFixed(0) : '0'}</span>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <FileDigit className="w-4 h-4" /> View Invoice
                        </button>
                    </div>

                    {/* Booking Timeline */}
                    {/* Trimmed to booking-level events only (confirmed / cancelled /
                        rescheduled) — "Service Started" / "Reached Location" are Work
                        Order execution states now shown per-order above, not booking
                        events; showing them here duplicated (and could contradict) the
                        Work Order's own status. */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Booking Timeline</h4>
                        <div className="space-y-4">
                            {[
                                { title: 'Estimate Approved', date: 'Yesterday, 4:05 PM', status: 'done' },
                                { title: 'Booking Confirmed', date: 'Yesterday, 4:10 PM', status: 'done' },
                            ].map((event, idx, arr) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== arr.length - 1 && <div className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${event.status === 'done' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-700'}`}></div>}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${event.status === 'done' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-500'}`}>
                                        {event.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>}
                                    </div>
                                    <div className="pb-4">
                                        <div className={`text-sm font-medium ${event.status === 'done' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>{event.title}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{event.status === 'done' ? event.date : '--'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Drawer Footer Actions */}
                {/* "Mark Completed" removed — completion is a Work Order state (each
                    order completes independently), not something to force on the whole
                    Booking with one click while other work orders under it might still
                    be in progress. Booking-level actions are cancel/reschedule only. */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 flex gap-3 transition-colors">
                    <button className="flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-center">
                        Reschedule
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shadow-sm text-center">
                        Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
