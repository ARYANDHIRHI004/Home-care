import { IndianRupee, Clock, TrendingUp, AlertCircle, CheckCircle2, Wallet } from 'lucide-react';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';

export default function PaymentStatsCards() {
    const { data: rawPayments = [] } = useGetPaymentsQuery();

    const totalReceived = rawPayments.reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);
    
    const pendingPayments = rawPayments.filter(p => p.status === 'Pending' || p.status === 'Partial');
    const pendingAmount = pendingPayments.reduce((acc, p) => acc + ((p.amount || 0) - (p.amountPaid || 0)), 0);
    
    const now = new Date();
    const todayStr = now.toDateString();
    const todayPayments = rawPayments.filter(p => p.paidAt && new Date(p.paidAt).toDateString() === todayStr);
    const todayCollection = todayPayments.reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthPayments = rawPayments.filter(p => p.paidAt && new Date(p.paidAt) >= startOfMonth);
    const monthRevenue = monthPayments.reduce((acc, p) => acc + (p.amountPaid || p.amount || 0), 0);

    const overduePayments = rawPayments.filter(p => p.status === 'Failed' || (p.status === 'Pending' && p.createdAt && new Date(p.createdAt) < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)));
    const overdueAmount = overduePayments.reduce((acc, p) => acc + ((p.amount || 0) - (p.amountPaid || 0)), 0);

    const stats = [
        {
            title: 'Total Payments Received',
            value: `₹${totalReceived.toLocaleString()}`,
            trend: '+12% from last month',
            icon: IndianRupee,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Pending Payments',
            value: `₹${pendingAmount.toLocaleString()}`,
            trend: `${pendingPayments.length} invoices unpaid`,
            icon: Clock,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Today\'s Collection',
            value: `₹${todayCollection.toLocaleString()}`,
            trend: `${todayPayments.length} payments today`,
            icon: Wallet,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'This Month Revenue',
            value: `₹${monthRevenue.toLocaleString()}`,
            trend: 'Projected: ₹4.5L',
            icon: TrendingUp,
            color: 'text-indigo-600 bg-indigo-50',
        },
        {
            title: 'Overdue Payments',
            value: `₹${overdueAmount.toLocaleString()}`,
            trend: 'Needs immediate follow-up',
            icon: AlertCircle,
            color: 'text-rose-600 bg-rose-50',
        },
        {
            title: 'Avg. Collection Time',
            value: '4 Days',
            trend: 'Improved by 1 day',
            icon: CheckCircle2,
            color: 'text-slate-600 bg-slate-100',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider line-clamp-1">{stat.title}</p>
                        <p className="text-xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 font-medium">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
