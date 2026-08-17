'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Plus, BarChart3 } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import CouponStatsCards from './components/CouponStatsCards';
import CouponFilters from './components/CouponFilters';
import CouponTable from './components/CouponTable';
import CouponDrawer from './components/CouponDrawer';
import CouponAnalyticsSidebar from './components/CouponAnalyticsSidebar';
import { apiSlice } from '@/store/apiSlice';
import { useGetCouponsQuery } from '@/store/api/couponApi';
import { exportToCSV } from '@/lib/csvExport';

export default function CouponsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const dispatch = useDispatch();
    const { data: rawCoupons = [], isFetching } = useGetCouponsQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Coupon', id: 'LIST' }]));
    const handleExport = () => exportToCSV('coupons', rawCoupons.map(c => ({
        code: c.code,
        campaign: c.campaign,
        discount: c.type === 'percentage' ? `${c.discountValue}% OFF` : c.type === 'flat' ? `₹${c.discountValue} OFF` : 'Free Visit',
        type: c.type,
        usage: `${c.usageCount || 0} / ${c.usageLimit || 'Unlimited'}`,
        status: c.status || 'active',
    })), [
        { key: 'code', label: 'Code' },
        { key: 'campaign', label: 'Campaign' },
        { key: 'discount', label: 'Discount' },
        { key: 'type', label: 'Type' },
        { key: 'usage', label: 'Usage' },
        { key: 'status', label: 'Status' },
    ]);

    const handleRowClick = (coupon) => {
        setSelectedCoupon(coupon);
        setIsDrawerOpen(true);
    };

    const handleNewCoupon = () => {
        setSelectedCoupon(null);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Marketing' },
        { label: 'Coupons' },
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => setIsAnalyticsOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
                <BarChart3 className="w-4 h-4" /> Analytics
            </button>
            <button onClick={handleExport} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button 
                onClick={handleNewCoupon}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> Create Coupon
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative overflow-hidden">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Coupons & Promotions"
                description="Create, manage and monitor promotional offers and discount campaigns."
                actions={actions}
            />

            <CouponStatsCards />

            <CouponFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />

            <div className="flex flex-col min-w-0">
                <CouponTable
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    typeFilter={typeFilter}
                    onRowClick={handleRowClick}
                />
            </div>

            <CouponDrawer 
                coupon={selectedCoupon} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />

            <CouponAnalyticsSidebar 
                isOpen={isAnalyticsOpen}
                onClose={() => setIsAnalyticsOpen(false)}
            />
        </div>
    );
}
