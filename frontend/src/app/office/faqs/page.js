'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Plus, Search, Edit2, Trash2, MessageCircleQuestion } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import FaqDrawer from './components/FaqDrawer';
import { apiSlice } from '@/store/apiSlice';
import { useGetFaqsQuery, useDeleteFaqMutation, useToggleFaqMutation } from '@/store/api/faqApi';

export default function FaqsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'published'
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch = useDispatch();

    const { data: faqs = [], isFetching } = useGetFaqsQuery();
    const [deleteFaq] = useDeleteFaqMutation();
    const [toggleFaq] = useToggleFaqMutation();

    const pendingCount = faqs.filter(f => f.status === 'pending').length;

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Faq', id: 'LIST' }]));

    const handleFaqClick = (faq) => {
        setSelectedFaq(faq);
        setIsDrawerOpen(true);
    };

    const handleNewFaq = () => {
        setSelectedFaq(null);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this FAQ?')) {
            await deleteFaq(id);
        }
    };

    const handleToggle = async (e, id) => {
        e.stopPropagation();
        await toggleFaq(id);
    };

    const filteredFaqs = faqs.filter(faq =>
        (statusFilter === 'all' || faq.status === statusFilter) &&
        (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (faq.answer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Content Management' },
        { label: 'FAQs' },
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={handleNewFaq}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> New FAQ
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Frequently Asked Questions"
                description="Manage the FAQs displayed on the customer website."
                actions={actions}
            />

            {/* Sticky Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 sticky top-20 z-10 space-y-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        placeholder="Search FAQs by question, answer, or category..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'pending', label: `Pending Review${pendingCount ? ` (${pendingCount})` : ''}` },
                        { id: 'published', label: 'Published' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                statusFilter === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : tab.id === 'pending' && pendingCount > 0
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Question</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">Order</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                                <tr 
                                    key={faq._id} 
                                    onClick={() => handleFaqClick(faq)}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="max-w-[400px] truncate font-medium text-slate-900">{faq.question}</div>
                                            {faq.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 shrink-0">
                                                    <MessageCircleQuestion className="w-3 h-3" /> Needs Answer
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-w-[400px] truncate text-slate-500 text-xs mt-1">
                                            {faq.answer || (faq.submittedByName ? `Submitted by ${faq.submittedByName}` : 'No answer yet')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {faq.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600">{faq.order}</td>
                                    <td className="px-6 py-4">
                                        {faq.status === 'pending' ? (
                                            <span className="text-xs font-medium text-amber-600">Pending</span>
                                        ) : (
                                            <button
                                                onClick={(e) => handleToggle(e, faq._id)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${faq.active ? 'bg-green-500' : 'bg-slate-300'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${faq.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleFaqClick(faq); }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, faq._id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="w-8 h-8 text-slate-300 mb-3" />
                                            <p className="text-base font-medium text-slate-900">No FAQs found</p>
                                            <p className="text-sm">We couldn't find anything matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FaqDrawer 
                faq={selectedFaq} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}
