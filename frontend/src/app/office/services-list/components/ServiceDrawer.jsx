'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Type, AlignLeft, Save, Briefcase, IndianRupee, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useCreateServiceMutation, useUpdateServiceMutation } from '@/store/api/serviceApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import ImageUploader from '@/components/common/ImageUploader';

export default function ServiceDrawer({ service, isOpen, onClose }) {
    const isNew = !service || !service._raw;
    const { data: categories = [] } = useGetCategoriesQuery();
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [visitCharges, setVisitCharges] = useState('0');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (service && service._raw) {
            setName(service._raw.name || '');
            setCategoryId(service._raw.categoryId?._id || service._raw.categoryId || '');
            setBasePrice(String(service._raw.basePrice || ''));
            setVisitCharges(String(service._raw.visitCharges || '0'));
            setDescription(service._raw.description || '');
            setImages(service._raw.images || []);
        } else if (service) {
            setName(service.name || '');
            setBasePrice(String(service.basePrice || ''));
            setDescription(service.description || '');
            setImages(service.images || []);
        } else {
            setName('');
            setCategoryId(categories[0]?._id || '');
            setBasePrice('');
            setVisitCharges('0');
            setDescription('');
            setImages([]);
        }
        setErrorMsg('');
    }, [service, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim()) {
            setErrorMsg('Service name is required');
            return;
        }

        if (!categoryId && categories.length > 0) {
            setErrorMsg('Please select a category');
            return;
        }

        const payload = {
            name: name.trim(),
            categoryId: categoryId || categories[0]?._id,
            basePrice: Number(basePrice) || 0,
            visitCharges: Number(visitCharges) || 0,
            description: description.trim(),
            images,
        };

        try {
            if (service && service._raw && service._raw._id) {
                await updateService({ id: service._raw._id, ...payload }).unwrap();
            } else {
                await createService(payload).unwrap();
            }
            onClose();
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to save service.');
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {isNew ? 'New Service' : 'Edit Service'}
                        </h2>
                        {service && <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{service.id}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-6">
                    {errorMsg && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
                            {errorMsg}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5"><Type className="w-4 h-4" /> Basic Information</h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Service Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                placeholder="e.g. Deep Home Cleaning (3 BHK)"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                                <select
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 cursor-pointer"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                    {categories.length === 0 && (
                                        <>
                                            <option value="Deep Cleaning">Deep Cleaning</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="AC Repair">AC Repair</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Base Price (₹) *</label>
                                <input
                                    type="number"
                                    value={basePrice}
                                    onChange={e => setBasePrice(e.target.value)}
                                    placeholder="499"
                                    className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Visit / Inspection Charges (₹)</label>
                            <input
                                type="number"
                                value={visitCharges}
                                onChange={e => setVisitCharges(e.target.value)}
                                placeholder="0"
                                className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <AlignLeft className="w-3.5 h-3.5" /> Description & Inclusions
                            </label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 resize-none"
                                placeholder="Details about this service, scope of work, etc."
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> Service Images</h3>
                        <ImageUploader
                            value={images}
                            onChange={setImages}
                            folder="services"
                            maxFiles={6}
                            label="Upload service images"
                            helpText="Shown to customers on the booking page — up to 6 images, 5MB each."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3">
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
                                    <Save className="w-4 h-4" /> {isNew ? 'Create Service' : 'Save Changes'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
