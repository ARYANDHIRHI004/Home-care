import { X, IndianRupee } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetEnumsQuery } from '@/store/api/configApi';
import { useUpdatePaymentMutation, useVerifyPaymentMutation } from '@/store/api/paymentApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// This row IS an existing Payment document (see PaymentTable — p._id,
// p.status), not a new one being created. "Receive Payment" really means
// "confirm this payment came through" — the real backend action is
// verifyPayment, not a second createPayment call. Method/reference can be
// corrected first via updatePayment if they were recorded wrong, since both
// are real Payment fields; amount is shown read-only rather than editable —
// changing what was actually paid after the fact isn't something to expose
// as a casual form field. Payment Date, screenshot upload, and internal
// notes were removed: the Payment model has no fields for any of them.
export default function ReceivePaymentModal({ payment, isOpen, onClose }) {
    const { data: enums = {} } = useGetEnumsQuery();
    const [updatePayment] = useUpdatePaymentMutation();
    const [verifyPayment, { isLoading: isVerifying, error: verifyError }] = useVerifyPaymentMutation();

    const [method, setMethod] = useState('');
    const [txnRef, setTxnRef] = useState('');

    useEffect(() => {
        if (!payment) return;
        setMethod(payment._raw?.method || '');
        setTxnRef(payment._raw?.razorpayTxnId || '');
    }, [payment]);

    if (!isOpen || !payment) return null;

    async function handleConfirm() {
        try {
            const original = payment._raw || {};
            if (method !== original.method || txnRef !== (original.razorpayTxnId || '')) {
                await updatePayment({ id: payment.id, method, razorpayTxnId: txnRef || undefined }).unwrap();
            }
            await verifyPayment({ id: payment.id, invoiceId: original.invoiceId?._id || original.invoiceId }).unwrap();
            onClose();
        } catch {
            // verifyError below already surfaces this
        }
    }

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
                            <span className="text-xs font-semibold text-slate-600">Amount</span>
                            <span className="text-sm font-bold text-rose-600 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{payment.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Method</label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                                {(enums.payment?.method || ['cash', 'upi', 'razorpay']).map(m => (
                                    <option key={m} value={m}>{formatEnum(m)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Transaction Ref.</label>
                            <input
                                type="text"
                                value={txnRef}
                                onChange={(e) => setTxnRef(e.target.value)}
                                placeholder="e.g. UPI ID / Razorpay txn ID"
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>

                    {verifyError && (
                        <p className="text-xs text-rose-600">{verifyError.data?.message || 'Could not confirm this payment.'}</p>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isVerifying}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isVerifying ? 'Confirming…' : 'Confirm Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
}
