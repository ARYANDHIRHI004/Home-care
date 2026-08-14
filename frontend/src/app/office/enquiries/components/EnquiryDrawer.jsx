'use client';
import { useState } from 'react';
import { X, MapPin, AlertCircle, Image as ImageIcon, Clock, Phone, UserPlus, Inbox, FileText, Paperclip, MessageCircle, FileCheck, XOctagon } from 'lucide-react';
import { StatusBadge, SourceBadge } from '@/components/office/ui/Badge';
import { useUpdateEnquiryMutation, useAddEnquiryNoteMutation } from '@/store/api/enquiryApi';

export default function EnquiryDrawer({ isOpen, onClose, selectedRow, onCreateEstimate }) {
    const [noteText, setNoteText] = useState('');
    const [updateEnquiry, { isLoading: isUpdating }] = useUpdateEnquiryMutation();
    const [addNote, { isLoading: isAddingNote }] = useAddEnquiryNoteMutation();

    if (!isOpen) return null;

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedRow) return;
        try {
            await updateEnquiry({ id: selectedRow.id, status: newStatus }).unwrap();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim() || !selectedRow) return;
        try {
            await addNote({ id: selectedRow.id, text: noteText }).unwrap();
            setNoteText('');
        } catch (err) {
            console.error('Failed to add note:', err);
        }
    };

    const internalNotes = selectedRow?._raw?.internalNotes || [];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
                {/* Drawer Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0 transition-colors">
                    <div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{selectedRow?.displayId || selectedRow?.id}</div>
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
                    </div>

                    {/* Service Request */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Service Request</h4>
                        <div className="mb-4">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requested Service</div>
                            <div className="text-base font-semibold text-blue-700 dark:text-blue-400">{selectedRow?.service}</div>
                        </div>
                        {selectedRow?._raw?.description && (
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Problem Description</div>
                                <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                    {selectedRow._raw.description}
                                </div>
                            </div>
                        )}
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
                                <div className="text-xs text-slate-500 dark:text-slate-400">Follow-up scheduled</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Assigned to</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedRow?.assignedTo}</div>
                            </div>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Internal Notes</h4>
                        <div className="space-y-4 mb-4">
                            {internalNotes.length > 0 ? internalNotes.map((note, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{note.employeeId?.name || 'Admin'}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(note.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{note.text}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 dark:text-slate-500 italic">No notes yet.</p>
                            )}
                        </div>
                        <div className="relative">
                            <textarea
                                rows="3"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add a note..."
                                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                            ></textarea>
                            <button
                                onClick={handleAddNote}
                                disabled={isAddingNote || !noteText.trim()}
                                className="absolute right-3 bottom-3 p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Paperclip className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Drawer Footer Actions */}
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
                        <button
                            onClick={() => handleStatusUpdate('Qualified')}
                            disabled={isUpdating}
                            className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm"
                        >
                            <FileCheck className="w-4 h-4" /> {isUpdating ? 'Updating...' : 'Mark as Qualified'}
                        </button>
                    )}

                    {selectedRow?.status !== 'Disqualified' && (
                        <button
                            onClick={() => handleStatusUpdate('Disqualified')}
                            disabled={isUpdating}
                            className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-40 transition-colors"
                        >
                            <XOctagon className="w-3.5 h-3.5" /> Mark Disqualified
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
