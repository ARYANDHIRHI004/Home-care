'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Plus, Upload } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import ServiceStatsCards from './components/ServiceStatsCards';
import ServiceFilters from './components/ServiceFilters';
import ServiceTable from './components/ServiceTable';
import ServiceDrawer from './components/ServiceDrawer';
import { apiSlice } from '@/store/apiSlice';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { exportToCSV } from '@/lib/csvExport';

export default function ServicesListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: 'All Categories',
        status: 'All Statuses',
        featured: 'Any',
        popular: 'Any',
        duration: 'Any Duration',
    });
    const [selectedService, setSelectedService] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const { data: rawServices = [], isFetching } = useGetServicesQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Service', id: 'LIST' }]));
    const handleExport = () => exportToCSV('services', rawServices.map(s => ({
        name: s.name,
        category: s.categoryId?.name || (typeof s.categoryId === 'string' ? s.categoryId : 'General'),
        basePrice: s.basePrice || 0,
        duration: s.duration || '',
        warranty: s.warranty || '',
        status: s.active !== false ? 'Active' : 'Inactive',
    })), [
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'basePrice', label: 'Base Price' },
        { key: 'duration', label: 'Duration' },
        { key: 'warranty', label: 'Warranty' },
        { key: 'status', label: 'Status' },
    ]);

    const handleRowClick = (service) => {
        setSelectedService(service);
        setIsDrawerOpen(true);
    };

    const handleNewService = () => {
        setSelectedService(null);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Service Management' },
        { label: 'Services' },
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" /> Import
            </button>
            <button onClick={handleExport} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button 
                onClick={handleNewService}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> New Service
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Services"
                description="Manage all available services."
                actions={actions}
            />

            <ServiceStatsCards />

            <ServiceFilters 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                filters={filters}
                setFilters={setFilters}
            />

            <div className="flex flex-col min-w-0">
                <ServiceTable 
                    searchQuery={searchQuery} 
                    filters={filters}
                    onRowClick={handleRowClick} 
                />
            </div>

            <ServiceDrawer 
                service={selectedService} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}
