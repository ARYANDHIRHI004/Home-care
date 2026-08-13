'use client';
import { useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';

// Previously the auto-populated fields below always showed the same hardcoded
// "Priya Patel" values no matter which booking was actually selected in the
// dropdown — this map makes the two bookings in the select actually resolve to
// their own real data, standing in for a real bookingId -> booking lookup.
const MOCK_BOOKINGS = {
    'BKG-8492': { customer: 'Priya Patel', phone: '+91 98765 43210', category: 'Cleaning', address: '123, Palm Grove, Bandra West, Mumbai', service: 'Deep Home Cleaning', date: 'Oct 25, 2023', time: '10:00 AM', estimate: '₹3,500' },
    'BKG-8493': { customer: 'Rahul Sharma', phone: '+91 87654 32109', category: 'AC & Appliance', address: '45, Sector 6, Bhilai', service: 'AC Repair & Service', date: 'Oct 26, 2023', time: '2:00 PM', estimate: '₹1,800' },
};

// Decision support for partner assignment — a bare name dropdown gives the admin
// no way to actually choose well between a dozen partners. Surfacing rating,
// current same-day load, and distance from the job (all things Section 5.5 of the
// blueprint calls out explicitly) turns this into an actual decision instead of a
// guess. Sorted nearest-first as a reasonable default.
const MOCK_PARTNERS = [
    { name: 'Amit Kumar', rating: 4.8, jobsToday: 3, distanceKm: 2.1 },
    { name: 'Sunil Das', rating: 4.5, jobsToday: 1, distanceKm: 4.0 },
    { name: 'Anil Deshmukh', rating: 4.9, jobsToday: 5, distanceKm: 1.5 },
];

export default function CreateWorkOrderModal({ isOpen, onClose }) {
    const [bookingId, setBookingId] = useState('');
    const selectedBooking = MOCK_BOOKINGS[bookingId];

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Generate Work Order" maxWidth="max-w-4xl">
            <div className="p-6">
                <form className="space-y-8">
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
                                    <option value="">Select Confirmed Booking</option>
                                    <option value="BKG-8492">BKG-8492 - Priya Patel</option>
                                    <option value="BKG-8493">BKG-8493 - Rahul Sharma</option>
                                </select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a booking to auto-populate details.</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* SECTION 2: Assignment */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">2. Assignment</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign Partner *</label>
                                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                    <option value="">Select Field Professional</option>
                                    {MOCK_PARTNERS.sort((a, b) => a.distanceKm - b.distanceKm).map((p) => (
                                        <option key={p.name} value={p.name}>
                                            {p.name} — ★{p.rating} · {p.jobsToday} jobs today · {p.distanceKm}km away
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sorted by distance — rating and today&apos;s job count shown so a busy or lower-rated partner isn&apos;t picked blind.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule Date</label>
                                    <input type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule Time</label>
                                    <input type="time" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Duration</label>
                                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                    <option value="1 Hour">1 Hour</option>
                                    <option value="2 Hours">2 Hours</option>
                                    <option value="4 Hours">4 Hours</option>
                                    <option value="Full Day">Full Day</option>
                                </select>
                            </div>
                        </div>

                        {/* SECTION 3: Execution Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">3. Execution Details</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Required Materials</label>
                                <input type="text" placeholder="e.g. Deep cleaning liquid, Vacuum" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Special Instructions (For Partner)</label>
                                <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none" placeholder="Customer instructions..."></textarea>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Internal Notes (Office Only)</label>
                                <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none" placeholder="Private admin notes..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Pricing Summary */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">4. Pricing Summary (Read Only)</h3>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-center">
                            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-8 text-center md:text-left">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimate</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">₹3,500</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Discount</div>
                                    <div className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">- ₹500</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Coupon</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">WELCOME50</div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-8">
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Final Amount</div>
                                    <div className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-1">₹3,000</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: Footer */}
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="flex items-center gap-2 mr-auto text-sm text-slate-500 dark:text-slate-400">
                            Status will default to <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Assigned</span>
                        </div>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                            Generate Work Order
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
