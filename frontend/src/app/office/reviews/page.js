'use client';

import { useState } from 'react';
import { RefreshCw, Download, Filter, MessageSquareText } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import ReviewStatsCards from './components/ReviewStatsCards';
import ReviewFilters from './components/ReviewFilters';
import ReviewList from './components/ReviewList';
import ReviewSidebar from './components/ReviewSidebar';
import ReviewDrawer from './components/ReviewDrawer';

export default function ReviewsPage() {
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleReviewClick = (review) => {
        setSelectedReview(review);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Customers', href: '/office/customers' },
        { label: 'Reviews' }
    ];

    const actions = (
        <>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Export
            </button>
            <button className="hidden sm:flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                <MessageSquareText className="w-4 h-4 mr-1.5" /> Reply to Reviews
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader 
                breadcrumbs={breadcrumbs}
                title="Customer Reviews"
                description="Monitor customer satisfaction, improve service quality and manage customer feedback."
                actions={actions}
            />

            <ReviewStatsCards />
            
            <ReviewFilters />

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Main Content Area */}
                <div className="flex-1 w-full flex flex-col min-w-0">
                    <ReviewList onReviewClick={handleReviewClick} />
                </div>
                
                {/* Right Sidebar Widgets (Desktop) */}
                <div className="hidden xl:block">
                    <ReviewSidebar />
                </div>
            </div>

            {/* Profile Drawer */}
            <ReviewDrawer 
                review={selectedReview}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
            
            {/* Mobile Floating Add Button */}
            <div className="fixed bottom-6 right-6 sm:hidden z-40">
                <button className="p-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 hover:bg-blue-700 transition-colors">
                    <MessageSquareText className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
