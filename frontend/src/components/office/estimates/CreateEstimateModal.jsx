'use client';
import { useState, useMemo } from 'react';
import { X, Plus, Trash2, Save, Send, FileCheck, Link2, Check, Mail, MailWarning, CheckCircle2 } from 'lucide-react';
import { useGetEnquiriesQuery } from '@/store/api/enquiryApi';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { useCreateEstimateMutation } from '@/store/api/estimateApi';

/**
 * Builds a new Estimate. Two ways in:
 *  - From the Enquiries page: pass `enquiry` (the drawer's selected row) — the
 *    customer/enquiry section is then locked to that enquiry, matching the
 *    blueprint's "Create Estimate" action living on a Qualified enquiry.
 *  - From the Estimates page header "+ Create Estimate": `enquiry` is null,
 *    so the admin picks a qualified enquiry from the list first.
 *
 * The modal owns creation itself (rather than handing the payload back to the
 * caller) because "Save & Send" needs the real created estimate — the email
 * send happens server-side as part of that same POST, and the Copy Link
 * button needs the estimate's real _id, which doesn't exist until the create
 * call returns.
 *
 * onSave(estimate) — optional, fired once creation succeeds (e.g. so a caller
 * can close an unrelated drawer). Not used to trigger the creation itself.
 */
