'use client';

import { useState } from 'react';
import { RefreshCw, Download, FileSpreadsheet, Printer } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import BookingSummaryCards from './components/BookingSummaryCards';
import BookingFilters from './components/BookingFilters';
import {
    DailyBookingTrendChart,
    BookingByCategoryChart,
    BookingStatusChart,
    BookingBySourceChart,
    PartnerWorkloadChart,
} from './components/BookingCharts';
import { RecentBookingsTable, TopServicesTable, TopPartnersTable } from './components/BookingTables';
import BookingInsightsPanel from './components/BookingInsightsPanel';

export default function BookingReportPage() {
    const [activeRange, setActiveRange] = useState('This Month');

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Reports' },
        { label: 'Booking Report' },
    ];

    const actions = (
        <>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> CSV
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Print
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-hidden bg-slate-50/50">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Booking Report"
                description="Analyze booking trends, service performance and operational efficiency."
                actions={actions}
            />

            {/* Filters */}
            <BookingFilters activeRange={activeRange} setActiveRange={setActiveRange} />

            {/* Summary Cards */}
            <BookingSummaryCards />

            {/* Charts Row 1: Trend + Category */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
                <DailyBookingTrendChart />
                <BookingByCategoryChart />
            </div>

            {/* Charts Row 2: Status + Source + Partner Workload */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                <BookingStatusChart />
                <BookingBySourceChart />
                <PartnerWorkloadChart />
            </div>

            {/* Tables + Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
                <div className="xl:col-span-2 space-y-5">
                    <RecentBookingsTable />
                    <TopServicesTable />
                    <TopPartnersTable />
                </div>
                <div className="xl:col-span-1">
                    <BookingInsightsPanel />
                </div>
            </div>
        </div>
    );
}
