'use client';
import { useState, useEffect } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useUpdateEnquiryMutation } from '@/store/api/enquiryApi';
import { useGetEnumsQuery } from '@/store/api/configApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function EditEnquiryModal({ isOpen, onClose, enquiry }) {
    const [updateEnquiry, { isLoading }] = useUpdateEnquiryMutation();
    const { data: enums = {} } = useGetEnumsQuery();
    const { data: categories = [] } = useGetCategoriesQuery('active=true');
    const [form, setForm] = useState({ serviceCategory: '', status: 'new', priority: 'normal', description: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (enquiry) {
            setForm({
                serviceCategory: enquiry.service || enquiry._raw?.serviceCategory || '',
                // enquiry.status is already the raw backend value (lowercase:
                // new/contacted/qualified/converted/dropped) — this used to
                // default to 'New' (Title Case), which isn't a valid option
                // in the select below and would never actually match.
                status: enquiry.status || 'new',
                priority: enquiry.priority || 'normal',
                description: enquiry._raw?.description || '',
            });
        }
    }, [enquiry]);

    if (!enquiry) return null;

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await updateEnquiry({ id: enquiry.id, ...form }).unwrap();
            onClose();
        } catch (err) {
            setError(err?.data?.message || 'Failed to update enquiry.');
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Edit Enquiry ${enquiry.displayId || enquiry.id}`} maxWidth="max-w-2xl">
            <div className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                            <input type="text" readOnly value={enquiry.customer} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                            <p className="text-xs text-slate-400">Edit customer details from the Customers page.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                            <input type="tel" readOnly value={enquiry.phone} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Category</label>
                            <select name="serviceCategory" value={form.serviceCategory} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                {(enums.enquiry?.status || ['new', 'contacted', 'qualified', 'converted', 'dropped']).map(s => (
                                    <option key={s} value={s}>{formatEnum(s)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                {(enums.workOrder?.priority || ['low', 'normal', 'high']).map(p => (
                                    <option key={p} value={p}>{formatEnum(p)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description / Problem</label>
                        <textarea
                            name="description" value={form.description} onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Description of the requirement..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
