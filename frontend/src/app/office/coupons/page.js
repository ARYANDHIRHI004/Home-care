'use client';

import { useState } from 'react';
import { RefreshCw, Download, Plus, BarChart3 } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import CouponStatsCards from './components/CouponStatsCards';
import CouponFilters from './components/CouponFilters';
import CouponTable from './components/CouponTable';
import CouponDrawer from './components/CouponDrawer';
import CouponAnalyticsSidebar from './components/CouponAnalyticsSidebar';

export default function CouponsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

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
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setIsAnalyticsOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
                <BarChart3 className="w-4 h-4" /> Analytics
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
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

            <CouponFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col min-w-0">
                <CouponTable searchQuery={searchQuery} onRowClick={handleRowClick} />
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
