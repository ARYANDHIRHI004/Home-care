'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Plus, Search } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import CategoryStatsCards from './components/CategoryStatsCards';
import CategoryGrid from './components/CategoryGrid';
import CategoryDrawer from './components/CategoryDrawer';
import { apiSlice } from '@/store/apiSlice';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { exportToCSV } from '@/lib/csvExport';

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const { data: rawCategories = [], isFetching } = useGetCategoriesQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Category', id: 'LIST' }]));
    const handleExport = () => exportToCSV('categories', rawCategories.map(c => ({
        name: c.name,
        description: c.description || '',
        servicesCount: c.servicesCount ?? '',
        status: c.status || (c.isActive === false ? 'Inactive' : 'Active'),
    })), [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'servicesCount', label: 'Services Count' },
        { key: 'status', label: 'Status' },
    ]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsDrawerOpen(true);
    };

    const handleNewCategory = () => {
        setSelectedCategory(null);
        setIsDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Service Management' },
        { label: 'Categories' },
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleExport} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button 
                onClick={handleNewCategory}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> New Category
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Service Categories"
                description="Organize and manage all home service categories available on the platform."
                actions={actions}
            />

            <CategoryStatsCards />

            {/* Sticky Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 sticky top-20 z-10">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        placeholder="Search categories by name or description..."
                    />
                </div>
            </div>

            <CategoryGrid searchQuery={searchQuery} onCategoryClick={handleCategoryClick} />

            <CategoryDrawer 
                category={selectedCategory} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}
