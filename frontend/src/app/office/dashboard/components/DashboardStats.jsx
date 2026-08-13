import { Database, Inbox, CalendarCheck, Wrench, CreditCard, IndianRupee, Ticket } from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-6 mb-8">
            <StatCard title="Total Enquiries" value="1,284" icon={Database} subtitle="Till now" />
            <StatCard title="Today's Enquiries" value="42" icon={Inbox} trend="up" trendValue="12%" subtitle="vs last week" />
            <StatCard title="Today's Bookings" value="18" icon={CalendarCheck} trend="up" trendValue="5%" subtitle="vs last week" />
            <StatCard title="Active Jobs" value="24" icon={Wrench} />
            <StatCard title="Pending Payments" value="₹12,450" icon={CreditCard} trend="down" trendValue="2%" subtitle="vs yesterday" />
            <StatCard title="Revenue (Today)" value="₹45,200" icon={IndianRupee} trend="up" trendValue="8%" subtitle="vs yesterday" />
            <StatCard title="Pending Tickets" value="5" icon={Ticket} />
        </div>
    );
}
