'use client';
import Dialog from '@/components/office/ui/Dialog';

export default function EditEnquiryModal({ isOpen, onClose, enquiry }) {
    if (!enquiry) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Edit Enquiry ${enquiry.id}`} maxWidth="max-w-2xl">
            <div className="p-6">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                            <input type="text" defaultValue={enquiry.customer} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                            <input type="tel" defaultValue={enquiry.phone} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Specific Service</label>
                            <select defaultValue={enquiry.service} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="AC Deep Cleaning">AC Deep Cleaning</option>
                                <option value="Full Home Cleaning">Full Home Cleaning</option>
                                <option value="Plumbing Repair">Plumbing Repair</option>
                                <option value="Electrical Work">Electrical Work</option>
                                <option value="Pest Control">Pest Control</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select defaultValue={enquiry.status} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Requirement Understood">Requirement Understood</option>
                                <option value="Estimate Sent">Estimate Sent</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