export default function CreateEstimateModal({ isOpen, onClose, enquiry, onSave }) {
    const [selectedEnquiryId, setSelectedEnquiryId] = useState(enquiry?.id || '');
    const [items, setItems] = useState([{ id: 1, serviceId: '', service: '', qty: 1, price: 0 }]);
    const [visitCharge, setVisitCharge] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [validity, setValidity] = useState('5');
    const [errorMsg, setErrorMsg] = useState('');
    const [sentEstimate, setSentEstimate] = useState(null); // set once "Save & Send" succeeds — switches to the success view
    const [copied, setCopied] = useState(false);

    const [createEstimate, { isLoading: isCreating }] = useCreateEstimateMutation();

    // Only Qualified enquiries are sellable — creating an estimate is the action
    // that moves an enquiry past qualification, so anything earlier (new/contacted)
    // or already converted isn't ready for pricing. `skip` avoids firing these
    // while the modal is closed.
    const { data: enquiryData, isLoading: enquiriesLoading } = useGetEnquiriesQuery('status=qualified', {
        skip: !isOpen || !!enquiry,
    });
    const { data: serviceData, isLoading: servicesLoading } = useGetServicesQuery(undefined, {
        skip: !isOpen,
    });

    const qualifiedEnquiries = useMemo(
        () =>
            (Array.isArray(enquiryData) ? enquiryData : []).map((e) => ({
                id: e._id,
                customer: e.customerId?.name || 'Unknown',
                phone: e.customerId?.phone || '',
                service: e.serviceCategory || 'General enquiry',
            })),
        [enquiryData]
    );

    const services = useMemo(
        () =>
            (Array.isArray(serviceData) ? serviceData : []).map((s) => ({
                id: s._id,
                name: s.name,
                price: Number(s.price ?? s.basePrice ?? 0),
            })),
        [serviceData]
    );

    const activeEnquiry = enquiry || qualifiedEnquiries.find((e) => e.id === selectedEnquiryId);

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0),
        [items]
    );
    const total = Math.max(subtotal + Number(visitCharge || 0) - Number(discount || 0), 0);

    if (!isOpen) return null;

    function resetAndClose() {
        setSentEstimate(null);
        setCopied(false);
        setErrorMsg('');
        onClose();
    }

    function updateItem(id, field, value) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    }

    function addItem() {
        setItems((prev) => [...prev, { id: Date.now(), serviceId: '', service: '', qty: 1, price: 0 }]);
    }

    function removeItem(id) {
        setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
    }

    function handleServiceSelect(id, serviceId) {
        const match = services.find((s) => s.id === serviceId);
        setItems((prev) =>
            prev.map((i) =>
                i.id === id
                    ? { ...i, serviceId, service: match?.name ?? '', price: match?.price ?? i.price }
                    : i
            )
        );
    }

    // Backend estimate shape — handed straight to the createEstimate mutation.
    function buildEstimate(status) {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + Number(validity));

        return {
            enquiryId: activeEnquiry?.id,
            customerName: activeEnquiry?.customer,
            phone: activeEnquiry?.phone,
            serviceName:
                items.map((i) => i.service).filter(Boolean).join(', ') || activeEnquiry?.service,
            lineItems: items
                .filter((i) => i.service)
                .map((i) => ({
                    serviceId: i.serviceId || null,
                    name: i.service,
                    qty: Number(i.qty) || 1,
                    price: Number(i.price) || 0,
                })),
            visitCharges: Number(visitCharge || 0),
            discount: Number(discount || 0),
            validUntil: validUntil.toISOString(),
            status,
        };
    }

    async function handleSaveDraft() {
        if (!canSubmit) return;
        setErrorMsg('');
        try {
            const created = await createEstimate(buildEstimate('Draft')).unwrap();
            onSave?.(created);
            resetAndClose();
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to save estimate.');
        }
    }

    async function handleSaveAndSend() {
        if (!canSubmit) return;
        setErrorMsg('');
        try {
            // Email is triggered server-side as part of this same request — no
            // separate "now send it" call, so there's no window where the
            // estimate is Sent but nothing actually went out.
            const created = await createEstimate(buildEstimate('Sent')).unwrap();
            onSave?.(created);
            setSentEstimate(created);
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to save estimate.');
        }
    }

    async function handleCopyLink() {
        if (!sentEstimate) return;
        const url = `${window.location.origin}/customer/estimates/${sentEstimate._id}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setErrorMsg('Could not copy the link — copy it manually from your browser address bar instead.');
        }
    }

    const canSubmit = !!activeEnquiry && items.some((i) => i.service);

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {sentEstimate ? 'Estimate Sent' : 'Create Estimate'}
                    </h2>
                    <button onClick={resetAndClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {sentEstimate ? (
                    /* ── Success view: email already attempted server-side, Copy Link for the manual WhatsApp step ── */
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {sentEstimate.estimateNumber || 'Estimate'} sent to {sentEstimate.customerName || 'the customer'}
                            </h3>
                            {sentEstimate.emailSentAt ? (
                                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                                    <Mail className="w-4 h-4" /> Emailed successfully
                                </p>
                            ) : sentEstimate.emailSendError ? (
                                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-rose-600 dark:text-rose-400">
                                    <MailWarning className="w-4 h-4" /> Email failed to send — use the link below instead
                                </p>
                            ) : (
                                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                                    No email on file for this customer — share the link below instead.
                                </p>
                            )}
                        </div>

                        <div className="w-full max-w-md mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Copy this link to send manually over WhatsApp — it opens the estimate on the customer's dashboard.
                            </p>
                            <button
                                onClick={handleCopyLink}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    copied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>

                        {errorMsg && <p className="text-xs text-rose-600 dark:text-rose-400">{errorMsg}</p>}

                        <button
                            onClick={resetAndClose}
                            className="mt-2 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Enquiry selection / summary */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enquiry</h3>
                                {enquiry ? (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{enquiry.customer}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{enquiry.id} • {enquiry.phone} • {enquiry.service}</div>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">Qualified</span>
                                    </div>
                                ) : (
                                    <select
                                        value={selectedEnquiryId}
                                        onChange={(e) => setSelectedEnquiryId(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="">
                                            {enquiriesLoading
                                                ? 'Loading qualified enquiries…'
                                                : qualifiedEnquiries.length
                                                  ? 'Select a qualified enquiry'
                                                  : 'No qualified enquiries available'}
                                        </option>
                                        {qualifiedEnquiries.map((e) => (
                                            <option key={e.id} value={e.id}>{e.customer} — {e.service}</option>
                                        ))}
                                    </select>
                                )}
                                {!enquiry && !selectedEnquiryId && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500">Only Qualified enquiries appear here — earlier-stage or Disqualified enquiries aren&apos;t ready for pricing yet.</p>
                                )}
                            </div>

                            {/* Line items */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Line Items</h3>
                                <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-700">
                                    <div className="col-span-6">Service</div>
                                    <div className="col-span-2 text-center">Qty</div>
                                    <div className="col-span-3 text-right">Price</div>
                                    <div className="col-span-1"></div>
                                </div>
                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-6">
                                            <select
                                                value={item.serviceId}
                                                onChange={(e) => handleServiceSelect(item.id, e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="">{servicesLoading ? 'Loading services…' : 'Select service'}</option>
                                                {services.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.qty}
                                                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                                className="w-full px-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                        <div className="col-span-3 relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-sm">₹</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                                className="w-full pl-6 pr-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={items.length === 1}
                                                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors disabled:opacity-30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                    <Plus className="w-4 h-4" /> Add line item
                                </button>
                            </div>

                            {/* Charges + validity */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Visit Charge</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-sm">₹</span>
                                        <input type="number" min="0" value={visitCharge} onChange={(e) => setVisitCharge(e.target.value)} className="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Discount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-sm">₹</span>
                                        <input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-emerald-600 dark:text-emerald-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Valid For</label>
                                    <select value={validity} onChange={(e) => setValidity(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                        <option value="3">3 days</option>
                                        <option value="5">5 days</option>
                                        <option value="7">7 days</option>
                                    </select>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimate Total</span>
                                <span className="text-xl font-black text-blue-700 dark:text-blue-400">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                &quot;Save &amp; Send&quot; emails the customer automatically and gives you a link to share over WhatsApp.
                            </p>
                            <div className="flex items-center gap-3">
                                <button onClick={resetAndClose} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveDraft}
                                    disabled={!canSubmit || isCreating}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
                                >
                                    <Save className="w-4 h-4" /> Save as Draft
                                </button>
                                <button
                                    onClick={handleSaveAndSend}
                                    disabled={!canSubmit || isCreating}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-40"
                                >
                                    <Send className="w-4 h-4" /> {isCreating ? 'Sending…' : 'Save & Send'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
