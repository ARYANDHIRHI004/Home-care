import { X, Upload, IndianRupee } from 'lucide-react';

export default function ExpenseModal({ expense, isOpen, onClose }) {
    if (!isOpen) return null;

    const isNew = !expense;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">{isNew ? 'Add Expense' : 'Edit Expense'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Amount</label>
                            <input 
                                type="number" 
                                defaultValue={expense?.amount || ''}
                                className="w-full text-lg font-bold border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                            <select defaultValue={expense?.category || ''} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                <option>Fuel</option>
                                <option>Cleaning Materials</option>
                                <option>Office Rent</option>
                                <option>Electricity</option>
                                <option>Internet</option>
                                <option>Marketing</option>
                                <option>Salary</option>
                                <option>Partner Advance</option>
                                <option>Transport</option>
                                <option>Maintenance</option>
                                <option>Miscellaneous</option>
                            </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Method</label>
                            <select defaultValue={expense?.method || ''} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                <option>Corporate Card</option>
                                <option>UPI</option>
                                <option>Bank Transfer</option>
                                <option>Petty Cash</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                            <input type="text" defaultValue={expense?.description || ''} placeholder="e.g. Monthly fuel allowance" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Vendor (Optional)</label>
                            <input type="text" defaultValue={expense?.vendor || ''} placeholder="e.g. IndianOil" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Date</label>
                            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Upload Receipt</label>
                            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:border-blue-300 transition-colors">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                                    <Upload className="w-4 h-4" />
                                </div>
                                {expense?.receipt ? 'Update attached receipt' : 'Click to attach receipt (Optional)'}
                            </button>
                        </div>
                        
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Notes</label>
                            <textarea rows={2} placeholder="Internal notes..." className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Save Expense
                    </button>
                </div>
            </div>
        </div>
    );
}
