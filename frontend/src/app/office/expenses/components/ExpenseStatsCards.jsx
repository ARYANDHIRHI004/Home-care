import { Receipt, TrendingDown, Fuel, UserPlus, Zap } from 'lucide-react';
import { useGetExpensesQuery } from '@/store/api/expenseApi';

export default function ExpenseStatsCards() {
    const { data: rawExpenses = [] } = useGetExpensesQuery();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let totalMonthly = 0;
    let todayExpenses = 0;
    let todayCount = 0;
    let fuelTotal = 0;
    let partnerTotal = 0;
    let utilTotal = 0;
    let totalAll = 0;

    const todayStr = new Date().toLocaleDateString();

    rawExpenses.forEach(e => {
        const amt = e.amount || 0;
        const d = new Date(e.date);
        totalAll += amt;

        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            totalMonthly += amt;
        }

        if (d.toLocaleDateString() === todayStr) {
            todayExpenses += amt;
            todayCount += 1;
        }

        const cat = e.category?.toLowerCase() || '';
        if (cat.includes('fuel') || cat.includes('transport')) fuelTotal += amt;
        else if (cat.includes('partner') || cat.includes('advance')) partnerTotal += amt;
        else if (cat.includes('electric') || cat.includes('internet') || cat.includes('util')) utilTotal += amt;
    });

    const stats = [
        {
            title: 'Total Monthly Expenses',
            value: `₹${totalMonthly.toLocaleString()}`,
            trend: 'Current Month',
            icon: Receipt,
            color: 'text-rose-600 bg-rose-50',
        },
        {
            title: 'Today\'s Expenses',
            value: `₹${todayExpenses.toLocaleString()}`,
            trend: `${todayCount} transactions`,
            icon: TrendingDown,
            color: 'text-orange-600 bg-orange-50',
        },
        {
            title: 'Fuel & Transport',
            value: `₹${fuelTotal.toLocaleString()}`,
            trend: totalAll ? `${Math.round((fuelTotal/totalAll)*100)}% of total` : '0%',
            icon: Fuel,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Partner Advances',
            value: `₹${partnerTotal.toLocaleString()}`,
            trend: totalAll ? `${Math.round((partnerTotal/totalAll)*100)}% of total` : '0%',
            icon: UserPlus,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Office Utilities',
            value: `₹${utilTotal.toLocaleString()}`,
            trend: totalAll ? `${Math.round((utilTotal/totalAll)*100)}% of total` : '0%',
            icon: Zap,
            color: 'text-indigo-600 bg-indigo-50',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
