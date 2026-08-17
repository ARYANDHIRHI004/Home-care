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
import { useGetBookingsQuery } from '@/store/api/bookingApi';
import { exportToCSV } from '@/lib/csvExport';

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
    const { data: rawBookings = [], isLoading, isError, refetch, isFetching } = useGetBookingsQuery();
    const bookings = rawBookings.map((booking) => ({
        _id: booking._id,
        id: booking.bookingNumber,
        customer: booking.customerId?.name || booking.customerName,
        phone: booking.customerId?.phone || booking.phone || '-',
        service: booking.serviceId?.name || booking.serviceName,
        date: booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
        time: booking.scheduledTime || '-',
        assignedTo: booking.partnerId?.name || booking.assignedTo || 'Unassigned',
        status: booking.status?.split('_').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ') || 'Upcoming',
        payment: booking.paymentStatus?.split('_').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ') || 'Pending',
        amount: `₹${Number(booking.amount || 0).toLocaleString('en-IN')}`,
        createdBy: booking.createdBy || 'System',
        initial: (booking.customerId?.name || booking.customerName || '?').charAt(0),
        _raw: booking,
    }));

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
                        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => exportToCSV('bookings', bookings, [
                                { key: 'id', label: 'Booking ID' },
                                { key: 'customer', label: 'Customer' },
                                { key: 'phone', label: 'Phone' },
                                { key: 'service', label: 'Service' },
                                { key: 'date', label: 'Date' },
                                { key: 'time', label: 'Time' },
                                { key: 'assignedTo', label: 'Assigned To' },
                                { key: 'status', label: 'Status' },
                                { key: 'payment', label: 'Payment' },
                                { key: 'amount', label: 'Amount' },
                            ])}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
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
            {(() => {
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const todayEnd = todayStart + 24 * 60 * 60 * 1000;
                const tomorrowEnd = todayEnd + 24 * 60 * 60 * 1000;
                const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

                const todaysBookings = rawBookings.filter(b => {
                    const date = new Date(b.createdAt).getTime();
                    return date >= todayStart && date < todayEnd;
                }).length;

                const activeJobs = rawBookings.filter(b => b.status === 'in_progress').length;

                const completedToday = rawBookings.filter(b => {
                    const date = new Date(b.updatedAt || b.createdAt).getTime();
                    return b.status === 'completed' && date >= todayStart && date < todayEnd;
                }).length;

                const scheduledTomorrow = rawBookings.filter(b => {
                    const date = new Date(b.scheduledDate).getTime();
                    return date >= todayEnd && date < tomorrowEnd;
                }).length;

                const pendingAssignment = rawBookings.filter(b => !b.partnerId && !b.assignedTo).length;

                const cancelledThisWeek = rawBookings.filter(b => {
                    const date = new Date(b.updatedAt || b.createdAt).getTime();
                    return b.status === 'cancelled' && date >= weekStart;
                }).length;

                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
                        <BookingStats title="Today's Bookings" value={todaysBookings.toString()} icon={CalendarCheck} trend="neutral" subtitle="Today" accentColor="default" />
                        <BookingStats title="Active Jobs" value={activeJobs.toString()} icon={Wrench} subtitle="Currently in progress" accentColor="purple" />
                        <BookingStats title="Completed Today" value={completedToday.toString()} icon={CheckCircle2} trend="neutral" subtitle="Successfully finished" accentColor="green" />
                        <BookingStats title="Scheduled Tomorrow" value={scheduledTomorrow.toString()} icon={Clock} subtitle="Upcoming bookings" accentColor="yellow" />
                        <BookingStats title="Pending Assignment" value={pendingAssignment.toString()} icon={UserPlus} subtitle="Action required" accentColor="red" />
                        <BookingStats title="Cancelled Bookings" value={cancelledThisWeek.toString()} icon={XCircle} trend="neutral" subtitle="This week" accentColor="gray" />
                    </div>
                );
            })()}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
                {/* Main Content Area */}
                <div className="xl:col-span-3 space-y-6">
                    <BookingFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

                    {viewMode === 'list' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 overflow-hidden transition-colors">
                            {isLoading ? (
                                <div className="p-12 text-center text-sm text-slate-500">Loading bookings...</div>
                            ) : isError ? (
                                <div className="p-12 text-center text-sm text-rose-600">Unable to load bookings.</div>
                            ) : (
                                <BookingTable 
                                    bookings={bookings} 
                                    onRowClick={handleRowClick}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            )}
                            <Pagination 
                                totalItems={bookings.length}
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
                    <BookingSidebar onCreateBooking={() => setIsCreateModalOpen(true)} />
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
