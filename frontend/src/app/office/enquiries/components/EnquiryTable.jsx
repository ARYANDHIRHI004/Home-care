'use client';
import { Inbox } from 'lucide-react';
import EnquiryRow from './EnquiryRow';

export default function EnquiryTable({ enquiries, onRowClick, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                        <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500" /></th>
                        <th className="p-4">Enquiry ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Requested Service</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Assigned To</th>
                        <th className="p-4">Next Follow-up</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Created Date</th>
                        <th className="p-4 w-12"></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {enquiries.length > 0 ? (
                        enquiries.map((enq) => (
                            <EnquiryRow 
                                key={enq.id} 
                                enq={enq} 
                                onClick={() => onRowClick(enq)} 
                                onEdit={() => onEdit(enq)} 
                                onDelete={() => onDelete(enq)} 
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                                        <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">No enquiries yet</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">Customer enquiries from website, phone, WhatsApp and social channels will appear here.</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                        Create First Enquiry
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
