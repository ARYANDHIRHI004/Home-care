import { Star, Calendar, Zap, XCircle, RefreshCcw } from 'lucide-react';

export default function BookingInsightsPanel({ bookings = [], partners = [] }) {
    // Most Booked Service & Highest Cancellation Category
    let mostBookedService = 'N/A';
    let maxServiceBookings = 0;
    let highestCancellationCategory = 'N/A';
    let maxCancelRate = 0;

    if (bookings.length > 0) {
        const servicesMap = bookings.reduce((acc, b) => {
            const service = b.category || b.serviceName || 'Unknown Service';
            if (!acc[service]) acc[service] = { total: 0, cancelled: 0 };
            acc[service].total += 1;
            if (b.status === 'cancelled') acc[service].cancelled += 1;
            return acc;
        }, {});

        const sortedServices = Object.entries(servicesMap).sort((a, b) => b[1].total - a[1].total);
        if (sortedServices.length > 0) {
            mostBookedService = sortedServices[0][0];
            maxServiceBookings = sortedServices[0][1].total;
        }

        const sortedCancel = Object.entries(servicesMap)
            .map(([cat, stats]) => ({ cat, rate: stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0 }))
            .sort((a, b) => b.rate - a.rate);

        if (sortedCancel.length > 0 && sortedCancel[0].rate > 0) {
            highestCancellationCategory = sortedCancel[0].cat;
            maxCancelRate = sortedCancel[0].rate.toFixed(1);
        }
    }

    // Peak Booking Day
    let peakBookingDay = 'N/A';
    if (bookings.length > 0) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = bookings.reduce((acc, b) => {
            if (b.createdAt) {
                const day = new Date(b.createdAt).getDay();
                acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
        }, {});
        const maxDayIdx = Object.keys(dayCounts).sort((a, b) => dayCounts[b] - dayCounts[a])[0];
        if (maxDayIdx !== undefined) peakBookingDay = days[maxDayIdx];
    }

    // Top Partner — most completed bookings (there is no duration field to determine "fastest")
    let topPartnerName = 'N/A';
    let topPartnerJobs = 0;
    const partnerNameById = partners.reduce((acc, p) => { acc[p._id] = p.name; return acc; }, {});
    const partnerCompletions = bookings.reduce((acc, b) => {
        if (b.status !== 'completed') return acc;
        const id = b.partnerId?._id || b.partnerId;
        if (!id) return acc;
        const name = partnerNameById[id] || b.assignedTo || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});
    const sortedPartners = Object.entries(partnerCompletions).sort((a, b) => b[1] - a[1]);
    if (sortedPartners.length > 0) {
        topPartnerName = sortedPartners[0][0];
        topPartnerJobs = sortedPartners[0][1];
    }

    // Repeat Customer Rate
    let repeatCustomerRate = 0;
    const customerCounts = bookings.reduce((acc, b) => {
        const key = b.customerId?._id || b.customerId || b.phone || b.customerName;
        if (key) acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const uniqueCustomers = Object.keys(customerCounts).length;
    const repeatCustomerCount = Object.values(customerCounts).filter((count) => count > 1).length;
    if (uniqueCustomers > 0) {
        repeatCustomerRate = ((repeatCustomerCount / uniqueCustomers) * 100).toFixed(1);
    }

    const items = [
        {
            label: 'Most Booked Service',
            value: mostBookedService,
            icon: Star,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            sub: `${maxServiceBookings} bookings this period`,
        },
        {
            label: 'Peak Booking Day',
            value: peakBookingDay,
            icon: Calendar,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            sub: `Most popular day`,
        },
        {
            label: 'Top Partner',
            value: topPartnerName,
            icon: Zap,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            sub: `${topPartnerJobs} completed jobs`,
        },
        {
            label: 'Highest Cancellation',
            value: highestCancellationCategory,
            icon: XCircle,
            color: 'text-rose-600 bg-rose-50 border-rose-100',
            sub: maxCancelRate > 0 ? `${maxCancelRate}% cancel rate` : 'No cancellations yet',
        },
        {
            label: 'Repeat Customer Rate',
            value: `${repeatCustomerRate}%`,
            icon: RefreshCcw,
            color: 'text-violet-600 bg-violet-50 border-violet-100',
            sub: 'Strong loyalty signal',
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">Business Insights</h3>
                <p className="text-xs text-slate-500 mt-0.5">Key performance highlights</p>
            </div>
            <div className="space-y-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl border ${item.color} hover:brightness-95 transition-all cursor-default`}>
                            <div className="p-2.5 rounded-xl bg-white/60 flex-shrink-0">
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-70">{item.label}</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{item.value}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right flex-shrink-0 hidden sm:block max-w-[90px]">{item.sub}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
