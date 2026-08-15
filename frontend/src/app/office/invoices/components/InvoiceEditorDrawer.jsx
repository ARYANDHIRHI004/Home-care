import { X, Plus, Trash2, Save, FileEdit } from 'lucide-react';
import { useState, useEffect } from 'react';

// An invoice should only ever be generated from a Work Order that's actually
// Completed — invoicing an in-progress or not-yet-started job doesn't make sense,
// and a free-text "type anything" field (as this was before) let that happen
// silently. Restricting the source to a select of completed work orders closes
// that gap; swap this list for a real "completed, not yet invoiced" API query.
const COMPLETED_WORK_ORDERS = [
    { id: 'WO-10590', label: 'WO-10590 — Sneha Gupta — Plumbing Service' },
    { id: 'WO-10586', label: 'WO-10586 — Sunita Sharma — Kitchen Remodeling' },
];

export default function InvoiceEditorDrawer({ invoice, isOpen, onClose }) {
    // Basic state setup to handle line items and auto-calc
    const [items, setItems] = useState([
        { id: 1, desc: '3 BHK Deep Cleaning', qty: 1, price: 2118, discount: 0 }
    ]);
    const [amountPaid, setAmountPaid] = useState(invoice?.amountPaid || 0);

    useEffect(() => {
        if (invoice) {
            // Pre-fill if editing
            setItems([{ id: 1, desc: 'Deep Cleaning Service', qty: 1, price: invoice.subtotal, discount: invoice.discount }]);
        } else {
            setItems([{ id: 1, desc: '', qty: 1, price: 0, discount: 0 }]);
        }
    }, [invoice, isOpen]);

    if (!isOpen) return null;

    const isNew = !invoice;

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), desc: '', qty: 1, price: 0, discount: 0 }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    // Auto Calculations
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const totalDiscount = items.reduce((sum, item) => sum + Number(item.discount || 0), 0);
    const taxableAmount = subtotal - totalDiscount;
    const gst = taxableAmount * 0.18; // 18% GST
    const grandTotal = taxableAmount + gst;
    const balanceDue = Math.max(grandTotal - amountPaid, 0);

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileEdit className="w-5 h-5 text-blue-600" /> {isNew ? 'Create New Invoice' : `Edit Invoice ${invoice.id}`}
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
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer Name</label>
                            <input type="text" defaultValue={invoice?.customer || ''} placeholder="Select or type customer name" className="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Work Order</label>
                            <select defaultValue={invoice?.workOrderId || ''} className="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="">Select a completed work order</option>
                                {COMPLETED_WORK_ORDERS.map((wo) => (
                                    <option key={wo.id} value={wo.id}>{wo.label}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">Only work orders marked Completed appear here — invoicing before the job is done isn&apos;t possible.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Invoice Date</label>
                            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                            <input type="date" className="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                    </div>

                    {/* Line Items Editor */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Line Items</h3>
                        
                        <div className="space-y-3 mb-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-3 pb-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-5">Service / Item</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-2 text-right">Unit Price</div>
                                <div className="col-span-2 text-right">Discount</div>
                                <div className="col-span-1 text-center"></div>
                            </div>
                            
                            {/* Items */}
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                                    <div className="col-span-5">
                                        <input 
                                            type="text" 
                                            value={item.desc}
                                            onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                                            placeholder="Item description" 
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
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
                                    <div className="col-span-2 relative">
                                        <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                                        <input 
                                            type="number" 
                                            value={item.price || ''}
                                            onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                                            className="w-full text-sm border border-slate-200 rounded-lg pl-6 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-medium" 
                                        />
                                    </div>
                                    <div className="col-span-2 relative">
                                        <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                                        <input 
                                            type="number" 
                                            value={item.discount || ''}
                                            onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                                            className="w-full text-sm border border-slate-200 rounded-lg pl-6 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-emerald-600 font-medium" 
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
                    {/* Added Amount Paid + Balance Due — the original only ever showed
                        Grand Total with no way to record that a customer paid an advance
                        or a partial amount against it, which the blueprint calls for
                        explicitly (progress/partial invoicing, §5.6). Balance Due auto-
                        computes and is what actually determines whether an invoice reads
                        Unpaid/Partially Paid/Paid, rather than that being a separate
                        manually-set field that could drift out of sync with the numbers. */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-end">
                        <div className="w-[300px] space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-emerald-600">
                                <span>Total Discount</span>
                                <span className="font-medium">- ₹{totalDiscount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>GST (18%)</span>
                                <span className="font-medium">₹{gst.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-3 text-xl font-black text-slate-900">
                                <span>Grand Total</span>
                                <span>₹{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-slate-600">
                                <span>Amount Paid</span>
                                <div className="relative w-32">
                                    <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max={grandTotal}
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(Math.min(Number(e.target.value) || 0, grandTotal))}
                                        className="w-full text-sm border border-slate-200 rounded-lg pl-6 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-medium"
                                    />
                                </div>
                            </div>
                            <div className={`flex justify-between font-bold ${balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                <span>Balance Due</span>
                                <span>₹{balanceDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-end">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    balanceDue <= 0 ? 'bg-emerald-50 text-emerald-700' :
                                    amountPaid > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {balanceDue <= 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid'}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        <Save className="w-4 h-4" /> {isNew ? 'Generate Invoice' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
