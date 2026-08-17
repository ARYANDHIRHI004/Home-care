import { X, FileText, Download, Send, CheckCircle2, Clock, AlertTriangle, FileEdit, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function InvoiceDrawer({ invoice, isOpen, onClose }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    if (!isOpen || !invoice) return null;

    // Matches Invoice.paymentStatus's real enum (unpaid/partial/paid).
    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case 'partial': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Partial</span>;
            case 'unpaid': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200"><FileEdit className="w-3 h-3" /> Unpaid</span>;
            default: return null;
        }
    };

    const lineItems = invoice._raw?.lineItems?.length ? invoice._raw.lineItems : [];
    const subtotal = lineItems.reduce((sum, li) => sum + (li.qty || 0) * (li.price || 0), 0);

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/invoices/${invoice._raw._id || invoice.id}/pdf`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Failed to generate PDF: ${response.status} ${errText}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoice._raw?.invoiceNumber || invoice.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSendInvoice = async () => {
        try {
            setIsSending(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/invoices/${invoice._raw._id || invoice.id}/send`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send invoice');

            if (data.message && data.message.includes('WhatsApp')) {
                toast.success('No email on file. Share the PDF via WhatsApp instead.', { duration: 5000 });
            } else {
                toast.success(data.message || 'Invoice sent successfully');
            }
        } catch (error) {
            console.error('Send error:', error);
            toast.error(error.message || 'Failed to send invoice');
        } finally {
            setIsSending(false);
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
                            <div className="text-right flex items-center flex-col  ">
                                {/* <div className="w-10 h-10 rounded-lg "> */}
                                    <img src='/logo.png' className='w-12 h-12' />
                                    {/* </div> */}
                                <h3 className="text-sm font-bold text-slate-900">HomeCare Ltd.</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">GSTIN: 22AAAAA0000A1Z5</p>
                                <p className="text-[10px] text-slate-500">homecarre2405@gmail.com</p>
                            </div> 
                        </div>

                        {/* Customer & Booking Details */}
                        <div className="p-8 border-b border-slate-100 flex justify-between text-sm">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
                                <p className="font-bold text-slate-900">{invoice.customer}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Work Order Reference</p>
                                <p className="font-bold text-slate-900">{invoice.booking}</p>
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
                                    {lineItems.length === 0 ? (
                                        <tr><td colSpan={4} className="py-4 text-center text-slate-400">No line items</td></tr>
                                    ) : lineItems.map((li, i) => (
                                        <tr key={i}>
                                            <td className="py-4">
                                                <p className="font-semibold text-slate-900">{li.name}</p>
                                            </td>
                                            <td className="py-4 text-center font-medium text-slate-700">{li.qty}</td>
                                            <td className="py-4 text-right font-medium text-slate-700">₹{Number(li.price).toLocaleString()}</td>
                                            <td className="py-4 text-right font-bold text-slate-900">₹{(li.qty * li.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Summary */}
                            <div className="w-1/2 ml-auto mt-6 space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                                </div>
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-medium">- ₹{invoice.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>18% GST</span>
                                    <span className="font-medium">₹{invoice.gst?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-900 pt-3 text-lg font-black text-slate-900">
                                    <span>Total</span>
                                    <span>₹{invoice.total?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* "PAID" Watermark overlay if paid */}
                        {invoice.status === 'paid' && (
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
                    {invoice.status !== 'paid' && (
                        <button
                            onClick={async () => {
                                try {
                                    setIsSending(true);
                                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/invoices/${invoice._raw._id || invoice.id}/payment-status`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ paymentStatus: 'paid' }),
                                        credentials: 'include'
                                    });
                                    if (!response.ok) throw new Error('Failed to update status');
                                    toast.success('Invoice marked as paid');
                                    window.location.reload(); // Quickest way to refresh the dashboard
                                } catch (err) {
                                    toast.error('Failed to mark as paid');
                                } finally {
                                    setIsSending(false);
                                }
                            }}
                            disabled={isSending || isDownloading}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark as Paid
                        </button>
                    )}
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading || isSending}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isDownloading ? 'Downloading...' : 'PDF'}
                    </button>
                    <button
                        onClick={handleSendInvoice}
                        disabled={isSending || isDownloading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {isSending ? 'Sending...' : 'Send Invoice'}
                    </button>
                </div>
            </div>
        </div>
    );
}
