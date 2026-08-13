import { X, Upload, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function ReceivePaymentModal({ payment, isOpen, onClose }) {
    const [amount, setAmount] = useState(payment ? payment.due : '');

    if (!isOpen || !payment) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">Receive Payment</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Customer Info Context */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Customer Details</p>
                        <p className="text-sm font-bold text-slate-900">{payment.customer}</p>
                        <p className="text-xs text-slate-600 mt-0.5">Booking: {payment.booking} | Inv: {payment.invoice}</p>
                        <div className="mt-3 flex items-center justify-between pt-3 border-t border-blue-100/50">
                            <span className="text-xs font-semibold text-slate-600">Amount Due</span>
                            <span className="text-sm font-bold text-rose-600">₹{payment.due.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Received Amount</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full text-lg font-bold border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Method</label>
                            <select className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                <option>UPI</option>
                                <option>Cash</option>
                                <option>Credit/Debit Card</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Transaction Ref.</label>
                                <input type="text" placeholder="e.g. UPI ID / Check No" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Date</label>
                                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Upload Screenshot/Receipt</label>
                            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:border-blue-300 transition-colors">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                                    <Upload className="w-4 h-4" />
                                </div>
                                Click to upload payment proof (Optional)
                            </button>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Internal Notes</label>
                            <textarea rows={2} placeholder="Optional notes for finance team..." className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
