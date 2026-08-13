import { Star, Calendar, Zap, XCircle, RefreshCcw } from 'lucide-react';
import { insights } from '../data/bookingData';

const items = [
    {
        label: 'Most Booked Service',
        value: insights.mostBookedService,
        icon: Star,
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        sub: '312 bookings this period',
    },
    {
        label: 'Peak Booking Day',
        value: insights.peakBookingDay,
        icon: Calendar,
        color: 'text-blue-600 bg-blue-50 border-blue-100',
        sub: 'Avg 88 bookings on Saturday',
    },
    {
        label: 'Fastest Partner',
        value: insights.fastestPartner,
        icon: Zap,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        sub: '4.9 ★ rating, 98% acceptance',
    },
    {
        label: 'Highest Cancellation',
        value: insights.highestCancellationCategory,
        icon: XCircle,
        color: 'text-rose-600 bg-rose-50 border-rose-100',
        sub: '12% cancel rate in this category',
    },
    {
        label: 'Repeat Customer Rate',
        value: `${insights.repeatCustomerPercentage}%`,
        icon: RefreshCcw,
        color: 'text-violet-600 bg-violet-50 border-violet-100',
        sub: 'Strong loyalty signal',
    },
];

export default function BookingInsightsPanel() {
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
