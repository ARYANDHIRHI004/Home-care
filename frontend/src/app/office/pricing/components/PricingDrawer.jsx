import { X, Tag, Calculator, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUpdateServiceMutation } from '@/store/api/serviceApi';

// "Pricing" here is really just editing a Service's own pricing fields —
// there is no separate Pricing model in the backend at all. basePrice and
// visitCharges are the only two real fields on Service (see
// service.model.js); GST rate, labour charge, surcharges, discount cap,
// validity dates, and version notes that used to appear here had nothing to
// save into and were previously discarded on every "Save Pricing" click
// (which itself had no handler at all). Trimmed to what actually persists.
export default function PricingDrawer({ pricing, isOpen, onClose }) {
    const [updateService, { isLoading: isSaving, error: saveError }] = useUpdateServiceMutation();
    const [base, setBase] = useState(0);
    const [visit, setVisit] = useState(0);

    useEffect(() => {
        if (pricing) {
            setBase(pricing.base || 0);
            setVisit(pricing.visit || 0);
        } else {
            setBase(0);
            setVisit(0);
        }
    }, [pricing]);

    if (!isOpen || !pricing) return null;

    const gst = 18; // Informational only — GST isn't a stored per-service field.
    const subtotal = Number(base) + Number(visit);
    const taxAmount = subtotal * (gst / 100);
    const finalPrice = subtotal + taxAmount;

    async function handleSubmit() {
        try {
            await updateService({ id: pricing._id, basePrice: Number(base), visitCharges: Number(visit) }).unwrap();
            onClose();
        } catch {
            // saveError below already surfaces this
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Edit Pricing</h2>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{pricing.service}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Tag className="w-4 h-4" /> Core Pricing</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Base Price (₹)</label>
                                        <input
                                            type="number"
                                            value={base}
                                            onChange={e => setBase(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Visiting Charge (₹)</label>
                                        <input
                                            type="number"
                                            value={visit}
                                            onChange={e => setVisit(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                    </div>
                                </div>
                                {saveError && (
                                    <p className="text-xs text-rose-600">{saveError.data?.message || 'Could not save pricing.'}</p>
                                )}
                            </div>
                        </div>

                        {/* Live Calculator — GST shown at a flat informational
                            18%, since it isn't a field stored per-service. */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800">
                                <div className="bg-slate-800 px-5 py-4 flex items-center gap-2 border-b border-slate-700">
                                    <Calculator className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-sm font-bold text-white tracking-wide uppercase">Live Calculator</h3>
                                </div>
                                <div className="p-5 font-mono text-sm space-y-3">
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Base Price</span>
                                        <span>₹{Number(base).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Visiting Charge</span>
                                        <span>+ ₹{Number(visit).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-slate-700 border-dashed my-3"></div>
                                    <div className="flex justify-between items-center font-medium text-slate-200">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span>GST ({gst}%, estimated)</span>
                                        <span>+ ₹{taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t-2 border-slate-700 mt-4 pt-4 flex justify-between items-center text-lg font-bold text-white">
                                        <span>Final Price</span>
                                        <span className="bg-blue-600 px-3 py-1 rounded-lg">₹{finalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save Pricing'}
                    </button>
                </div>
            </div>
        </div>
    );
}
