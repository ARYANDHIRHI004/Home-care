import { X, Plus, Trash2, Save, FileEdit } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useGetTicketsQuery } from '@/store/api/ticketApi';
import { useGetInvoicesQuery, useCreateInvoiceMutation, useUpdateInvoiceMutation } from '@/store/api/invoiceApi';
import { useGetServicesQuery } from '@/store/api/serviceApi';

// Invoice.lineItems[].serviceId is required by the schema (see
// invoice.model.js) — a free-text "type anything" line item was never
// actually saveable against it, so each line here is a real Service picked
// from the catalog, not typed text. Similarly Invoice has no amountPaid,
// invoiceDate, or dueDate fields — paymentStatus is driven by actual
// Payment records elsewhere, not a form input at creation, so that whole
// "Amount Paid / Balance Due" editor was removed along with the date fields
// that had nothing to save into.
export default function InvoiceEditorDrawer({ invoice, isOpen, onClose }) {
    const isNew = !invoice;
    const { data: rawTickets = [] } = useGetTicketsQuery('status=completed', { skip: !isOpen });
    const { data: rawInvoices = [] } = useGetInvoicesQuery(undefined, { skip: !isOpen });
    const { data: rawServices = [] } = useGetServicesQuery('active=true', { skip: !isOpen });
    const [createInvoice, { isLoading: isCreating, error: createError }] = useCreateInvoiceMutation();
    const [updateInvoice, { isLoading: isUpdating, error: updateError }] = useUpdateInvoiceMutation();

    const [workOrderId, setWorkOrderId] = useState('');
    const [items, setItems] = useState([{ id: 1, serviceId: '', name: '', qty: 1, price: 0 }]);
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(18);

    // Already-invoiced tickets shouldn't be offered again.
    const invoicedTicketIds = useMemo(
        () => new Set(rawInvoices.map((inv) => String(inv.workOrderId?._id || inv.workOrderId))),
        [rawInvoices]
    );
    const availableTickets = useMemo(
        () => rawTickets.filter((t) => isNew ? !invoicedTicketIds.has(String(t._id)) : true),
        [rawTickets, invoicedTicketIds, isNew]
    );
    const selectedTicket = availableTickets.find((t) => t._id === workOrderId) || rawTickets.find((t) => t._id === workOrderId);

    useEffect(() => {
        if (!isOpen) return;
        if (invoice) {
            setWorkOrderId(invoice.workOrderId?._id || invoice.workOrderId || '');
            setItems(
                (invoice.lineItems?.length ? invoice.lineItems : [{ serviceId: '', name: '', qty: 1, price: 0 }])
                    .map((li, i) => ({ id: i + 1, serviceId: li.serviceId?._id || li.serviceId || '', name: li.name, qty: li.qty, price: li.price }))
            );
            setDiscount(invoice.discount || 0);
            const subtotalNow = (invoice.lineItems || []).reduce((s, li) => s + li.qty * li.price, 0);
            setTaxRate(subtotalNow > 0 ? Math.round(((invoice.tax || 0) / subtotalNow) * 100) : 18);
        } else {
            setWorkOrderId('');
            setItems([{ id: 1, serviceId: '', name: '', qty: 1, price: 0 }]);
            setDiscount(0);
            setTaxRate(18);
        }
    }, [invoice, isOpen]);

    if (!isOpen) return null;

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), serviceId: '', name: '', qty: 1, price: 0 }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) setItems(items.filter((i) => i.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems(items.map((i) => {
            if (i.id !== id) return i;
            if (field === 'serviceId') {
                const svc = rawServices.find((s) => s._id === value);
                return { ...i, serviceId: value, name: svc?.name || '', price: svc?.basePrice ?? i.price };
            }
            return { ...i, [field]: value };
        }));
    };

    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const taxableAmount = Math.max(subtotal - Number(discount || 0), 0);
    const tax = taxableAmount * (Number(taxRate || 0) / 100);
    const grandTotal = taxableAmount + tax;

    const validItems = items.filter((i) => i.serviceId && i.qty > 0);
    const canSubmit = !!workOrderId && validItems.length > 0;
    const isSaving = isCreating || isUpdating;
    const saveError = createError || updateError;

    async function handleSubmit() {
        if (!canSubmit) return;
        const payload = {
            workOrderId,
            lineItems: validItems.map((i) => ({ serviceId: i.serviceId, name: i.name, qty: i.qty, price: i.price })),
            tax,
            discount: Number(discount || 0),
        };
        try {
            if (isNew) {
                await createInvoice(payload).unwrap();
            } else {
                await updateInvoice({ id: invoice._id || invoice.id, ...payload }).unwrap();
            }
            onClose();
        } catch {
            // saveError below already surfaces this
        }
    }

    return (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileEdit className="w-5 h-5 text-blue-600" /> {isNew ? 'Create New Invoice' : `Edit Invoice ${invoice.invoiceNumber || invoice.id}`}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">

                    {/* Basic Details */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Work Order</label>
                            <select
                                value={workOrderId}
                                onChange={(e) => setWorkOrderId(e.target.value)}
                                disabled={!isNew}
                                className="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                            >
                                <option value="">Select a completed work order</option>
                                {availableTickets.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.ticketNumber} — {t.customerId?.name || t.customerName || 'Unknown'}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">Only completed, not-yet-invoiced work orders appear here.</p>
                        </div>
                        {selectedTicket && (
                            <div className="col-span-2 flex items-center gap-6 text-sm bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span><span className="text-slate-400">Customer:</span> <span className="font-semibold text-slate-800">{selectedTicket.customerId?.name || selectedTicket.customerName || '—'}</span></span>
                                <span><span className="text-slate-400">Phone:</span> <span className="font-semibold text-slate-800">{selectedTicket.customerId?.phone || '—'}</span></span>
                            </div>
                        )}
                    </div>

                    {/* Line Items Editor */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Line Items</h3>

                        <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-12 gap-3 pb-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-6">Service</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-3 text-right">Unit Price</div>
                                <div className="col-span-1 text-center"></div>
                            </div>

                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                                    <div className="col-span-6">
                                        <select
                                            value={item.serviceId}
                                            onChange={(e) => updateItem(item.id, 'serviceId', e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="">Select a service</option>
                                            {rawServices.map((s) => (
                                                <option key={s._id} value={s._id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.qty}
                                            min="1"
                                            onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                        />
                                    </div>
                                    <div className="col-span-3 relative">
                                        <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                                        <input
                                            type="number"
                                            value={item.price || ''}
                                            onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                                            className="w-full text-sm border border-slate-200 rounded-lg pl-6 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-medium"
                                        />
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={items.length === 1}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-end">
                        <div className="w-[300px] space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-600">
                                <span>Discount</span>
                                <div className="relative w-28">
                                    <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discount}
                                        onChange={(e) => setDiscount(Math.max(Number(e.target.value) || 0, 0))}
                                        className="w-full text-sm border border-slate-200 rounded-lg pl-6 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-medium text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span>GST</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                                        className="w-16 text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-medium"
                                    />
                                    <span className="text-xs text-slate-400">%</span>
                                    <span className="font-medium w-20 text-right">₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-3 text-xl font-black text-slate-900">
                                <span>Grand Total</span>
                                <span>₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            {!isNew && invoice?.paymentStatus && (
                                <div className="flex justify-end pt-1">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        invoice.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                                        invoice.paymentStatus === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {invoice.paymentStatus === 'paid' ? 'Paid' : invoice.paymentStatus === 'partial' ? 'Partially Paid' : 'Unpaid'} (from recorded payments)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {saveError && (
                        <p className="text-sm text-rose-600">{saveError.data?.message || 'Could not save this invoice.'}</p>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || isSaving}
                        className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving…' : isNew ? 'Generate Invoice' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
