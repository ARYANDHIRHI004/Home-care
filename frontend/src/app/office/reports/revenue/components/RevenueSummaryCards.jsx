import { IndianRupee, Wallet, AlertCircle, TrendingUp, Clock, BarChart2, ArrowUpRight } from 'lucide-react';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';
import { useGetWorkOrdersQuery } from '@/store/api/workOrderApi';

const cards = [
    {
        title: 'Total Revenue',
        key: 'totalRevenue',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: 'Till now',
        icon: IndianRupee,
        color: 'text-blue-600 bg-blue-50',
        trendUp: true,
    },
    {
        title: 'Collected Amount',
        key: 'collectedAmount',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: 'Collected successfully',
        icon: Wallet,
        color: 'text-emerald-600 bg-emerald-50',
        trendUp: true,
    },
    {
        title: 'Outstanding Amount',
        key: 'outstandingAmount',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: 'Needs follow-up',
        icon: AlertCircle,
        color: 'text-rose-600 bg-rose-50',
        trendUp: false,
    },
    {
        title: 'Avg Booking Value',
        key: 'avgBookingValue',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: 'Average ticket size',
        icon: TrendingUp,
        color: 'text-indigo-600 bg-indigo-50',
        trendUp: true,
    },
    {
        title: "Today's Revenue",
        key: 'todayRevenue',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: 'Received today',
        icon: Clock,
        color: 'text-amber-600 bg-amber-50',
        trendUp: true,
    },
    {
        title: 'Monthly Growth',
        key: 'monthlyGrowth',
        format: (v) => `${v}%`,
        trend: 'vs last month',
        icon: BarChart2,
        color: 'text-violet-600 bg-violet-50',
        trendUp: true,
    },
    {
        title: 'Est. Net Profit',
        key: 'netProfit',
        format: (v) => `₹${v.toLocaleString()}`,
        trend: '~75% of revenue',
        icon: ArrowUpRight,
        color: 'text-emerald-600 bg-emerald-50',
        trendUp: true,
    },
];

export default function RevenueSummaryCards() {
    const { data: rawPayments = [] } = useGetPaymentsQuery();
    const { data: rawWorkOrders = [] } = useGetWorkOrdersQuery();

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalRevenue = rawPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const collectedAmount = rawPayments.filter(p => p.status === 'Paid' || p.status === 'verified').reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);
    const outstandingAmount = rawPayments.filter(p => p.status === 'Pending' || p.status === 'Partial').reduce((acc, p) => acc + ((p.amount || 0) - (p.amountPaid || 0)), 0);
    
    const todayStr = now.toDateString();
    const todayRevenue = rawPayments.filter(p => p.paidAt && new Date(p.paidAt).toDateString() === todayStr).reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);

    const thisMonthRevenue = rawPayments.filter(p => p.paidAt && new Date(p.paidAt) >= startOfThisMonth).reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);
    const lastMonthRevenue = rawPayments.filter(p => p.paidAt && new Date(p.paidAt) >= startOfLastMonth && new Date(p.paidAt) < startOfThisMonth).reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);
    
    const monthlyGrowth = lastMonthRevenue > 0 ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1) : 0;
    
    const avgBookingValue = rawWorkOrders.length > 0 ? (totalRevenue / rawWorkOrders.length).toFixed(0) : 0;
    
    const netProfit = (totalRevenue * 0.75).toFixed(0);

    const summaryStats = {
        totalRevenue,
        collectedAmount,
        outstandingAmount,
        todayRevenue,
        monthlyGrowth,
        avgBookingValue: Number(avgBookingValue),
        netProfit: Number(netProfit)
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            {cards.map((card) => {
                const Icon = card.icon;
                const value = summaryStats[card.key] || 0;
                return (
                    <div key={card.key} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">{card.title}</p>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">{card.format(value)}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className={`text-[10px] font-medium ${card.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>{card.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
