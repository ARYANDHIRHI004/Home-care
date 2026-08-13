'use client';

import { useState } from 'react';
import { RefreshCw, Download, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import PartnerStatsCards from './components/PartnerStatsCards';
import PartnerFilters from './components/PartnerFilters';
import PartnerTable from './components/PartnerTable';
import PartnerDrawer from './components/PartnerDrawer';
import PartnerSidebar from './components/PartnerSidebar';

export default function PartnersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleRowClick = (partner) => {
        setSelectedPartner(partner);
        setIsDrawerOpen(true);
    };

    const handleNewPartner = () => {
        setSelectedPartner(null);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Partners' },
        { label: 'Service Partners' },
    ];

    const actions = (
        <>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button 
                onClick={handleNewPartner}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> Add Partner
            </button>
        </>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-200 bg-white">
                <PageHeader
                    breadcrumbs={breadcrumbs}
                    title="Service Partners"
                    description="Manage technicians, service professionals, onboarding, availability and performance."
                    actions={actions}
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full relative">
                    <PartnerStatsCards />

                    <PartnerFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

                    <div className="flex flex-col min-w-0 pb-12">
                        <PartnerTable searchQuery={searchQuery} onRowClick={handleRowClick} />
                    </div>
                </div>

                <PartnerSidebar />
            </div>

            <PartnerDrawer 
                partner={selectedPartner} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}
