'use client';

import { useState } from 'react';
import { RefreshCw, Download, Plus, Upload } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import ServiceStatsCards from './components/ServiceStatsCards';
import ServiceFilters from './components/ServiceFilters';
import ServiceTable from './components/ServiceTable';
import ServiceDrawer from './components/ServiceDrawer';

export default function ServicesListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" /> Import
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
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

            <ServiceFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col min-w-0">
                <ServiceTable searchQuery={searchQuery} onRowClick={handleRowClick} />
            </div>

            <ServiceDrawer 
                service={selectedService} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}
