'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import ComplaintStatsCards from './components/ComplaintStatsCards';
import ComplaintFilters from './components/ComplaintFilters';
import ComplaintTable from './components/ComplaintTable';
import ComplaintDrawer from './components/ComplaintDrawer';
import ComplaintAnalytics from './components/ComplaintAnalytics';
import { apiSlice } from '@/store/apiSlice';
import { useGetTicketsQuery } from '@/store/api/ticketApi';
import { exportToCSV } from '@/lib/csvExport';

export default function ComplaintsPage() {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [priorityFilter, setPriorityFilter] = useState('All Priorities');
    const dispatch = useDispatch();
    const { data: rawTickets = [], isFetching } = useGetTicketsQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Ticket', id: 'LIST' }]));
    const handleExport = () => exportToCSV('complaints', rawTickets.map(t => ({
        id: t.ticketNumber || t._id,
        customer: t.customerId?.name || t.customerName || 'Customer',
        service: t.enquiryId?.serviceCategory || 'Service Issue',
        partner: t.assignedPartnerId?.name || 'Unassigned',
        priority: t.priority || 'normal',
        status: t.status || 'open',
        created: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
    })), [
        { key: 'id', label: 'Ticket ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'service', label: 'Service' },
        { key: 'partner', label: 'Assigned Partner' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'created', label: 'Created' },
    ]);

    const handleRowClick = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Complaints' },
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4" /> New Complaint
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Complaints"
                description="Manage customer complaints, escalations and service quality issues."
                actions={actions}
            />

            <ComplaintStatsCards />

            <ComplaintFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
            />

            <ComplaintTable
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                onRowClick={handleRowClick}
            />

            <ComplaintAnalytics />

            <ComplaintDrawer
                complaint={selectedComplaint}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
