'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw, Download } from 'lucide-react';
import PageHeader from '@/components/office/PageHeader';
import PaymentStatsCards from './components/PaymentStatsCards';
import PaymentFilters from './components/PaymentFilters';
import PaymentTable from './components/PaymentTable';
import PaymentDrawer from './components/PaymentDrawer';
import ReceivePaymentModal from './components/ReceivePaymentModal';
import { apiSlice } from '@/store/apiSlice';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';
import { exportToCSV } from '@/lib/csvExport';

export default function PaymentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentToReceive, setPaymentToReceive] = useState(null);
    const dispatch = useDispatch();
    const { data: rawPayments = [], isFetching } = useGetPaymentsQuery();

    const handleRefresh = () => dispatch(apiSlice.util.invalidateTags([{ type: 'Payment', id: 'LIST' }]));
    const handleExport = () => exportToCSV('payments', rawPayments.map(p => ({
        customer: p.invoiceId?.customerId?.name || p.customerId?.name || 'Unknown',
        amount: p.amount || 0,
        paid: p.amountPaid || p.amount || 0,
        method: p.method || '',
        status: p.status || 'Pending',
        date: p.paidAt ? new Date(p.paidAt).toLocaleString() : '',
    })), [
        { key: 'customer', label: 'Customer' },
        { key: 'amount', label: 'Amount' },
        { key: 'paid', label: 'Paid' },
        { key: 'method', label: 'Method' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
    ]);

    const handleRowClick = (payment) => {
        setSelectedPayment(payment);
        setIsDrawerOpen(true);
    };

    const handleReceivePayment = (payment) => {
        setPaymentToReceive(payment);
        setIsModalOpen(true);
    };

    const breadcrumbs = [
        { label: 'HomeCare', href: '/office/dashboard' },
        { label: 'Finance' },
        { label: 'Payments' },
    ];

    const actions = (
        <>
            <button onClick={handleRefresh} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleExport} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
            </button>
        </>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative overflow-hidden bg-slate-50/50">
            <PageHeader
                breadcrumbs={breadcrumbs}
                title="Payments"
                description="Track all incoming customer payments and outstanding dues."
                actions={actions}
            />

            <PaymentStatsCards />

            <PaymentFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex flex-col min-w-0 pb-12">
                <PaymentTable 
                    searchQuery={searchQuery} 
                    onRowClick={handleRowClick} 
                    onReceivePayment={handleReceivePayment}
                />
            </div>

            <PaymentDrawer 
                payment={selectedPayment} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                onReceivePayment={(p) => {
                    setIsDrawerOpen(false);
                    handleReceivePayment(p);
                }}
            />

            <ReceivePaymentModal 
                payment={paymentToReceive}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
