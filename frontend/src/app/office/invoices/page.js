'use client';

import { useState } from 'react';
import { RefreshCw, Download, Plus } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import InvoiceStatsCards from './components/InvoiceStatsCards';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceTable from './components/InvoiceTable';
import InvoiceDrawer from './components/InvoiceDrawer';
import InvoiceEditorDrawer from './components/InvoiceEditorDrawer';

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [invoiceToEdit, setInvoiceToEdit] = useState(null);

    const handleRowClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsViewDrawerOpen(true);
    };

    const handleEditInvoice = (invoice) => {
        setInvoiceToEdit(invoice);
        setIsEditDrawerOpen(true);
    };

    const handleNewInvoice = () => {
        setInvoiceToEdit(null);
        setIsEditDrawerOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Finance' },
        { label: 'Invoices' },
    ];

    const actions = (
        <>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
            <button 
                onClick={handleNewInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
                <Plus className="w-4 h-4" /> New Invoice
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative overflow-hidden bg-slate-50/50">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Invoices"
                description="Generate and manage professional GST invoices."
                actions={actions}
            />

            <InvoiceStatsCards />

            <InvoiceFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col min-w-0 pb-12">
                <InvoiceTable 
                    searchQuery={searchQuery} 
                    onRowClick={handleRowClick} 
                    onEditInvoice={handleEditInvoice}
                />
            </div>

            <InvoiceDrawer 
                invoice={selectedInvoice} 
                isOpen={isViewDrawerOpen} 
                onClose={() => setIsViewDrawerOpen(false)} 
            />

            <InvoiceEditorDrawer 
                invoice={invoiceToEdit}
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
            />
        </div>
    );
}
