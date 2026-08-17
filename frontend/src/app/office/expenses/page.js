'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import ExpenseStatsCards from './components/ExpenseStatsCards';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import ExpenseModal from './components/ExpenseModal';
import { apiSlice } from '@/store/apiSlice';
import { useGetExpensesQuery } from '@/store/api/expenseApi';
import { exportToCSV } from '@/lib/csvExport';

export default function ExpensesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const dispatch = useDispatch();
    const { data: rawExpenses = [], isFetching } = useGetExpensesQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags(['Expense']));
    const handleExport = () => exportToCSV('expenses', rawExpenses.map(e => ({
        category: e.category,
        description: e.description,
        vendor: e.vendor || 'Unknown',
        amount: e.amount,
        method: e.paymentMethod,
        date: e.date ? new Date(e.date).toLocaleDateString('en-GB') : '',
    })), [
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'vendor', label: 'Vendor' },
        { key: 'amount', label: 'Amount' },
        { key: 'method', label: 'Payment Method' },
        { key: 'date', label: 'Date' },
    ]);

    const handleRowClick = (expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
    };

    const handleNewExpense = () => {
        setExpenseToEdit(null);
        setIsModalOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Finance' },
        { label: 'Expenses' },
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
                onClick={handleNewExpense}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> Add Expense
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative overflow-hidden bg-slate-50/50">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Expenses"
                description="Monitor operational expenses and business spending."
                actions={actions}
            />

            <ExpenseStatsCards />

            <ExpenseFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col min-w-0 pb-12">
                <ExpenseTable 
                    searchQuery={searchQuery} 
                    onRowClick={handleRowClick}
                />
            </div>

            <ExpenseModal 
                expense={expenseToEdit}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
