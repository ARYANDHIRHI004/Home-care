'use client';
import Dialog from '@/components/office/ui/Dialog';
import { AlertTriangle } from 'lucide-react';
import { useDeleteWorkOrderMutation } from '@/store/api/workOrderApi';

export default function DeleteWorkOrderDialog({ isOpen, onClose, workOrder }) {
    const [deleteWorkOrder, { isLoading }] = useDeleteWorkOrderMutation();

    if (!workOrder) return null;

    const handleDelete = async () => {
        try {
            await deleteWorkOrder(workOrder.id).unwrap();
            onClose();
        } catch (err) {
            console.error('Failed to delete work order:', err);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
            <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Delete Work Order?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Are you sure you want to delete work order <span className="font-semibold text-slate-700 dark:text-slate-300">{workOrder.displayId || workOrder.id}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={isLoading} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm">
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
