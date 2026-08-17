import { IndianRupee, Wallet, AlertCircle, TrendingUp, Clock, BarChart2, ArrowUpRight } from 'lucide-react';

const cards = [
    { title: 'Total Revenue', key: 'totalRevenue', format: (v) => `₹${v.toLocaleString()}`, trend: 'Invoiced total', icon: IndianRupee, color: 'text-blue-600 bg-blue-50', trendUp: true },
    { title: 'Collected Amount', key: 'collectedAmount', format: (v) => `₹${v.toLocaleString()}`, trend: 'Verified payments', icon: Wallet, color: 'text-emerald-600 bg-emerald-50', trendUp: true },
    { title: 'Outstanding Amount', key: 'outstandingAmount', format: (v) => `₹${v.toLocaleString()}`, trend: 'Needs follow-up', icon: AlertCircle, color: 'text-rose-600 bg-rose-50', trendUp: false },
    { title: 'Avg Invoice Value', key: 'avgBookingValue', format: (v) => `₹${v.toLocaleString()}`, trend: 'Average ticket size', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50', trendUp: true },
    { title: "Today's Revenue", key: 'todayRevenue', format: (v) => `₹${v.toLocaleString()}`, trend: 'Verified today', icon: Clock, color: 'text-amber-600 bg-amber-50', trendUp: true },
    { title: 'Monthly Growth', key: 'monthlyGrowth', format: (v) => `${v}%`, trend: 'vs last month', icon: BarChart2, color: 'text-violet-600 bg-violet-50', trendUp: null },
    { title: 'Net Profit', key: 'netProfit', format: (v) => `₹${v.toLocaleString()}`, trend: 'Collected minus expenses', icon: ArrowUpRight, color: 'text-emerald-600 bg-emerald-50', trendUp: null },
];

export default function RevenueSummaryCards({ invoices = [], payments = [], expenses = [], bookings = [] }) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);

    const verifiedPayments = payments.filter((p) => p.status === 'verified');
    const collectedAmount = verifiedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const outstandingAmount = Math.max(totalRevenue - collectedAmount, 0);

    const todayStr = now.toDateString();
    const todayRevenue = verifiedPayments.filter((p) => p.createdAt && new Date(p.createdAt).toDateString() === todayStr).reduce((acc, p) => acc + (p.amount || 0), 0);

    const thisMonthCollected = verifiedPayments.filter((p) => p.createdAt && new Date(p.createdAt) >= startOfThisMonth).reduce((acc, p) => acc + (p.amount || 0), 0);
    const lastMonthCollected = verifiedPayments.filter((p) => p.createdAt && new Date(p.createdAt) >= startOfLastMonth && new Date(p.createdAt) < startOfThisMonth).reduce((acc, p) => acc + (p.amount || 0), 0);

    const monthlyGrowth = lastMonthCollected > 0 ? (((thisMonthCollected - lastMonthCollected) / lastMonthCollected) * 100).toFixed(1) : 0;

    const avgBookingValue = invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;

    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = collectedAmount - totalExpenses;

    const summaryStats = {
        totalRevenue,
        collectedAmount,
        outstandingAmount,
        todayRevenue,
        monthlyGrowth,
        avgBookingValue,
        netProfit,
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            {cards.map((card) => {
                const Icon = card.icon;
                const value = summaryStats[card.key] ?? 0;
                const trendUp = card.trendUp === null ? value >= 0 : card.trendUp;
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
                            <p className={`text-[10px] font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>{card.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
