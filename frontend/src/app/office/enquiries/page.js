'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/office/PageHeader';
import { Plus, Download, RefreshCw, Filter, Inbox, Clock, Flame, CheckCircle2, XCircle } from 'lucide-react';
import EnquiryStats from './components/EnquiryStats';
import EnquiryFilters from './components/EnquiryFilters';
import EnquiryTable from './components/EnquiryTable';
import EnquiryDrawer from './components/EnquiryDrawer';
import CreateEnquiryModal from './components/CreateEnquiryModal';
import EditEnquiryModal from './components/EditEnquiryModal';
import DeleteEnquiryDialog from './components/DeleteEnquiryDialog';
import Pagination from '@/components/office/ui/Pagination';
import CreateEstimateModal from '@/components/office/estimates/CreateEstimateModal';
import { useGetEnquiriesQuery } from '@/store/api/enquiryApi';
import { exportToCSV } from '@/lib/csvExport';
export default function EnquiriesPage() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [enquiryToEdit, setEnquiryToEdit] = useState(null);
    const [enquiryToDelete, setEnquiryToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isCreateEstimateModalOpen, setIsCreateEstimateModalOpen] = useState(false);
    
    const { data: fetchedEnquiries = [], isLoading, isError, refetch, isFetching } = useGetEnquiriesQuery();

    const enquiries = fetchedEnquiries.map(enq => ({
        id: enq._id,
        // _id is a hex string, the UI might expect a shorter ID like ENQ-8021, but for now we use _id.
        // Or we can slice it: enq._id.slice(-6).toUpperCase()
        displayId: `ENQ-${enq._id.slice(-4).toUpperCase()}`,
        customer: enq.customerId?.name || 'Unknown',
        email: enq.customerId?.email || 'N/A',
        phone: enq.customerId?.phone || 'N/A',
        service: enq.serviceCategory || 'N/A',
        address: enq.address || 'N/A',
        locality: enq.locality || '',
        source: enq.source || 'Website',
        priority: enq.priority || 'Medium',
        assignedTo: enq.assignedTo?.name || 'Unassigned',
        nextFollowUp: enq.nextFollowUp ? new Date(enq.nextFollowUp).toLocaleString() : 'None',
        status: enq.status || 'New',
        date: new Date(enq.createdAt).toLocaleDateString(),
        initial: (enq.customerId?.name || 'U').charAt(0).toUpperCase(),
        _raw: enq, // keep raw data for edit/delete modals
    }));

    console.log(enquiries);
    

    const handleRowClick = (enq) => {
        setSelectedRow(enq);
        setIsDrawerOpen(true);
    };

    const handleEditClick = (enq) => {
        setEnquiryToEdit(enq);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (enq) => {
        setEnquiryToDelete(enq);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="pb-10 relative">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Operations', href: '#' }, { label: 'Enquiries' }]}
                title="Enquiries"
                description="Manage and track all incoming customer enquiries from every channel before they become bookings."
                actions={
                    <>
                        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => exportToCSV('enquiries', enquiries, [
                                { key: 'displayId', label: 'Enquiry ID' },
                                { key: 'customer', label: 'Customer' },
                                { key: 'email', label: 'Email' },
                                { key: 'phone', label: 'Phone' },
                                { key: 'service', label: 'Service' },
                                { key: 'address', label: 'Address' },
                                { key: 'source', label: 'Source' },
                                { key: 'priority', label: 'Priority' },
                                { key: 'assignedTo', label: 'Assigned To' },
                                { key: 'status', label: 'Status' },
                                { key: 'date', label: 'Date' },
                            ])}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <Filter className="w-4 h-4" />
                            Advanced Filters
                        </button>
                        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            New Enquiry
                        </button>
                    </>
                }
            />

            {/* KPI Cards */}
            <EnquiryStats />

            {/* Search and Filters */}
            <EnquiryFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Main Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 overflow-hidden transition-colors">
                <EnquiryTable 
                    enquiries={enquiries} 
                    onRowClick={handleRowClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
                
                {/* Pagination */}
                {/* Pagination */}
                <Pagination 
                    totalItems={enquiries.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>

            {/* Right Side Drawer */}
            <EnquiryDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                selectedRow={selectedRow}
                onCreateEstimate={() => setIsCreateEstimateModalOpen(true)}
            />

            {/* Modals */}
            <CreateEnquiryModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            <EditEnquiryModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                enquiry={enquiryToEdit} 
            />
            <DeleteEnquiryDialog 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                enquiry={enquiryToDelete} 
            />

            {/* Estimate builder — reused from the Estimates module */}
            <CreateEstimateModal
                isOpen={isCreateEstimateModalOpen}
                onClose={() => setIsCreateEstimateModalOpen(false)}
                enquiry={selectedRow}
                onSave={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
