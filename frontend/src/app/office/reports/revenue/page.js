'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Download, FileSpreadsheet, Printer } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import { useGetInvoicesQuery } from '@/store/api/invoiceApi';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';
import { useGetExpensesQuery } from '@/store/api/expenseApi';
import { useGetBookingsQuery } from '@/store/api/bookingApi';
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

function isWithinRange(dateValue, range, customFrom, customTo) {
    if (!dateValue) return false;
    const d = new Date(dateValue);
    const now = new Date();

    switch (range) {
        case 'Today':
            return d.toDateString() === now.toDateString();
        case 'This Week': {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            return d >= start;
        }
        case 'This Month':
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        case 'This Year':
            return d.getFullYear() === now.getFullYear();
        case 'Custom': {
            if (!customFrom && !customTo) return true;
            const from = customFrom ? new Date(customFrom) : null;
            const to = customTo ? new Date(customTo) : null;
            if (from && d < from) return false;
            if (to && d > new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1)) return false;
            return true;
        }
        default:
            return true;
    }
}

export default function RevenueReportPage() {
    const [activeRange, setActiveRange] = useState('This Year');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('All Statuses');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [methodFilter, setMethodFilter] = useState('All Methods');

    const { data: rawInvoices = [], isLoading: invoicesLoading, isFetching, refetch: refetchInvoices } = useGetInvoicesQuery();
    const { data: rawPayments = [], isLoading: paymentsLoading, refetch: refetchPayments } = useGetPaymentsQuery();
    const { data: rawExpenses = [], isLoading: expensesLoading, refetch: refetchExpenses } = useGetExpensesQuery();
    const { data: rawBookings = [], isLoading: bookingsLoading, refetch: refetchBookings } = useGetBookingsQuery();

    const isLoading = invoicesLoading || paymentsLoading || expensesLoading || bookingsLoading;

    const categories = useMemo(() => {
        const set = new Set();
        rawBookings.forEach((b) => { if (b.category) set.add(b.category); });
        return Array.from(set).sort();
    }, [rawBookings]);

    const invoices = useMemo(() => rawInvoices.filter((inv) => {
        if (!isWithinRange(inv.createdAt, activeRange, customFrom, customTo)) return false;
        if (paymentStatusFilter !== 'All Statuses' && inv.paymentStatus !== paymentStatusFilter) return false;
        return true;
    }), [rawInvoices, activeRange, customFrom, customTo, paymentStatusFilter]);

    const payments = useMemo(() => rawPayments.filter((p) => {
        if (!isWithinRange(p.createdAt, activeRange, customFrom, customTo)) return false;
        if (methodFilter !== 'All Methods' && p.method !== methodFilter) return false;
        return true;
    }), [rawPayments, activeRange, customFrom, customTo, methodFilter]);

    const expenses = useMemo(() => rawExpenses.filter((e) => isWithinRange(e.date, activeRange, customFrom, customTo)), [rawExpenses, activeRange, customFrom, customTo]);

    const bookings = useMemo(() => rawBookings.filter((b) => {
        if (!isWithinRange(b.createdAt, activeRange, customFrom, customTo)) return false;
        if (categoryFilter !== 'All Categories' && b.category !== categoryFilter) return false;
        return true;
    }), [rawBookings, activeRange, customFrom, customTo, categoryFilter]);

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Reports' },
        { label: 'Revenue Report' },
    ];

    const actions = (
        <>
            <button
                onClick={() => { refetchInvoices(); refetchPayments(); refetchExpenses(); refetchBookings(); }}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
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
            <RevenueFilters
                activeRange={activeRange}
                setActiveRange={setActiveRange}
                customFrom={customFrom}
                setCustomFrom={setCustomFrom}
                customTo={customTo}
                setCustomTo={setCustomTo}
                paymentStatusFilter={paymentStatusFilter}
                setPaymentStatusFilter={setPaymentStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                methodFilter={methodFilter}
                setMethodFilter={setMethodFilter}
                categories={categories}
            />

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm h-28 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Summary KPI Cards */}
                    <RevenueSummaryCards invoices={invoices} payments={payments} expenses={expenses} bookings={bookings} />

                    {/* Charts — 2 x 2 Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
                        <MonthlyRevenueTrendChart invoices={invoices} payments={payments} />
                        <RevenueVsExpensesChart invoices={invoices} expenses={expenses} />
                        <RevenueByCategoryChart bookings={bookings} />
                        <RevenueByPaymentMethodChart payments={payments} />
                    </div>

                    {/* Bottom Section: Tables + Insights */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
                        {/* Left: Tables */}
                        <div className="xl:col-span-2 space-y-5">
                            <TopServicesTable bookings={bookings} />
                            <TopCustomersTable bookings={bookings} />
                            <RecentPaymentsTable payments={payments} invoices={invoices} />
                        </div>

                        {/* Right: Insights Panel */}
                        <div className="xl:col-span-1">
                            <InsightsPanel invoices={invoices} payments={payments} bookings={bookings} expenses={expenses} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
