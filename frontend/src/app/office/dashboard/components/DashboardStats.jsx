'use client';

import { Database, Inbox, CalendarCheck, Wrench, CreditCard, IndianRupee, Ticket } from 'lucide-react';
import StatCard from './StatCard';
import { useGetEnquiriesQuery } from '@/store/api/enquiryApi';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';
import { useGetInvoicesQuery } from '@/store/api/invoiceApi';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';

export default function DashboardStats() {
    const { data: enquiries = [] } = useGetEnquiriesQuery();
    const { data: workOrders = [] } = useGetWorkOrdersQuery();
    const { data: invoices = [] } = useGetInvoicesQuery();
    const { data: payments = [] } = useGetPaymentsQuery();

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

    const pendingTickets = workOrders.filter(w => ['New', 'Open', 'In Progress'].includes(w.status)).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-6 mb-8">
            <StatCard 
                title="Total Enquiries" 
                value={totalEnquiries.toLocaleString()} 
                icon={Database} 
                subtitle="Till now" 
            />
            <StatCard 
                title="Today's Enquiries" 
                value={todayEnquiries.toLocaleString()} 
                icon={Inbox} 
                trend="up" 
                trendValue="" 
                subtitle="vs last week" 
            />
            <StatCard 
                title="Today's Bookings" 
                value={todayBookings.toLocaleString()} 
                icon={CalendarCheck} 
                trend="up" 
                trendValue="" 
                subtitle="vs last week" 
            />
            <StatCard 
                title="Active Jobs" 
                value={activeJobs.toLocaleString()} 
                icon={Wrench} 
            />
            <StatCard 
                title="Pending Payments" 
                value={`₹${pendingInvoicesAmount.toLocaleString()}`} 
                icon={CreditCard} 
                trend="down" 
                trendValue="" 
                subtitle="vs yesterday" 
            />
            <StatCard 
                title="Revenue (Today)" 
                value={`₹${todayRevenue.toLocaleString()}`} 
                icon={IndianRupee} 
                trend="up" 
                trendValue="" 
                subtitle="vs yesterday" 
            />
            <StatCard 
                title="Pending Tickets" 
                value={pendingTickets.toLocaleString()} 
                icon={Ticket} 
            />
        </div>
    );
}
