import { TrendingUp, Star, User, AlertCircle, Receipt } from 'lucide-react';

export default function InsightsPanel({ invoices = [], payments = [], bookings = [], expenses = [] }) {
    // Highest Revenue Month (within the currently loaded invoices)
    let highestRevenueMonth = 'N/A';
    if (invoices.length > 0) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthTotals = invoices.reduce((acc, inv) => {
            if (!inv.createdAt) return acc;
            const m = new Date(inv.createdAt).getMonth();
            acc[m] = (acc[m] || 0) + (inv.total || 0);
            return acc;
        }, {});
        const sortedMonths = Object.entries(monthTotals).sort((a, b) => b[1] - a[1]);
        if (sortedMonths.length > 0) highestRevenueMonth = monthNames[sortedMonths[0][0]];
    }

    // Best Selling Service
    let bestSellingService = 'N/A';
    let maxServiceBookings = 0;
    if (bookings.length > 0) {
        const servicesMap = bookings.reduce((acc, b) => {
            const service = b.serviceName || b.category || 'Unknown Service';
            acc[service] = (acc[service] || 0) + 1;
            return acc;
        }, {});
        const sortedServices = Object.entries(servicesMap).sort((a, b) => b[1] - a[1]);
        if (sortedServices.length > 0) {
            bestSellingService = sortedServices[0][0];
            maxServiceBookings = sortedServices[0][1];
        }
    }

    // Top Paying Customer
    let highestPayingCustomer = 'N/A';
    let highestSpend = 0;
    if (bookings.length > 0) {
        const customerMap = bookings.reduce((acc, b) => {
            const key = b.customerId?._id || b.customerId || b.phone || b.customerName;
            if (!key) return acc;
            if (!acc[key]) acc[key] = { name: b.customerName || 'Unknown', total: 0 };
            acc[key].total += (b.amount || 0);
            return acc;
        }, {});
        const sortedCustomers = Object.values(customerMap).sort((a, b) => b.total - a.total);
        if (sortedCustomers.length > 0) {
            highestPayingCustomer = sortedCustomers[0].name;
            highestSpend = sortedCustomers[0].total;
        }
    }

    // Outstanding Collections
    const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const collectedAmount = payments.filter((p) => p.status === 'verified').reduce((acc, p) => acc + (p.amount || 0), 0);
    const outstandingCollections = Math.max(totalRevenue - collectedAmount, 0);

    // Average Invoice Value
    const avgInvoiceValue = invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;

    const items = [
        {
            label: 'Highest Revenue Month',
            value: highestRevenueMonth,
            icon: TrendingUp,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            sub: 'Based on loaded invoices',
        },
        {
            label: 'Best Selling Service',
            value: bestSellingService,
            icon: Star,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            sub: `${maxServiceBookings} bookings`,
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
            sub: 'Per invoice average',
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
