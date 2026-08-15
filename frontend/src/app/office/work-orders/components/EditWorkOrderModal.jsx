'use client';
import Dialog from '@/components/office/ui/Dialog';

export default function EditWorkOrderModal({ isOpen, onClose, workOrder }) {
    if (!workOrder) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Edit Work Order ${workOrder.id}`} maxWidth="max-w-xl">
            <div className="p-6">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Partner</label>
                            <select defaultValue={workOrder.assignedTo} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="Unassigned">Unassigned</option>
                                <option value="Amit Kumar">Amit Kumar</option>
                                <option value="Vikram Singh">Vikram Singh</option>
                                <option value="Sunil Das">Sunil Das</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select defaultValue={workOrder.status} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="Pending Assignment">Pending Assignment</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Accepted">Accepted</option>
                                <option value="On The Way">On The Way</option>
                                <option value="Arrived">Arrived</option>
                                <option value="Work Started">Work Started</option>
                                <option value="Paused">Paused</option>
                                <option value="Completed">Completed</option>
                                <option value="Closed">Closed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule Date</label>
                            <input type="text" defaultValue={workOrder.date} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress (%)</label>
                            <input type="number" defaultValue={workOrder.progress} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" min="0" max="100" />
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
