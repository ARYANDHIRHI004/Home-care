'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Plus, Upload } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import PricingStatsCards from './components/PricingStatsCards';
import PricingFilters from './components/PricingFilters';
import PricingTable from './components/PricingTable';
import PricingDrawer from './components/PricingDrawer';
import { apiSlice } from '@/store/apiSlice';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { exportToCSV } from '@/lib/csvExport';

export default function PricingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPricing, setSelectedPricing] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const { data: rawServices = [], isFetching } = useGetServicesQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Service', id: 'LIST' }]));
    const handleExport = () => exportToCSV('pricing', rawServices.map(s => ({
        service: s.name,
        category: s.categoryId?.name || 'General',
        base: s.basePrice || 0,
        visit: s.visitCharges || 0,
        status: s.active !== false ? 'Active' : 'Inactive',
    })), [
        { key: 'service', label: 'Service' },
        { key: 'category', label: 'Category' },
        { key: 'base', label: 'Base Price' },
        { key: 'visit', label: 'Visit Charges' },
        { key: 'status', label: 'Status' },
    ]);

    const handleRowClick = (pricing) => {
        setSelectedPricing(pricing);
        setIsDrawerOpen(true);
    };

    const handleNewPricing = () => {
        setSelectedPricing(null);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Service Management' },
        { label: 'Pricing' },
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
                onClick={handleNewPricing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> Add Pricing
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Pricing Management"
                description="Manage all service prices independently from service data."
                actions={actions}
            />

            <PricingStatsCards />

            <PricingFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col min-w-0">
                <PricingTable searchQuery={searchQuery} onRowClick={handleRowClick} />
            </div>

            <PricingDrawer 
                pricing={selectedPricing} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}
