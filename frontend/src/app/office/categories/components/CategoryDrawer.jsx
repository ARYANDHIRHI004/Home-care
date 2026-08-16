'use client';

import { useState, useEffect } from 'react';
import { X, Type, AlignLeft, Save, Loader2, Image as ImageIcon, ScrollText, History, ChevronDown } from 'lucide-react';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/store/api/categoryApi';
import { useGetTermsQuery } from '@/store/api/termsApi';
import ImageUploader from '@/components/common/ImageUploader';

export default function CategoryDrawer({ category, isOpen, onClose }) {
    const isNew = !category || !category._raw;
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [termsContent, setTermsContent] = useState('');
    const [active, setActive] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const categoryId = category?._raw?._id;
    const { data: previousVersions = [] } = useGetTermsQuery(
        categoryId ? `categoryId=${categoryId}&active=false` : '',
        { skip: !categoryId || !showHistory }
    );

    useEffect(() => {
        if (category && category._raw) {
            setName(category._raw.name || '');
            setSlug(category._raw.slug || '');
            setDescription(category._raw.description || '');
            setImageUrl(category._raw.imageUrl || '');
            setTermsContent(category._raw.terms?.content || '');
            setActive(category._raw.active !== false);
        } else {
            setName('');
            setSlug('');
            setDescription('');
            setImageUrl('');
            setTermsContent('');
            setActive(true);
        }
        setShowHistory(false);
        setErrorMsg('');
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleNameChange = (val) => {
        setName(val);
        if (isNew) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim()) {
            setErrorMsg('Category name is required');
            return;
        }

        const payload = {
            name: name.trim(),
            slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            termsContent: termsContent.trim(),
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
                className="w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {isNew ? 'New Category' : 'Edit Category'}
                        </h2>
                        {category && <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{category.name}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {errorMsg && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
                                {errorMsg}
                            </div>
                        )}

                        {/* Category Details */}
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                                <Type className="w-4 h-4 text-blue-500" /> Basic Details
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => handleNameChange(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                    placeholder="e.g. Deep Cleaning"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">URL Slug (Auto-generated)</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 font-mono text-slate-500"
                                    placeholder="e.g. deep-cleaning"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                    <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 resize-none"
                                    placeholder="Describe services included under this category..."
                                />
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={active}
                                        onChange={e => setActive(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                                    />
                                    Active & Visible to Customers
                                </label>
                            </div>
                        </div>

                        {/* Category Image */}
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-blue-500" /> Category Image
                            </h3>
                            <ImageUploader
                                value={imageUrl ? [imageUrl] : []}
                                onChange={(urls) => setImageUrl(urls[0] || '')}
                                maxFiles={1}
                                label="Upload Category Banner Image"
                                helpText="Recommended: 800x400px. JPG, PNG or WebP"
                            />
                        </div>

                        {/* Terms of Service */}
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                                <ScrollText className="w-4 h-4 text-blue-500" /> Terms of Service
                            </h3>
                            <label className="block text-[11px] text-slate-400 mb-2 font-normal">
                                Each category maintains its own versioned Terms of Service that are snapshotted during estimate approval.
                            </label>
                            <textarea
                                rows={6}
                                value={termsContent}
                                onChange={e => setTermsContent(e.target.value)}
                                className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 font-mono"
                                placeholder="Add terms specific to this service category..."
                            />

                            {/* Version history (only for editing) */}
                            {!isNew && category._raw?.terms?.version && (
                                <div className="mt-4 text-xs border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-800/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">Current Terms Version:</span>{' '}
                                            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-bold px-1.5 py-0.5 rounded">
                                                v{category._raw.terms.version}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowHistory(s => !s)}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline"
                                        >
                                            <History className="w-3.5 h-3.5" />
                                            View previous versions
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>

                                    {showHistory && (
                                        <div className="mt-3 space-y-2">
                                            {previousVersions.length === 0 && (
                                                <p className="text-slate-400 dark:text-slate-500">No previous versions — this category has only ever had v{category._raw.terms.version}.</p>
                                            )}
                                            {previousVersions.map(v => (
                                                <div key={v._id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-slate-500 dark:text-slate-400">v{v.version}</span>
                                                        <span className="text-slate-400 dark:text-slate-500">{new Date(v.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{v.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                                    <Save className="w-4 h-4" /> {isNew ? 'Create Category' : 'Save Category'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
