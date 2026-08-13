'use client';
import { X, MapPin, AlertCircle, Image as ImageIcon, Clock, Phone, UserPlus, Inbox, FileText, Paperclip, MessageCircle, FileCheck, XOctagon } from 'lucide-react';
import { StatusBadge, SourceBadge } from '@/components/office/ui/Badge';

export default function EnquiryDrawer({ isOpen, onClose, selectedRow, onCreateEstimate }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
                {/* Drawer Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0 transition-colors">
                    <div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{selectedRow?.id}</div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Enquiry Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
                    
                    {/* Customer Information */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
                                {selectedRow?.initial}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedRow?.customer}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedRow?.email}</p>
                            </div>
                            <StatusBadge status={selectedRow?.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phone</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedRow?.phone}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Source</div>
                                <SourceBadge source={selectedRow?.source} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address</div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">124, Shanti Nagar, Andheri East, Mumbai 400059</div>
                        </div>
                    </div>

                    {/* Service Request */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Service Request</h4>
                        <div className="mb-4">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requested Service</div>
                            <div className="text-base font-semibold text-blue-700 dark:text-blue-400">{selectedRow?.service}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Problem Description</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                AC is making a loud noise and not cooling properly for the last 2 days. Need immediate assistance.
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Uploaded Images</div>
                            <div className="flex gap-2">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Follow-up Card */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-5 transition-colors">
                        <div className="flex items-center gap-2 mb-3 text-amber-800 dark:text-amber-500">
                            <Clock className="w-5 h-5" />
                            <h4 className="font-bold">Next Follow-up</h4>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-amber-100 dark:border-amber-800/30 flex items-center justify-between mb-3 transition-colors">
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedRow?.nextFollowUp}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Call to discuss estimate</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Assigned to</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedRow?.assignedTo}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                                Reschedule
                            </button>
                            <button className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm">
                                Mark Completed
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Activity Timeline</h4>
                        <div className="space-y-4">
                            {[
                                { title: 'Estimate Sent', date: 'Today, 11:30 AM', icon: FileText, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                                { title: 'Customer Called', desc: 'Discussed requirements', date: 'Today, 10:15 AM', icon: Phone, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                                { title: 'Assigned to Amit Kumar', date: 'Yesterday, 4:30 PM', icon: UserPlus, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
                                { title: 'Enquiry Created', date: 'Yesterday, 4:10 PM', icon: Inbox, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' }
                            ].map((event, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== 3 && <div className="absolute left-4 top-8 bottom-[-16px] w-0.5 bg-slate-100 dark:bg-slate-700"></div>}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${event.bg} ${event.color}`}>
                                        <event.icon className="w-4 h-4" />
                                    </div>
                                    <div className="pb-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{event.title}</div>
                                        {event.desc && <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{event.desc}</div>}
                                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{event.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Internal Notes</h4>
                        <div className="space-y-4 mb-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Amit Kumar</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Oct 24, 10:20 AM</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Customer is comparing prices with Urban Company. Needs a small discount to close.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea 
                                rows="3" 
                                placeholder="Add a note..." 
                                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                            ></textarea>
                            <button className="absolute right-3 bottom-3 p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                <Paperclip className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Drawer Footer Actions */}
                {/* An Enquiry converts to an Estimate, never directly to a Booking —
                    a Booking should only ever come from a customer-approved Estimate.
                    "Convert to Booking" used to sit right here, which let a booking get
                    created with no price ever having been agreed to. The primary action
                    is also now conditional on status: an already-Qualified enquiry can
                    move straight to creating an estimate; anything earlier has to be
                    contacted first; a Disqualified enquiry gets no forward action at all. */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 grid grid-cols-2 gap-3 transition-colors">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Call
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] rounded-xl text-sm font-medium hover:bg-[#25D366]/20 transition-colors shadow-sm">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>

                    {selectedRow?.status === 'Disqualified' ? (
                        <div className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-xl text-sm font-medium">
                            No further action — enquiry disqualified
                        </div>
                    ) : selectedRow?.status === 'Qualified' ? (
                        <button
                            onClick={onCreateEstimate}
                            className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <FileCheck className="w-4 h-4" /> Create Estimate
                        </button>
                    ) : (
                        <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                            <FileCheck className="w-4 h-4" /> Mark as Qualified
                        </button>
                    )}

                    {selectedRow?.status !== 'Disqualified' && (
                        <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                            <XOctagon className="w-3.5 h-3.5" /> Mark Disqualified
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
