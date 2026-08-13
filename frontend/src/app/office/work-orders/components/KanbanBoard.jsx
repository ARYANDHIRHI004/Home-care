'use client';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ workOrders, onCardClick }) {
    // Added 'Declined' (a partner turned the job down — previously had no column at
    // all, so a declined order would just disappear from the board and sit invisible
    // until someone happened to check the table view) and split billing out into its
    // own 'Invoiced'/'Paid' columns so a Completed job's payment status is visible
    // instead of the workflow appearing to just stop.
    const columns = [
        { id: 'declined', title: 'Declined', statusList: ['Declined'] },
        { id: 'assigned', title: 'Assigned', statusList: ['Assigned', 'Pending Assignment'] },
        { id: 'accepted', title: 'Accepted', statusList: ['Accepted'] },
        { id: 'on-route', title: 'On Route', statusList: ['On Route', 'Professional On The Way'] },
        { id: 'in-progress', title: 'In Progress', statusList: ['In Progress'] },
        { id: 'completed', title: 'Completed', statusList: ['Completed', 'Closed'] },
        { id: 'billing', title: 'Invoiced / Paid', statusList: ['Invoiced', 'Paid'] },
    ];

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
