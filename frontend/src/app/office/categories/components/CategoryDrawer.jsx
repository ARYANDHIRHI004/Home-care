import { X, Image as ImageIcon, Smile, Type, AlignLeft, Search, Check, Save } from 'lucide-react';
import { useState } from 'react';

export default function CategoryDrawer({ category, isOpen, onClose }) {
    if (!isOpen) return null;

    const isNew = !category;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isNew ? 'New Category' : 'Edit Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                    
                    {/* Basic Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Basic Information</h3>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Category Name</label>
                            <input 
                                type="text" 
                                defaultValue={category?.name || ''}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                placeholder="e.g. Deep Cleaning"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">URL Slug</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                                    homecare.com/
                                </span>
                                <input 
                                    type="text" 
                                    defaultValue={category?.slug || ''}
                                    className="flex-1 text-sm border border-slate-200 rounded-r-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                    placeholder="deep-cleaning"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Short Description</label>
                            <textarea 
                                rows={3}
                                defaultValue={category?.description || ''}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                                placeholder="Describe this category to your customers..."
                            />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                        <h3 className="text-sm font-semibold text-slate-900">Media & Visuals</h3>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Banner Image</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-medium text-blue-600">Click to upload banner image</p>
                                <p className="text-xs text-slate-500 mt-1">Recommended size: 1200 x 400px (16:9)</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><Smile className="w-3.5 h-3.5" /> Category Icon</label>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-xl border border-slate-200 flex items-center justify-center text-2xl bg-white shadow-sm`}>
                                    {category ? category.name.charAt(0) : '✨'}
                                </div>
                                <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                    Choose Icon
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Search className="w-4 h-4" /> SEO Settings</h3>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meta Title</label>
                            <input 
                                type="text" 
                                defaultValue={category?.name ? `${category.name} Services | HomeCare` : ''}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meta Description</label>
                            <textarea 
                                rows={2}
                                defaultValue={category?.description || ''}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                            />
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Display Settings</h3>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
                                <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                    <option value="active">Active (Visible)</option>
                                    <option value="inactive">Inactive (Hidden)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Display Order</label>
                                <input 
                                    type="number" 
                                    defaultValue={category?.order || 1}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        <Save className="w-4 h-4" /> Save Category
                    </button>
                </div>
            </div>
        </div>
    );
}
