'use client';
import { useState, useMemo } from 'react';
import { X, Plus, Trash2, Save, Send, FileCheck } from 'lucide-react';

// Stands in for a real "qualified enquiries with no estimate yet" API query.
// Only Qualified enquiries should be sellable here — Estimate creation is the
// action that moves an enquiry past qualification, so pulling from anything
// earlier (New/Contacted) or already Disqualified wouldn't make sense.
const QUALIFIED_ENQUIRIES = [
    { id: 'ENQ-8021', customer: 'Rahul Sharma', phone: '+91 98765 43210', service: 'AC Deep Cleaning' },
    { id: 'ENQ-8025', customer: 'Suresh Kumar', phone: '+91 54321 09876', service: 'Pest Control' },
];

const SERVICE_CATALOG = [
    { name: 'AC Deep Foam & Jet Cleaning', price: 499 },
    { name: 'Full Home Deep Cleaning', price: 2499 },
    { name: 'Pipe Leakage & Tap Repair', price: 199 },
    { name: 'Switchboard & Socket Installation', price: 149 },
    { name: 'Advanced Pest Control', price: 799 },
];

/**
 * Builds a new Estimate. Two ways in:
 *  - From the Enquiries page: pass `enquiry` (the drawer's selected row) — the
 *    customer/enquiry section is then locked to that enquiry, matching the
 *    blueprint's "Create Estimate" action living on a Qualified enquiry.
 *  - From the Estimates page header "+ Create Estimate": `enquiry` is null,
 *    so the admin picks a qualified enquiry from the list first.
 * onSave(estimate, { send }) — `send` is true when "Save & Send" was used
 * instead of "Save as Draft", so the caller knows whether status should be
 * 'Draft' or 'Sent'.
 */
export default function CreateEstimateModal({ isOpen, onClose, enquiry, onSave }) {
    const [selectedEnquiryId, setSelectedEnquiryId] = useState(enquiry?.id || '');
    const [items, setItems] = useState([{ id: 1, service: '', qty: 1, price: 0 }]);
    const [visitCharge, setVisitCharge] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [validity, setValidity] = useState('5');
    const [sendChannel, setSendChannel] = useState('whatsapp');

    const activeEnquiry = enquiry || QUALIFIED_ENQUIRIES.find((e) => e.id === selectedEnquiryId);

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0),
        [items]
    );
    const total = Math.max(subtotal + Number(visitCharge || 0) - Number(discount || 0), 0);

    if (!isOpen) return null;

    function updateItem(id, field, value) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    }

    function addItem() {
        setItems((prev) => [...prev, { id: Date.now(), service: '', qty: 1, price: 0 }]);
    }

    function removeItem(id) {
        setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
    }

    function handleServiceSelect(id, serviceName) {
        const match = SERVICE_CATALOG.find((s) => s.name === serviceName);
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, service: serviceName, price: match?.price ?? i.price } : i))
        );
    }

    function buildEstimate() {
        return {
            id: `EST-${Math.floor(4000 + Math.random() * 999)}`,
            customer: activeEnquiry?.customer,
            phone: activeEnquiry?.phone,
            service: items.map((i) => i.service).filter(Boolean).join(', ') || activeEnquiry?.service,
            enquiryId: activeEnquiry?.id,
            items,
            visitCharge: Number(visitCharge || 0),
            discount: Number(discount || 0),
            amount: `₹${subtotal.toLocaleString()}`,
            finalAmount: `₹${total.toLocaleString()}`,
            validity: `${validity} Days Left`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            initial: activeEnquiry?.customer?.charAt(0) || '?',
        };
    }

    function handleSaveDraft() {
        if (!activeEnquiry || !items.some((i) => i.service)) return;
        onSave({ ...buildEstimate(), status: 'Draft' }, { send: false });
        onClose();
    }

    function handleSaveAndSend() {
        if (!activeEnquiry || !items.some((i) => i.service)) return;
        onSave({ ...buildEstimate(), status: 'Sent' }, { send: true, channel: sendChannel });
        onClose();
    }

    const canSubmit = !!activeEnquiry && items.some((i) => i.service);

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600" /> Create Estimate
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Enquiry selection / summary */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enquiry</h3>
                        {enquiry ? (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-slate-900">{enquiry.customer}</div>
                                    <div className="text-xs text-slate-500">{enquiry.id} • {enquiry.phone} • {enquiry.service}</div>
                                </div>
                                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Qualified</span>
                            </div>
                        ) : (
                            <select
                                value={selectedEnquiryId}
                                onChange={(e) => setSelectedEnquiryId(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="">Select a qualified enquiry</option>
                                {QUALIFIED_ENQUIRIES.map((e) => (
                                    <option key={e.id} value={e.id}>{e.id} — {e.customer} — {e.service}</option>
                                ))}
                            </select>
                        )}
                        {!enquiry && !selectedEnquiryId && (
                            <p className="text-xs text-slate-400">Only Qualified enquiries appear here — earlier-stage or Disqualified enquiries aren&apos;t ready for pricing yet.</p>
                        )}
                    </div>

                    {/* Line items */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Line Items</h3>
                        <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-200">
                            <div className="col-span-6">Service</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-3 text-right">Price</div>
                            <div className="col-span-1"></div>
                        </div>
                        {items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                                <div className="col-span-6">
                                    <select
                                        value={item.service}
                                        onChange={(e) => handleServiceSelect(item.id, e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">Select service</option>
                                        {SERVICE_CATALOG.map((s) => (
                                            <option key={s.name} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.qty}
                                        onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                        className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="col-span-3 relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.price}
                                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                        className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="col-span-1 text-center">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        disabled={items.length === 1}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                            <Plus className="w-4 h-4" /> Add line item
                        </button>
                    </div>

                    {/* Charges + validity */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Visit Charge</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                                <input type="number" min="0" value={visitCharge} onChange={(e) => setVisitCharge(e.target.value)} className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Discount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                                <input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-emerald-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Valid For</label>
                            <select value={validity} onChange={(e) => setValidity(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                <option value="3">3 days</option>
                                <option value="5">5 days</option>
                                <option value="7">7 days</option>
                            </select>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Estimate Total</span>
                        <span className="text-xl font-black text-blue-700">₹{total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
                    <select
                        value={sendChannel}
                        onChange={(e) => setSendChannel(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="whatsapp">Send via WhatsApp</option>
                        <option value="email">Send via Email</option>
                    </select>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            disabled={!canSubmit}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-40"
                        >
                            <Save className="w-4 h-4" /> Save as Draft
                        </button>
                        <button
                            onClick={handleSaveAndSend}
                            disabled={!canSubmit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-40"
                        >
                            <Send className="w-4 h-4" /> Save &amp; Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
