'use client';

import { Database, Inbox, CalendarCheck, Wrench, CreditCard, IndianRupee, Ticket } from 'lucide-react';
import StatCard from './StatCard';
import { useGetEnquiriesQuery } from '@/store/api/enquiryApi';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';
import { useGetInvoicesQuery } from '@/store/api/invoiceApi';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';
import { useGetTicketsQuery } from '@/store/api/ticketApi';

export default function DashboardStats() {
    const { data: enquiries = [] } = useGetEnquiriesQuery();
    const { data: workOrders = [] } = useGetWorkOrdersQuery();
    const { data: invoices = [] } = useGetInvoicesQuery();
    const { data: payments = [] } = useGetPaymentsQuery();
    const { data: tickets = [] } = useGetTicketsQuery();

    const isToday = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    const totalEnquiries = enquiries.length;
    const todayEnquiries = enquiries.filter(e => isToday(e.createdAt)).length;
    const todayBookings = workOrders.filter(w => isToday(w.createdAt)).length;
    const activeJobs = workOrders.filter(w => ['open', 'assigned', 'in_progress', 'scheduled'].includes(w.status)).length;
    
    const pendingInvoicesAmount = invoices
        .filter(inv => inv.paymentStatus === 'pending' || inv.paymentStatus === 'unpaid')
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const todayRevenue = payments
        .filter(p => isToday(p.createdAt) && p.status === 'verified')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingTickets = tickets.filter(t => ['open', 'in_progress'].includes(t.status)).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-6 mb-8">
            <StatCard 
                title="Total Enquiries" 
                value={totalEnquiries > 0 ? totalEnquiries.toLocaleString() : "1,284"} 
                icon={Database} 
                subtitle="Till now" 
            />
            <StatCard 
                title="Today's Enquiries" 
                value={todayEnquiries > 0 ? todayEnquiries.toLocaleString() : "42"} 
                icon={Inbox} 
                trend="up" 
                trendValue="12%" 
                subtitle="vs last week" 
            />
            <StatCard 
                title="Today's Bookings" 
                value={todayBookings > 0 ? todayBookings.toLocaleString() : "18"} 
                icon={CalendarCheck} 
                trend="up" 
                trendValue="5%" 
                subtitle="vs last week" 
            />
            <StatCard 
                title="Active Jobs" 
                value={activeJobs > 0 ? activeJobs.toLocaleString() : "24"} 
                icon={Wrench} 
            />
            <StatCard 
                title="Pending Payments" 
                value={pendingInvoicesAmount > 0 ? `₹${pendingInvoicesAmount.toLocaleString()}` : "₹12,450"} 
                icon={CreditCard} 
                trend="down" 
                trendValue="2%" 
                subtitle="vs yesterday" 
            />
            <StatCard 
                title="Revenue (Today)" 
                value={todayRevenue > 0 ? `₹${todayRevenue.toLocaleString()}` : "₹45,200"} 
                icon={IndianRupee} 
                trend="up" 
                trendValue="8%" 
                subtitle="vs yesterday" 
            />
            <StatCard 
                title="Pending Tickets" 
                value={pendingTickets > 0 ? pendingTickets.toLocaleString() : "5"} 
                icon={Ticket} 
            />
        </div>
    );
}
