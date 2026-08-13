import { CalendarCheck, FileText, FileDigit, UserPlus, UserCheck } from 'lucide-react';
import QuickAction from './QuickAction';

export default function QuickActions() {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <QuickAction title="Create Booking" icon={CalendarCheck} href="/office/bookings" />
                <QuickAction title="Create Estimate" icon={FileText} href="/office/estimates" />
                <QuickAction title="Create Invoice" icon={FileDigit} href="/office/invoices" />
                <QuickAction title="Add Customer" icon={UserPlus} href="/office/customers" />
                <QuickAction title="Assign Partner" icon={UserCheck} href="/office/partners" />
            </div>
        </div>
    );
}
