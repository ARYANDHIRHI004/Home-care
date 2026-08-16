import { Star, Calendar, Zap, XCircle, RefreshCcw } from 'lucide-react';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';

export default function BookingInsightsPanel() {
    const { data: rawWorkOrders = [] } = useGetWorkOrdersQuery();
    const { data: partners = [] } = useGetPartnersQuery();

    // Most Booked Service & Highest Cancellation Category
    let mostBookedService = 'N/A';
    let maxServiceBookings = 0;
    let highestCancellationCategory = 'N/A';
    let maxCancelRate = 0;
    
    if (rawWorkOrders.length > 0) {
        const servicesMap = rawWorkOrders.reduce((acc, wo) => {
            const service = wo.enquiryId?.serviceCategory || wo.title || 'Unknown Service';
            if (!acc[service]) acc[service] = { total: 0, cancelled: 0 };
            acc[service].total += 1;
            if (wo.status === 'Cancelled') acc[service].cancelled += 1;
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
    if (rawWorkOrders.length > 0) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = rawWorkOrders.reduce((acc, wo) => {
            if (wo.createdAt) {
                const day = new Date(wo.createdAt).getDay();
                acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
        }, {});
        const maxDayIdx = Object.keys(dayCounts).sort((a, b) => dayCounts[b] - dayCounts[a])[0];
        if (maxDayIdx !== undefined) peakBookingDay = days[maxDayIdx];
    }

    // Fastest Partner
    let fastestPartner = 'N/A';
    let partnerRating = 0;
    if (partners.length > 0) {
        const topPartner = [...partners].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
        if (topPartner) {
            fastestPartner = topPartner.name || 'Unknown';
            partnerRating = topPartner.rating || 4.5;
        }
    }

    // Repeat Customer Rate
    let repeatCustomerRate = 0;
    const customerCounts = rawWorkOrders.reduce((acc, wo) => {
        if (wo.customerId?._id) {
            acc[wo.customerId._id] = (acc[wo.customerId._id] || 0) + 1;
        }
        return acc;
    }, {});
    const uniqueCustomers = Object.keys(customerCounts).length;
    const repeatCustomerCount = Object.values(customerCounts).filter(count => count > 1).length;
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
            value: fastestPartner,
            icon: Zap,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            sub: `${partnerRating} ★ rating`,
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
