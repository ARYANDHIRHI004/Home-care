'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Download, FileSpreadsheet, Printer } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import { useGetBookingsQuery } from '@/store/api/bookingApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import BookingSummaryCards from './components/BookingSummaryCards';
import BookingFilters from './components/BookingFilters';
import {
    DailyBookingTrendChart,
    BookingByCategoryChart,
    BookingStatusChart,
    BookingByPaymentStatusChart,
    PartnerWorkloadChart,
} from './components/BookingCharts';
import { RecentBookingsTable, TopServicesTable, TopPartnersTable } from './components/BookingTables';
import BookingInsightsPanel from './components/BookingInsightsPanel';

function isWithinRange(dateValue, range, customFrom, customTo) {
    if (!dateValue) return range === 'This Year' ? true : false;
    const d = new Date(dateValue);
    const now = new Date();

    switch (range) {
        case 'Today': {
            return d.toDateString() === now.toDateString();
        }
        case 'This Week': {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            return d >= start;
        }
        case 'This Month': {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        case 'This Year': {
            return d.getFullYear() === now.getFullYear();
        }
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

export default function BookingReportPage() {
    const [activeRange, setActiveRange] = useState('This Year');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('Any');

    const { data: rawBookings = [], isLoading, isFetching, refetch } = useGetBookingsQuery();
    const { data: partners = [] } = useGetPartnersQuery();

    const categories = useMemo(() => {
        const set = new Set();
        rawBookings.forEach((b) => { if (b.category) set.add(b.category); });
        return Array.from(set).sort();
    }, [rawBookings]);

    const bookings = useMemo(() => {
        return rawBookings.filter((b) => {
            if (!isWithinRange(b.createdAt, activeRange, customFrom, customTo)) return false;
            if (statusFilter !== 'All Statuses' && b.status !== statusFilter) return false;
            if (categoryFilter !== 'All Categories' && b.category !== categoryFilter) return false;
            if (paymentStatusFilter !== 'Any' && b.paymentStatus !== paymentStatusFilter) return false;
            return true;
        });
    }, [rawBookings, activeRange, customFrom, customTo, statusFilter, categoryFilter, paymentStatusFilter]);

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Reports' },
        { label: 'Booking Report' },
    ];

    const actions = (
        <>
            <button onClick={() => refetch()} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
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
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Booking Report"
                description="Analyze booking trends, service performance and operational efficiency."
                actions={actions}
            />

            {/* Filters */}
            <BookingFilters
                activeRange={activeRange}
                setActiveRange={setActiveRange}
                customFrom={customFrom}
                setCustomFrom={setCustomFrom}
                customTo={customTo}
                setCustomTo={setCustomTo}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                paymentStatusFilter={paymentStatusFilter}
                setPaymentStatusFilter={setPaymentStatusFilter}
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
                    {/* Summary Cards */}
                    <BookingSummaryCards bookings={bookings} />

                    {/* Charts Row 1: Trend + Category */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
                        <DailyBookingTrendChart bookings={bookings} />
                        <BookingByCategoryChart bookings={bookings} />
                    </div>

                    {/* Charts Row 2: Status + Payment Status + Partner Workload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                        <BookingStatusChart bookings={bookings} />
                        <BookingByPaymentStatusChart bookings={bookings} />
                        <PartnerWorkloadChart bookings={bookings} partners={partners} />
                    </div>

                    {/* Tables + Insights */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
                        <div className="xl:col-span-2 space-y-5">
                            <RecentBookingsTable bookings={bookings} partners={partners} />
                            <TopServicesTable bookings={bookings} />
                            <TopPartnersTable bookings={bookings} partners={partners} />
                        </div>
                        <div className="xl:col-span-1">
                            <BookingInsightsPanel bookings={bookings} partners={partners} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
