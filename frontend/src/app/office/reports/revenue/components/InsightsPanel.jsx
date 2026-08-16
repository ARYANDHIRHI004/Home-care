import { TrendingUp, Star, User, AlertCircle, Receipt } from 'lucide-react';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';
import { useGetCustomersQuery } from '@/store/api/customerApi';

export default function InsightsPanel() {
    const { data: rawWorkOrders = [] } = useGetWorkOrdersQuery();
    const { data: payments = [] } = useGetPaymentsQuery();
    const { data: customers = [] } = useGetCustomersQuery();

    // Highest Paying Customer
    let highestPayingCustomer = 'N/A';
    let highestSpend = 0;
    if (customers.length > 0) {
        const topCustomer = [...customers].sort((a, b) => (b.lifetimeSpend || 0) - (a.lifetimeSpend || 0))[0];
        if (topCustomer) {
            highestPayingCustomer = topCustomer.name || 'Unknown';
            highestSpend = topCustomer.lifetimeSpend || 0;
        }
    }

    // Best Selling Service
    let bestSellingService = 'N/A';
    let maxServiceBookings = 0;
    if (rawWorkOrders.length > 0) {
        const servicesMap = rawWorkOrders.reduce((acc, wo) => {
            const service = wo.enquiryId?.serviceCategory || wo.title || 'Unknown Service';
            acc[service] = (acc[service] || 0) + 1;
            return acc;
        }, {});
        const sortedServices = Object.entries(servicesMap).sort((a, b) => b[1] - a[1]);
        if (sortedServices.length > 0) {
            bestSellingService = sortedServices[0][0];
            maxServiceBookings = sortedServices[0][1];
        }
    }

    // Outstanding Collections
    const outstandingCollections = payments.filter(p => p.status === 'Pending' || p.status === 'Partial')
        .reduce((acc, p) => acc + ((p.amount || 0) - (p.amountPaid || 0)), 0);

    // Avg Invoice Value
    const totalPayments = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const avgInvoiceValue = payments.length > 0 ? (totalPayments / payments.length).toFixed(0) : 0;

    const items = [
        {
            label: 'Highest Revenue Month',
            value: new Date().toLocaleString('default', { month: 'long' }),
            icon: TrendingUp,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            sub: 'Based on current year data',
        },
        {
            label: 'Best Selling Service',
            value: bestSellingService,
            icon: Star,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            sub: `${maxServiceBookings} bookings this year`,
        },
        {
            label: 'Top Paying Customer',
            value: highestPayingCustomer,
            icon: User,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            sub: `₹${Number(highestSpend).toLocaleString()} total spend`,
        },
        {
            label: 'Outstanding Collections',
            value: `₹${(outstandingCollections / 1000).toFixed(1)}K`,
            icon: AlertCircle,
            color: 'text-rose-600 bg-rose-50 border-rose-100',
            sub: 'Requires follow-up',
        },
        {
            label: 'Average Invoice Value',
            value: `₹${Number(avgInvoiceValue).toLocaleString()}`,
            icon: Receipt,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            sub: 'Per booking average',
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">Key Insights</h3>
                <p className="text-xs text-slate-500 mt-0.5">Performance highlights for selected period</p>
            </div>
            <div className="space-y-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl border ${item.color} transition-all hover:brightness-95 cursor-default`}>
                            <div className={`p-2.5 rounded-xl bg-white/60 flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-current/70 uppercase tracking-wider mb-0.5">{item.label}</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{item.value}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right flex-shrink-0 hidden sm:block max-w-[100px]">{item.sub}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
