'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Upload, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import CustomerStatsCards from './components/CustomerStatsCards';
import CustomerFilters from './components/CustomerFilters';
import CustomerTable from './components/CustomerTable';
import CustomerRightSidebar from './components/CustomerRightSidebar';
import CustomerProfileDrawer from './components/CustomerProfileDrawer';
import CreateCustomerModal from '@/app/office/customers/components/CreateCustomerModal';
import { apiSlice } from '@/store/apiSlice';
import { useGetCustomersQuery } from '@/store/api/customerApi';
import { exportToCSV } from '@/lib/csvExport';
export default function CustomersPage() {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { data: rawCustomerData, isFetching } = useGetCustomersQuery();
    const rawCustomers = Array.isArray(rawCustomerData) ? rawCustomerData : (rawCustomerData?.data || []);

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Customer', id: 'LIST' }]));
    const handleExport = () => exportToCSV('customers', rawCustomers.map(c => ({
        name: c.name || 'Unknown',
        email: c.email || '',
        phone: c.phone || '',
        city: c.city || '',
        totalBookings: c.totalBookings ?? 0,
        lifetimeSpend: c.lifetimeSpend ?? 0,
        status: c.status || 'Active',
    })), [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'totalBookings', label: 'Total Bookings' },
        { key: 'lifetimeSpend', label: 'Lifetime Spend' },
        { key: 'status', label: 'Status' },
    ]);

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Customers' }
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleExport} className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Export
            </button>
            <button className="hidden sm:flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4 mr-2" /> Import
            </button>
            <button type='button' onClick={() => setIsCreateModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4 mr-1.5" /> Add Customer
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader 
                breadcrumbs={breadcrumbs}
                title="Customers"
                description="Manage customer profiles, bookings, communication history and lifetime value."
                actions={actions}
            />

            <CustomerStatsCards />
            
            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Main Content Area */}
                <div className="flex-1 w-full flex flex-col min-w-0">
                    <CustomerFilters />
                    <CustomerTable onCustomerClick={handleCustomerClick} />
                </div>
                
                {/* Right Sidebar Widgets (Desktop) */}
                <div className="hidden xl:block">
                    <CustomerRightSidebar />
                </div>
            </div>

            {/* Profile Drawer */}
            <CustomerProfileDrawer 
                customer={selectedCustomer}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
            
            {/* Mobile Floating Add Button */}
            <div className="fixed bottom-6 right-6 sm:hidden z-40">
                <button className="p-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 hover:bg-blue-700 transition-colors">
                    <Plus className="w-6 h-6" />
                </button>
            </div>
            <CreateCustomerModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
