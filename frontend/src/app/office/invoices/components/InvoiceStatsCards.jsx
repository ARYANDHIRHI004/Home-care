import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useGetInvoicesQuery } from '@/store/api/invoiceApi';

export default function InvoiceStatsCards() {
    const { data: rawInvoices = [] } = useGetInvoicesQuery();

    const totalInvoices = rawInvoices.length;
    
    const paidInvoices = rawInvoices.filter(inv => inv.paymentStatus === 'Paid' || inv.status === 'Paid');
    const totalPaid = paidInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

    const pendingInvoices = rawInvoices.filter(inv => inv.paymentStatus === 'Pending' || inv.status === 'Pending' || inv.status === 'Draft' || inv.status === 'Sent');
    const totalPending = pendingInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

    const overdueInvoices = rawInvoices.filter(inv => inv.paymentStatus === 'Failed' || inv.status === 'Overdue');
    const totalOverdue = overdueInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthInvoices = rawInvoices.filter(inv => inv.createdAt && new Date(inv.createdAt) >= startOfMonth);

    const stats = [
        {
            title: 'Total Invoices',
            value: totalInvoices.toLocaleString(),
            trend: `+${thisMonthInvoices.length} this month`,
            icon: FileText,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Paid',
            value: paidInvoices.length.toLocaleString(),
            trend: `₹${totalPaid.toLocaleString()} collected`,
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Pending',
            value: pendingInvoices.length.toLocaleString(),
            trend: `₹${totalPending.toLocaleString()} outstanding`,
            icon: Clock,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Overdue',
            value: overdueInvoices.length.toLocaleString(),
            trend: `₹${totalOverdue.toLocaleString()} overdue`,
            icon: AlertCircle,
            color: 'text-rose-600 bg-rose-50',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 font-medium">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
