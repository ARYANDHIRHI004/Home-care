import { X, Receipt, Phone, User, Calendar, History, CheckCircle2, AlertCircle, Clock, AlertTriangle } from 'lucide-react';

export default function PaymentDrawer({ payment, isOpen, onClose, onReceivePayment }) {
    if (!isOpen || !payment) return null;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case 'Pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
            case 'Partial': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200"><AlertCircle className="w-3 h-3" /> Partial</span>;
            case 'Failed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Failed</span>;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-blue-600" /> Payment Details
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">{payment.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(payment.status)}
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Amount Summary Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl border border-slate-800">
                        <div className="absolute top-0 right-0 p-16 bg-blue-500/20 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-widest">Total Invoice Amount</p>
                            <h3 className="text-4xl font-black tracking-tight mb-6">₹{payment.amount.toLocaleString()}</h3>
                            
                            <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 grid grid-cols-2 gap-4 border border-white/10">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Paid</p>
                                    <p className="text-lg font-bold text-emerald-400">₹{payment.paid.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Due</p>
                                    <p className="text-lg font-bold text-rose-400">₹{payment.due.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer & References */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">References</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><User className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Customer</p>
                                        <p className="text-sm font-bold text-slate-900">{payment.customer}</p>
                                    </div>
                                </div>
                                <a href={`tel:${payment.phone}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"><Phone className="w-4 h-4" /></a>
                            </div>

                            <div className="h-px bg-slate-100 w-full"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Booking ID</p>
                                    <a href="#" className="text-sm font-bold text-blue-600 hover:underline">{payment.booking}</a>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Invoice No</p>
                                    <a href="#" className="text-sm font-bold text-blue-600 hover:underline">{payment.invoice}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-600" /> Payment Timeline
                            </h3>
                        </div>
                        <div className="p-5 space-y-6">
                            
                            {payment.paid > 0 ? (
                                <div className="relative pl-6 border-l-2 border-emerald-100 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-white"></div>
                                        <p className="text-xs font-bold text-slate-900">{payment.date}</p>
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-slate-900">₹{payment.paid.toLocaleString()}</span>
                                                <span className="text-xs font-medium text-slate-500">{payment.method}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400">Collected by {payment.collector}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-slate-200 rounded-full ring-4 ring-white"></div>
                                        <p className="text-xs font-bold text-slate-500">Invoice Generated</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Amount: ₹{payment.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-700">No payments recorded yet</p>
                                    <p className="text-xs text-slate-500 mt-1">Invoice was generated but payment is pending.</p>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                        Download Receipt
                    </button>
                    {(payment.status === 'Pending' || payment.status === 'Partial' || payment.status === 'Failed') && (
                        <button 
                            onClick={() => onReceivePayment(payment)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Receive Payment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
