import { MoreHorizontal, ChevronUp, ChevronDown, Receipt, Fuel, Zap, Wifi, Users, Truck, Wrench, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useGetExpensesQuery, useDeleteExpenseMutation } from '@/store/api/expenseApi';

export default function ExpenseTable({ searchQuery, onRowClick }) {
    const { data: rawExpenses = [], isLoading } = useGetExpensesQuery();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [sortCol, setSortCol] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => sortCol === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />)
        : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />;

    const expenses = rawExpenses.map(e => ({
        id: e._id,
        displayId: `EXP-${e._id.slice(-4).toUpperCase()}`,
        category: e.category,
        description: e.description,
        vendor: e.vendor || 'Unknown',
        amount: e.amount,
        method: e.paymentMethod,
        paidBy: e.paidBy || 'N/A',
        date: new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        receipt: !!e.receiptUrl,
        _raw: e
    }));

    const filtered = expenses.filter(e =>
        !searchQuery ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.displayId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Fuel': return <Fuel className="w-4 h-4 text-amber-500" />;
            case 'Partner Advance': return <Users className="w-4 h-4 text-blue-500" />;
            case 'Electricity': return <Zap className="w-4 h-4 text-orange-500" />;
            case 'Internet': return <Wifi className="w-4 h-4 text-indigo-500" />;
            case 'Transport': return <Truck className="w-4 h-4 text-slate-500" />;
            case 'Maintenance': return <Wrench className="w-4 h-4 text-slate-500" />;
            default: return <Receipt className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Expenses</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{filtered.length} records found</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Show</span>
                    <select className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none">
                        <option>25</option><option>50</option><option>100</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="w-8 pl-5 py-3"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                            {['Expense Info', 'Vendor', 'Amount', 'Payment Info', 'Date', 'Receipt', 'Actions'].map((col, i) => (
                                <th key={i} onClick={() => col !== 'Actions' && toggleSort(col.toLowerCase())} className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${col !== 'Actions' ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        {col}
                                        {col !== 'Actions' && <SortIcon col={col.toLowerCase()} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((e) => (
                            <tr key={e.id} onClick={() => onRowClick(e)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                                <td className="pl-5 py-3.5" onClick={ev => ev.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                                            {getCategoryIcon(e.category)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{e.description}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{e.displayId} • {e.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-semibold text-slate-700">{e.vendor}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="font-bold text-rose-600">₹{e.amount.toLocaleString()}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="text-xs font-medium text-slate-700">{e.method}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">By: {e.paidBy}</div>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                                    {e.date}
                                </td>
                                <td className="px-4 py-3.5">
                                    {e.receipt ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                                            <Receipt className="w-3 h-3" /> View
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase">
                                            <ShieldAlert className="w-3 h-3" /> Missing
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5" onClick={ev => ev.stopPropagation()}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === e.id ? null : e.id)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {openMenuId === e.id && (
                                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                                <button onClick={() => onRowClick(e._raw)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit Expense</button>
                                                {!e.receipt && (
                                                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Upload Receipt</button>
                                                )}
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button onClick={() => deleteExpense(e.id)} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">No Expenses Found</h3>
                        <p className="text-slate-500 text-xs mb-4">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
            
            {filtered.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1–{filtered.length} of {filtered.length} records</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Previous</button>
                        <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</span>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40" disabled>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}
