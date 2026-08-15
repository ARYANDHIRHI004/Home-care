'use client';

import { useState } from 'react';
import { RefreshCw, Download, FileSpreadsheet, Printer, BarChart3 } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import RevenueSummaryCards from './components/RevenueSummaryCards';
import RevenueFilters from './components/RevenueFilters';
import {
    MonthlyRevenueTrendChart,
    RevenueVsExpensesChart,
    RevenueByCategoryChart,
    RevenueByPaymentMethodChart,
} from './components/RevenueCharts';
import { TopServicesTable, TopCustomersTable, RecentPaymentsTable } from './components/RevenueTables';
import InsightsPanel from './components/InsightsPanel';

export default function RevenueReportPage() {
    const [activeRange, setActiveRange] = useState('This Month');

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Reports' },
        { label: 'Revenue Report' },
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
            {/* Header */}
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Revenue Report"
                description="Monitor revenue, collections, expenses and business profitability."
                actions={actions}
            />

            {/* Filters */}
            <RevenueFilters activeRange={activeRange} setActiveRange={setActiveRange} />

            {/* Summary KPI Cards */}
            <RevenueSummaryCards />

            {/* Charts — 2 x 2 Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
                <MonthlyRevenueTrendChart />
                <RevenueVsExpensesChart />
                <RevenueByCategoryChart />
                <RevenueByPaymentMethodChart />
            </div>

            {/* Bottom Section: Tables + Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
                {/* Left: Tables */}
                <div className="xl:col-span-2 space-y-5">
                    <TopServicesTable />
                    <TopCustomersTable />
                    <RecentPaymentsTable />
                </div>

                {/* Right: Insights Panel */}
                <div className="xl:col-span-1">
                    <InsightsPanel />
                </div>
            </div>
        </div>
    );
}
