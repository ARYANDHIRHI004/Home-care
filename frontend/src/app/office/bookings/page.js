'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/office/PageHeader';
import { Plus, Download, RefreshCw, CalendarCheck, Wrench, CheckCircle2, Clock, UserPlus, XCircle, List, CalendarDays, CalendarIcon } from 'lucide-react';
import BookingStats from './components/BookingStats';
import BookingFilters from './components/BookingFilters';
import BookingTable from './components/BookingTable';
import BookingDrawer from './components/BookingDrawer';
import BookingSidebar from './components/BookingSidebar';
import CreateBookingModal from './components/CreateBookingModal';
import EditBookingModal from './components/EditBookingModal';
import DeleteBookingDialog from './components/DeleteBookingDialog';
import Pagination from '@/components/office/ui/Pagination';

export default function BookingsPage() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToEdit, setBookingToEdit] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Mock Data
    const bookings = [
        { id: 'BKG-9012', customer: 'Ramesh Gupta', phone: '+91 98765 43210', service: 'AC Deep Cleaning', date: 'Oct 25, 2023', time: '10:00 AM - 12:00 PM', assignedTo: 'Amit Kumar', status: 'In Progress', payment: 'Pending', amount: '₹1,299', createdBy: 'System', initial: 'R' },
        { id: 'BKG-9013', customer: 'Sneha Reddy', phone: '+91 87654 32109', service: 'Full Home Cleaning', date: 'Oct 25, 2023', time: '02:00 PM - 06:00 PM', assignedTo: 'Neha Singh', status: 'Professional On The Way', payment: 'Partially Paid', amount: '₹4,500', createdBy: 'Rahul Admin', initial: 'S' },
        { id: 'BKG-9014', customer: 'Vijay Sharma', phone: '+91 76543 21098', service: 'Plumbing Repair', date: 'Oct 25, 2023', time: '04:00 PM - 05:00 PM', assignedTo: 'Unassigned', status: 'Pending Assignment', payment: 'Pending', amount: '₹499', createdBy: 'Online', initial: 'V' },
        { id: 'BKG-9015', customer: 'Anita Desai', phone: '+91 65432 10987', service: 'Electrical Work', date: 'Oct 24, 2023', time: '11:00 AM - 01:00 PM', assignedTo: 'Rajesh Verma', status: 'Completed', payment: 'Paid', amount: '₹850', createdBy: 'Priya Support', initial: 'A' },
        { id: 'BKG-9016', customer: 'Karan Patel', phone: '+91 54321 09876', service: 'Sofa Cleaning', date: 'Oct 26, 2023', time: '09:00 AM - 11:00 PM', assignedTo: 'Suresh Kumar', status: 'Confirmed', payment: 'Paid', amount: '₹1,500', createdBy: 'System', initial: 'K' },
    ];

    const handleRowClick = (bkg) => {
        setSelectedRow(bkg);
        setIsDrawerOpen(true);
    };

    const handleEditClick = (bkg) => {
        setBookingToEdit(bkg);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (bkg) => {
        setBookingToDelete(bkg);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="pb-10 relative">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Operations', href: '#' }, { label: 'Bookings' }]}
                title="Bookings"
                description="Manage all confirmed customer bookings, assign professionals, track progress and monitor service execution."
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
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl transition-colors">
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                <List className="w-4 h-4" />
                                List
                            </button>
                            <button 
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                <CalendarDays className="w-4 h-4" />
                                Calendar
                            </button>
                        </div>
                        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            Create Booking
                        </button>
                    </>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
                <BookingStats title="Today's Bookings" value="48" icon={CalendarCheck} trend="up" trendValue="12%" subtitle="vs yesterday" accentColor="default" />
                <BookingStats title="Active Jobs" value="12" icon={Wrench} subtitle="Currently in progress" accentColor="purple" />
                <BookingStats title="Completed Today" value="15" icon={CheckCircle2} trend="up" trendValue="5%" subtitle="Successfully finished" accentColor="green" />
                <BookingStats title="Scheduled Tomorrow" value="32" icon={Clock} subtitle="Upcoming bookings" accentColor="yellow" />
                <BookingStats title="Pending Assignment" value="8" icon={UserPlus} subtitle="Action required" accentColor="red" />
                <BookingStats title="Cancelled Bookings" value="3" icon={XCircle} trend="down" trendValue="2%" subtitle="This week" accentColor="gray" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
                {/* Main Content Area */}
                <div className="xl:col-span-3 space-y-6">
                    <BookingFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

                    {viewMode === 'list' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 overflow-hidden transition-colors">
                            <BookingTable 
                                bookings={bookings} 
                                onRowClick={handleRowClick}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                            <Pagination 
                                totalItems={48}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-12 text-center flex flex-col items-center justify-center h-[500px] transition-colors">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Calendar View</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md">Interactive calendar view for drag & drop rescheduling, workload visualization, and capacity planning.</p>
                            <button onClick={() => setViewMode('list')} className="mt-6 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Switch back to List View
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="xl:col-span-1 space-y-6">
                    <BookingSidebar />
                </div>
            </div>

            {/* Drawers and Modals */}
            <BookingDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                selectedRow={selectedRow} 
            />
            <CreateBookingModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            <EditBookingModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                booking={bookingToEdit} 
            />
            <DeleteBookingDialog 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                booking={bookingToDelete} 
            />
        </div>
    );
}
