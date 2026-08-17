import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useCreateFaqMutation, useUpdateFaqMutation } from '@/store/api/faqApi';
import { toast } from 'react-hot-toast';

export default function FaqDrawer({ faq, isOpen, onClose }) {
    const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
    const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
    const isLoading = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General',
        order: 0,
        active: true
    });

    const isPending = faq?.status === 'pending';

    useEffect(() => {
        if (faq) {
            setFormData({
                question: faq.question || '',
                answer: faq.answer || '',
                category: faq.category || 'General',
                order: faq.order || 0,
                active: faq.active !== false
            });
        } else {
            setFormData({
                question: '',
                answer: '',
                category: 'General',
                order: 0,
                active: true
            });
        }
    }, [faq, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (faq) {
                // A pending, customer-submitted question only becomes visible on
                // the website once it's answered and explicitly published here —
                // saving an edit to an already-published FAQ shouldn't require
                // re-publishing it.
                const payload = isPending
                    ? { ...formData, status: 'published', active: true }
                    : formData;
                await updateFaq({ id: faq._id, ...payload }).unwrap();
                toast.success(isPending ? 'FAQ published to the website' : 'FAQ updated successfully');
            } else {
                await createFaq(formData).unwrap();
                toast.success('FAQ created successfully');
            }
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isPending ? 'Review Question' : faq ? 'Edit FAQ' : 'New FAQ'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="faq-form" onSubmit={handleSubmit} className="space-y-5">

                        {isPending && (faq.submittedByName || faq.submittedByEmail) && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                                Submitted by {faq.submittedByName || 'a website visitor'}
                                {faq.submittedByEmail ? ` (${faq.submittedByEmail})` : ''}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Question <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.question}
                                onChange={e => setFormData(prev => ({ ...prev, question: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
                                placeholder="E.g., How do I book a service?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Answer <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.answer}
                                onChange={e => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm resize-none"
                                placeholder="Write the answer here..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
                                placeholder="E.g., Booking, Payment, Support"
                            />
                            <p className="text-xs text-slate-500 mt-1">Categories are used to group FAQs on the website.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={e => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
                            />
                            <p className="text-xs text-slate-500 mt-1">Lower numbers appear first.</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="faq-active"
                                checked={formData.active}
                                onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="faq-active" className="text-sm text-slate-700 font-medium">
                                Active on website
                            </label>
                        </div>

                    </form>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="faq-form"
                        type="submit"
                        disabled={isLoading || (isPending && !formData.answer.trim())}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isPending ? 'Publish to Website' : faq ? 'Save Changes' : 'Create FAQ'}
                    </button>
                </div>
            </div>
        </div>
    );
}
