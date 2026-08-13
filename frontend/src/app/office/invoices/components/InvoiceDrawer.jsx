import { X, FileText, Download, Send, CheckCircle2, Clock, AlertTriangle, FileEdit } from 'lucide-react';

export default function InvoiceDrawer({ invoice, isOpen, onClose }) {
    if (!isOpen || !invoice) return null;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case 'Sent': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200"><Send className="w-3 h-3" /> Sent</span>;
            case 'Draft': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200"><FileEdit className="w-3 h-3" /> Draft</span>;
            case 'Overdue': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200"><Clock className="w-3 h-3" /> Overdue</span>;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" /> Invoice Details
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">{invoice.id} • {invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(invoice.status)}
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body - Realistic Invoice Preview */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden max-w-[600px] mx-auto relative">
                        
                        {/* Invoice Header */}
                        <div className="p-8 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">INVOICE</h1>
                                <p className="text-sm font-bold text-slate-500">#{invoice.id}</p>
                                <p className="text-xs text-slate-400 mt-1">Date: {invoice.date}</p>
                            </div>
                            <div className="text-right">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl ml-auto mb-2">H</div>
                                <h3 className="text-sm font-bold text-slate-900">HomeCare Ltd.</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">GSTIN: 22AAAAA0000A1Z5</p>
                                <p className="text-[10px] text-slate-500">support@homecare.in</p>
                            </div>
                        </div>

                        {/* Customer & Booking Details */}
                        <div className="p-8 border-b border-slate-100 flex justify-between text-sm">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
                                <p className="font-bold text-slate-900">{invoice.customer}</p>
                                <p className="text-slate-500 text-xs mt-1">123 Linking Road, Bandra West<br/>Mumbai, Maharashtra 400050</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Booking Reference</p>
                                <p className="font-bold text-slate-900">{invoice.booking}</p>
                                <p className="text-slate-500 text-xs mt-1">Deep Cleaning Service</p>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="p-8">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-slate-900">
                                        <th className="text-left pb-3 font-bold text-slate-900">Service Description</th>
                                        <th className="text-center pb-3 font-bold text-slate-900">Qty</th>
                                        <th className="text-right pb-3 font-bold text-slate-900">Price</th>
                                        <th className="text-right pb-3 font-bold text-slate-900">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="border-b border-slate-200">
                                    <tr>
                                        <td className="py-4">
                                            <p className="font-semibold text-slate-900">3 BHK Deep Cleaning</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Includes bathroom, kitchen, balcony and living areas.</p>
                                        </td>
                                        <td className="py-4 text-center font-medium text-slate-700">1</td>
                                        <td className="py-4 text-right font-medium text-slate-700">₹{invoice.subtotal.toLocaleString()}</td>
                                        <td className="py-4 text-right font-bold text-slate-900">₹{invoice.subtotal.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Summary */}
                            <div className="w-1/2 ml-auto mt-6 space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{invoice.subtotal.toLocaleString()}</span>
                                </div>
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-medium">- ₹{invoice.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>GST (18%)</span>
                                    <span className="font-medium">₹{invoice.gst.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-900 pt-3 text-lg font-black text-slate-900">
                                    <span>Total</span>
                                    <span>₹{invoice.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        <div className="px-8 pb-8 text-xs text-slate-500">
                            <p className="font-bold text-slate-700 mb-1">Notes</p>
                            <p>Thank you for choosing HomeCare. Payment is due within 7 days of invoice generation. Late payments may incur an additional fee of 1.5% per month.</p>
                        </div>

                        {/* "PAID" Watermark overlay if paid */}
                        {invoice.status === 'Paid' && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-10">
                                <span className="text-8xl font-black text-emerald-600 border-8 border-emerald-600 px-8 py-2 rounded-xl">PAID</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Close
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        <Send className="w-4 h-4" /> Send Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
