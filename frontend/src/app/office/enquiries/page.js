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
    
    // Mock Data
    // Status enum is intentionally limited to the Enquiry stage's own lifecycle:
    // New -> Contacted -> Qualified -> Disqualified. Anything past "Qualified" (an
    // estimate existing, being negotiated, sent, etc.) is Estimate-stage state and
    // lives on the Estimates page instead — mixing the two here is what let an
    // enquiry look "further along" than it actually was without an estimate existing.
    const enquiries = [
        { id: 'ENQ-8021', customer: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', service: 'AC Deep Cleaning', source: 'Website', priority: 'High', assignedTo: 'Amit Kumar', nextFollowUp: 'Today, 2:00 PM', status: 'Qualified', date: 'Oct 24, 2023', initial: 'R' },
        { id: 'ENQ-8022', customer: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 87654 32109', service: 'Full Home Cleaning', source: 'WhatsApp', priority: 'Urgent', assignedTo: 'Neha Singh', nextFollowUp: 'Tomorrow, 10:00 AM', status: 'New', date: 'Oct 24, 2023', initial: 'P' },
        { id: 'ENQ-8023', customer: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 76543 21098', service: 'Plumbing Repair', source: 'Phone', priority: 'Medium', assignedTo: 'Rajesh Verma', nextFollowUp: 'Oct 26, 4:00 PM', status: 'Contacted', date: 'Oct 23, 2023', initial: 'V' },
        { id: 'ENQ-8024', customer: 'Anita Desai', email: 'anita.d@example.com', phone: '+91 65432 10987', service: 'Electrical Work', source: 'Instagram', priority: 'Low', assignedTo: 'Unassigned', nextFollowUp: 'None', status: 'Disqualified', date: 'Oct 22, 2023', initial: 'A' },
        { id: 'ENQ-8025', customer: 'Suresh Kumar', email: 'suresh.k@example.com', phone: '+91 54321 09876', service: 'Pest Control', source: 'Google Business', priority: 'High', assignedTo: 'Amit Kumar', nextFollowUp: 'Today, 5:00 PM', status: 'Qualified', date: 'Oct 22, 2023', initial: 'S' },
    ];

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
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
                <EnquiryStats title="Today's Enquiries" value="124" icon={Inbox} trend="up" trendValue="14%" subtitle="from all channels" accentColor="default" />
                <EnquiryStats title="Pending Follow-ups" value="38" icon={Clock} subtitle="Action required today" accentColor="yellow" />
                <EnquiryStats title="Hot Leads" value="15" icon={Flame} subtitle="High intent to book" accentColor="red" />
                <EnquiryStats title="Converted Today" value="42" icon={CheckCircle2} trend="up" trendValue="5%" subtitle="Booking created" accentColor="green" />
                <EnquiryStats title="Lost Enquiries" value="7" icon={XCircle} trend="down" trendValue="2%" subtitle="Could not convert" accentColor="gray" />
            </div>

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
                {/* Was hardcoded to 124 regardless of how many rows actually existed
                    in `enquiries` (5) — pager would claim a nonexistent 13 pages.
                    Driven off the real array length until a backend total plugs in. */}
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

            {/* Estimate builder — reused from the Estimates module rather than
                duplicated here. `enquiry={selectedRow}` locks the estimate to
                this enquiry instead of making the admin pick it again. Note:
                this mock data isn't wired to actually flip the enquiry's own
                status to reflect an estimate now existing (that needs a shared
                data source across the Enquiries/Estimates pages — the Redux
                store set up earlier in this project is exactly the right place
                for that once these pages are hooked to a real API). */}
            <CreateEstimateModal
                isOpen={isCreateEstimateModalOpen}
                onClose={() => setIsCreateEstimateModalOpen(false)}
                enquiry={selectedRow}
                onSave={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
