'use client';

import { useState } from 'react';
import { RefreshCw, Download, Calendar, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import WorkOrderStatsCards from './components/WorkOrderStatsCards';
import WorkOrderFilters from './components/WorkOrderFilters';
import WorkOrderTable from './components/WorkOrderTable';
import WorkOrderSidebar from './components/WorkOrderSidebar';
import WorkOrderDrawer from './components/WorkOrderDrawer';

export default function WorkOrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Operations' },
        { label: 'Work Orders' },
    ];

    const actions = (
        <>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Calendar className="w-4 h-4" /> Calendar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4" /> Create Work Order
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Work Orders"
                description="Manage every confirmed service from assignment to completion, invoicing and payment."
                actions={actions}
            />

            <WorkOrderStatsCards />

            <WorkOrderFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Main Content Area */}
                <div className="flex-1 w-full flex flex-col min-w-0">
                    <WorkOrderTable searchQuery={searchQuery} onRowClick={handleRowClick} />
                </div>
                
                {/* Right Sidebar Widgets */}
                <div className="hidden xl:block">
                    <WorkOrderSidebar />
                </div>
            </div>

            <WorkOrderDrawer
                workOrder={selectedOrder}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
