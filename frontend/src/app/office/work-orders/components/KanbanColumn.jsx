'use client';
import WorkOrderCard from './WorkOrderCard';

export default function KanbanColumn({ title, workOrders, onCardClick }) {
    return (
        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 w-80 min-w-[320px] max-h-full transition-colors">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md z-10 rounded-t-2xl transition-colors">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {title}
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">
                        {workOrders.length}
                    </span>
                </h3>
            </div>
            <div className="p-3 overflow-y-auto flex-1 space-y-3 kanban-scrollbar">
                {workOrders.map(wo => (
                    <WorkOrderCard key={wo.id} wo={wo} onClick={() => onCardClick(wo)} />
                ))}
                {workOrders.length === 0 && (
                    <div className="text-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-2 transition-colors">
                        <p className="text-sm text-slate-400 dark:text-slate-500">No work orders</p>
                    </div>
                )}
            </div>
        </div>
    );
}
