import { X, Image as ImageIcon, Type, AlignLeft, Search, Save, PackagePlus, Wrench, Package, Briefcase, Info, Clock, AlertTriangle } from 'lucide-react';

export default function ServiceDrawer({ service, isOpen, onClose }) {
    if (!isOpen) return null;

    const isNew = !service;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isNew ? 'New Service' : 'Edit Service'}
                        </h2>
                        {service && <p className="text-xs text-slate-500 font-mono mt-0.5">{service.id}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="max-w-xl mx-auto space-y-8">
                        
                        {/* Basic Info */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Type className="w-4 h-4" /> Basic Information</h3>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Service Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={service?.name || ''}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                    placeholder="e.g. Deep Home Cleaning (3 BHK)"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                                    <select 
                                        defaultValue={service?.category || ''}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Deep Cleaning">Deep Cleaning</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="AC Repair">AC Repair</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">URL Slug</label>
                                    <input 
                                        type="text" 
                                        defaultValue={service?.name ? service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Short Description</label>
                                <textarea 
                                    rows={2}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                                    placeholder="Brief summary shown on category pages..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Detailed Description (Terms)</label>
                                <textarea 
                                    rows={5}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                                    placeholder="Full terms, what is included, what is excluded..."
                                />
                            </div>
                        </div>

                        {/* Media */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> Media</h3>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Service Thumbnail (1:1)</label>
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 leading-relaxed mb-2">This image appears in the grid and search results. Upload a high quality square image.</p>
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-200">Upload Thumbnail</button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Service Gallery</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="aspect-square rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                    ))}
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                                        <span className="text-2xl font-light">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Operations & Specs */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Operations & Specifications</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Est. Duration</label>
                                    <input type="text" defaultValue={service?.duration || ''} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="e.g. 2 Hours" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Req. Professionals</label>
                                    <input type="number" defaultValue="1" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Warranty</label>
                                    <input type="text" defaultValue={service?.warranty || '30 Days'} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cancellation Allowed?</label>
                                    <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Visibility Toggles */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Info className="w-4 h-4" /> Visibility Flags</h3>
                            
                            <div className="space-y-3">
                                {[
                                    { id: 'status', label: 'Active Service', desc: 'Is this service currently available for booking?' },
                                    { id: 'featured', label: 'Featured', desc: 'Show this prominently on the homepage' },
                                    { id: 'popular', label: 'Popular', desc: 'Add a "Popular" badge to this service' }
                                ].map(flag => (
                                    <div key={flag.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{flag.label}</p>
                                            <p className="text-xs text-slate-500">{flag.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={flag.id === 'status' || (service && service[flag.id])} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements & Add-ons */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><PackagePlus className="w-4 h-4" /> Upsells & Requirements</h3>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Required Tools</label>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600">Vacuum Cleaner <X className="w-3 h-3 hover:text-rose-500 cursor-pointer" /></span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600">Scrubber <X className="w-3 h-3 hover:text-rose-500 cursor-pointer" /></span>
                                    <button className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-200">+ Add Tool</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Required Materials</label>
                                <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors">+ Select Required Materials</button>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Related Add-ons & Suggested Services</label>
                                <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors">+ Link Services for Upsell</button>
                            </div>
                        </div>

                        {/* Internal & SEO */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Search className="w-4 h-4" /> Instructions & SEO</h3>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Internal Service Instructions</label>
                                <textarea 
                                    rows={2}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-amber-50 placeholder:text-amber-700/50" 
                                    placeholder="Notes only visible to office staff and partners..."
                                />
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meta Title</label>
                                <input type="text" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meta Description</label>
                                <textarea rows={2} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        <Save className="w-4 h-4" /> Save Service
                    </button>
                </div>
            </div>
        </div>
    );
}
