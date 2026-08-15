'use client';
import { Briefcase } from 'lucide-react';
import BookingRow from './BookingRow';

export default function BookingTable({ bookings, onRowClick, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                        <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500" /></th>
                        <th className="p-4">Booking ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Schedule</th>
                        <th className="p-4">Assigned To</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 w-12"></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {bookings.length > 0 ? (
                        bookings.map((bkg) => (
                            <BookingRow 
                                key={bkg.id} 
                                bkg={bkg} 
                                onClick={() => onRowClick(bkg)} 
                                onEdit={() => onEdit(bkg)} 
                                onDelete={() => onDelete(bkg)} 
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                                        <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">No bookings available</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">Bookings created from enquiries or manual entry will appear here.</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                        Create First Booking
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
