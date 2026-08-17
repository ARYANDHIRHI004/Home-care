'use client';
import KanbanColumn from './KanbanColumn';

// Matches WorkOrder.status in work-order.model.js exactly — the field-
// execution state machine: open -> assigned -> accepted -> on_route ->
// in_progress -> completed -> invoiced -> paid, with declined looping back
// to reassignment. estimate_sent/approved are legacy values from before the
// current create/assign flow and are folded into the Open column.
const columns = [
    { id: 'open', title: 'Open', statusList: ['open', 'estimate_sent', 'approved'] },
    { id: 'assigned', title: 'Assigned', statusList: ['assigned'] },
    { id: 'accepted', title: 'Accepted', statusList: ['accepted'] },
    { id: 'on_route', title: 'On Route', statusList: ['on_route'] },
    { id: 'in_progress', title: 'In Progress', statusList: ['in_progress'] },
    { id: 'completed', title: 'Completed', statusList: ['completed'] },
    { id: 'invoiced', title: 'Invoiced', statusList: ['invoiced'] },
    { id: 'paid', title: 'Paid', statusList: ['paid'] },
    { id: 'declined', title: 'Declined', statusList: ['declined'] },
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
