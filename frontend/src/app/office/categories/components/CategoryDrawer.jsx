'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Type, AlignLeft, Save, Loader2 } from 'lucide-react';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/store/api/categoryApi';

export default function CategoryDrawer({ category, isOpen, onClose }) {
    const isNew = !category || !category._raw;
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (category && category._raw) {
            setName(category._raw.name || '');
            setDescription(category._raw.description || '');
            setActive(category._raw.active !== false);
        } else if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
            setActive(category.status === 'Active');
        } else {
            setName('');
            setDescription('');
            setActive(true);
        }
        setErrorMsg('');
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim()) {
            setErrorMsg('Category name is required');
            return;
        }

        const payload = {
            name: name.trim(),
            description: description.trim(),
            active: Boolean(active),
        };

        try {
            if (category && category._raw && category._raw._id) {
                await updateCategory({ id: category._raw._id, ...payload }).unwrap();
            } else {
                await createCategory(payload).unwrap();
            }
            onClose();
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to save category.');
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isNew ? 'New Category' : 'Edit Category'}
                        </h2>
                        {category && <p className="text-xs text-slate-500 font-mono mt-0.5">{category.name}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Type className="w-4 h-4" /> Category Details</h3>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category Name *</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                placeholder="e.g. Deep Cleaning"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <AlignLeft className="w-3.5 h-3.5" /> Description
                            </label>
                            <textarea 
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                                placeholder="Describe services included under this category..."
                            />
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                                <input 
                                    type="checkbox"
                                    checked={active}
                                    onChange={e => setActive(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                                Active & Visible to Customers
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> {isNew ? 'Create Category' : 'Save Changes'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
