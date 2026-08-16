'use client';
import KanbanColumn from './KanbanColumn';

// Matches WorkOrder.status in work-order.model.js exactly:
// open/estimate_sent/approved/assigned/in_progress/completed/closed. A prior
// fix here added 'Declined'/'Invoiced'/'Paid' columns for states that don't
// exist anywhere in the schema — none of these seven real values are Title
// Case or spaced like that, so every column filter silently matched zero
// work orders and the whole board rendered empty regardless of real data.
// Tracking partner-decline or invoicing status would need new fields on the
// WorkOrder schema; that's a data-model change, not something a column
// label can paper over.
const columns = [
    { id: 'open', title: 'Open', statusList: ['open'] },
    { id: 'estimate_sent', title: 'Estimate Sent', statusList: ['estimate_sent'] },
    { id: 'approved', title: 'Approved', statusList: ['approved'] },
    { id: 'assigned', title: 'Assigned', statusList: ['assigned'] },
    { id: 'in_progress', title: 'In Progress', statusList: ['in_progress'] },
    { id: 'completed', title: 'Completed', statusList: ['completed'] },
    { id: 'closed', title: 'Closed', statusList: ['closed'] },
];

export default function KanbanBoard({ workOrders, onCardClick }) {
    return (
        <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[600px] items-start">
            {columns.map(col => {
                const columnOrders = workOrders.filter(wo => col.statusList.includes(wo.status));
                return (
                    <KanbanColumn 
                        key={col.id} 
                        title={col.title} 
                        workOrders={columnOrders} 
                        onCardClick={onCardClick} 
                    />
                );
            })}
        </div>
    );
}
