'use client';
import { useState } from 'react';
import { X, Send } from 'lucide-react';

/**
 * Confirms sending an already-created Draft estimate to the customer, picking
 * a channel. This is deliberately separate from CreateEstimateModal's own
 * "Save & Send" — that one sends at creation time; this one is for a Draft
 * that was saved earlier and is only now being sent (the "Send to Customer"
 * footer action on an estimate whose status is still Draft).
 * onConfirm(channel) — caller is responsible for flipping status to 'Sent'.
 */
export default function SendEstimateModal({ isOpen, onClose, estimate, onConfirm }) {
    const [channel, setChannel] = useState('whatsapp');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Send estimate to customer</h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {estimate?.id} — <span className="font-semibold text-slate-900 dark:text-slate-100">{estimate?.finalAmount}</span> will be sent to{' '}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{estimate?.customer}</span>.
                    </p>
                    <div className="flex gap-2">
                        {['whatsapp', 'email'].map((c) => (
                            <button
                                key={c}
                                onClick={() => setChannel(c)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                                    channel === c
                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(channel); onClose(); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Send className="w-4 h-4" /> Send now
                    </button>
                </div>
            </div>
        </div>
    );
}
