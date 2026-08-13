'use client';
import { useState } from 'react';
import { RefreshCw, Download, Plus, LayoutGrid, List } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import WorkOrderStatsCards from './components/WorkOrderStatsCards';
import WorkOrderFilters from './components/WorkOrderFilters';
import WorkOrderTable from './components/WorkOrderTable';
import WorkOrderDrawer from './components/WorkOrderDrawer';
import CreateWorkOrderModal from './components/CreateWorkOrderModal';
import EditWorkOrderModal from './components/EditWorkOrderModal';
import DeleteWorkOrderDialog from './components/DeleteWorkOrderDialog';
import KanbanBoard from './components/KanbanBoard';

export default function WorkOrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Status values must exactly match KanbanBoard.jsx's column statusList entries —
    // 'Work Started' below used to silently vanish from the Kanban view entirely,
    // since no column's statusList contained that string (it only recognizes
    // 'In Progress'). Fixed here, and two more real states added — 'Declined'
    // (partner turned the job down, needs reassignment — previously had nowhere to
    // go) and 'Invoiced'/'Paid' (so a completed job's billing status is visible
    // instead of the flow silently stopping at "Completed").
    const mockOrders = [
        { id: 'WO-10592', bookingId: 'BKG-8492', customer: 'Priya Patel', service: 'Deep Home Cleaning', assignedTo: 'Amit Kumar', date: 'Oct 25, 2023, 10:00 AM', status: 'In Progress', priority: 'High', createdDate: 'Oct 24, 2023' },
        { id: 'WO-10591', bookingId: 'BKG-8491', customer: 'Rahul Sharma', service: 'AC Repair & Service', assignedTo: 'Unassigned', date: 'Oct 25, 2023, 2:00 PM', status: 'Pending Assignment', priority: 'Normal', createdDate: 'Oct 24, 2023' },
        { id: 'WO-10590', bookingId: 'BKG-8490', customer: 'Sneha Gupta', service: 'Plumbing Service', assignedTo: 'Vikram Singh', date: 'Oct 25, 2023, 9:00 AM', status: 'Paid', priority: 'Normal', createdDate: 'Oct 23, 2023' },
        { id: 'WO-10589', bookingId: 'BKG-8489', customer: 'Arjun Mehta', service: 'Electrical Repair', assignedTo: 'Sunil Das', date: 'Oct 26, 2023, 11:00 AM', status: 'Assigned', priority: 'Emergency', createdDate: 'Oct 24, 2023' },
        { id: 'WO-10588', bookingId: 'BKG-8488', customer: 'Kavya Nair', service: 'Pest Control', assignedTo: 'Manoj T.', date: 'Oct 25, 2023, 1:00 PM', status: 'On Route', priority: 'Normal', createdDate: 'Oct 23, 2023' },
        { id: 'WO-10587', bookingId: 'BKG-8487', customer: 'Deepak Chopra', service: 'AC Servicing', assignedTo: 'Unassigned', date: 'Oct 26, 2023, 3:00 PM', status: 'Declined', priority: 'Normal', createdDate: 'Oct 24, 2023' },
        { id: 'WO-10586', bookingId: 'BKG-8486', customer: 'Sunita Sharma', service: 'Kitchen Remodeling', assignedTo: 'Amit Kumar', date: 'Oct 24, 2023, 9:00 AM', status: 'Invoiced', priority: 'Normal', createdDate: 'Oct 22, 2023' },
    ];

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        setIsDrawerOpen(true);
    };

    const handleEditClick = (order) => {
        setOrderToEdit(order);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '#' },
        { label: 'Operations', href: '#' },
        { label: 'Work Orders' },
    ];

    const actions = (
        <>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl transition-colors">
                <button 
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <List className="w-4 h-4" />
                    Table
                </button>
                <button 
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                    Kanban
                </button>
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                <Plus className="w-4 h-4" /> Generate Work Order
            </button>
        </>
    );

    return (
        <div className="pb-10 relative">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Work Orders"
                description="Manage field execution, technician assignment and job progress."
                actions={actions}
            />

            <WorkOrderStatsCards />

            <WorkOrderFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {viewMode === 'table' ? (
                <WorkOrderTable 
                    workOrders={mockOrders}
                    searchQuery={searchQuery} 
                    onRowClick={handleRowClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick} 
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            ) : (
                <KanbanBoard workOrders={mockOrders} onCardClick={handleRowClick} />
            )}

            <WorkOrderDrawer
                workOrder={selectedOrder}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
            <CreateWorkOrderModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            <EditWorkOrderModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                workOrder={orderToEdit} 
            />
            <DeleteWorkOrderDialog 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                workOrder={orderToDelete} 
            />
        </div>
    );
}
