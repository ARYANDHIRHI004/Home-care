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
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';

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

    const { data: rawOrders = [], isLoading } = useGetWorkOrdersQuery();

    // Map backend fields to the shape the UI components expect
    const workOrders = rawOrders.map(wo => ({
        id: wo._id,
        displayId: `WO-${wo._id.slice(-4).toUpperCase()}`,
        bookingId: wo.enquiryId?._id || wo.enquiryId || '',
        customer: wo.customerId?.name || wo.customerName || 'Unknown',
        service: wo.serviceCategory || 'N/A',
        assignedTo: wo.assignedPartnerId?.name || 'Unassigned',
        date: wo.scheduledAt ? new Date(wo.scheduledAt).toLocaleString() : 'N/A',
        status: wo.status || 'open',
        priority: wo.priority || 'normal',
        createdDate: new Date(wo.createdAt).toLocaleDateString(),
        _raw: wo,
    }));

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
                    workOrders={workOrders}
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
                <KanbanBoard workOrders={workOrders} onCardClick={handleRowClick} />
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
