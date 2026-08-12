'use client';

import { useState } from 'react';
import { RefreshCw, Download, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import ComplaintStatsCards from './components/ComplaintStatsCards';
import ComplaintFilters from './components/ComplaintFilters';
import ComplaintTable from './components/ComplaintTable';
import ComplaintDrawer from './components/ComplaintDrawer';
import ComplaintAnalytics from './components/ComplaintAnalytics';

export default function ComplaintsPage() {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
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

            <ComplaintFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <ComplaintTable searchQuery={searchQuery} onRowClick={handleRowClick} />

            <ComplaintAnalytics />

            <ComplaintDrawer
                complaint={selectedComplaint}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
