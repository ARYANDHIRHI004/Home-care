import { X, Upload, IndianRupee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '@/store/api/expenseApi';
import { useGetEnumsQuery } from '@/store/api/configApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function ExpenseModal({ expense, isOpen, onClose }) {
    const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
    const { data: enums = {} } = useGetEnumsQuery();
    
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Miscellaneous',
        paymentMethod: 'Corporate Card',
        description: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        receiptUrl: '' // We aren't handling actual file upload yet, just strings
    });

    useEffect(() => {
        if (expense && isOpen) {
            setFormData({
                amount: expense.amount || '',
                category: expense.category || 'Miscellaneous',
                paymentMethod: expense.method || 'Corporate Card',
                description: expense.description || '',
                vendor: expense.vendor || '',
                date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                receiptUrl: expense.receiptUrl || ''
            });
        } else if (!expense && isOpen) {
            setFormData({
                amount: '',
                category: 'Miscellaneous',
                paymentMethod: 'Corporate Card',
                description: '',
                vendor: '',
                date: new Date().toISOString().split('T')[0],
                receiptUrl: ''
            });
        }
    }, [expense, isOpen]);

    if (!isOpen) return null;

    const isNew = !expense;
    const isLoading = isCreating || isUpdating;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (isNew) {
                await createExpense(formData).unwrap();
            } else {
                await updateExpense({ id: expense.id, ...formData }).unwrap();
            }
            onClose();
        } catch (error) {
            console.error('Failed to save expense:', error);
            alert('Failed to save expense. Please try again.');
        }
    };

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
                                name="amount"
                                type="number" 
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full text-lg font-bold border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
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
                            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                {(enums.expense?.paymentMethod || ['Corporate Card', 'UPI', 'Bank Transfer', 'Petty Cash', 'Cash', 'Other']).map(m => (
                                    <option key={m} value={m}>{formatEnum(m)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                            <input name="description" type="text" value={formData.description} onChange={handleChange} placeholder="e.g. Monthly fuel allowance" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Vendor (Optional)</label>
                            <input name="vendor" type="text" value={formData.vendor} onChange={handleChange} placeholder="e.g. IndianOil" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Date</label>
                            <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
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
                    <button onClick={handleSave} disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                        {isLoading ? 'Saving...' : 'Save Expense'}
                    </button>
                </div>
            </div>
        </div>
    );
}
