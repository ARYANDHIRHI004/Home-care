import { MoreHorizontal, FileEdit, CalendarDays, Calculator, Phone, MessageSquare, Mail, CreditCard, Trash2, ChevronDown, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useGetCustomersQuery } from '@/store/api/customerApi';

const StatusBadge = ({ status }) => {
    const styles = {
        'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Inactive': 'bg-slate-100 text-slate-600 border-slate-200',
        'Blocked': 'bg-rose-50 text-rose-700 border-rose-200',
        'VIP': 'bg-amber-50 text-amber-700 border-amber-200',
        'New': 'bg-blue-50 text-blue-700 border-blue-200',
        'Repeat': 'bg-violet-50 text-violet-700 border-violet-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['Active']}`}>
            {status}
        </span>
    );
};

export default function CustomerTable({ onCustomerClick }) {
    const [openActionId, setOpenActionId] = useState(null);
    const { data: rawCustomers = [], isLoading, isError } = useGetCustomersQuery();

    const customers = rawCustomers.map(c => ({
        id: c._id,
        displayId: `CUST-${c._id.slice(-4).toUpperCase()}`,
        name: c.name || 'Unknown',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        city: c.city || '—',
        lastBooking: c.lastBookingDate ? new Date(c.lastBookingDate).toLocaleDateString() : '—',
        totalBookings: c.totalBookings ?? 0,
        lifetimeSpend: c.lifetimeSpend ?? 0,
        rating: c.rating ?? 0,
        status: c.status || 'Active',
        avatar: (c.name || 'U').slice(0, 2).toUpperCase(),
        _raw: c,
    }));

    const toggleAction = (id) => {
        if (openActionId === id) {
            setOpenActionId(null);
        } else {
            setOpenActionId(id);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                    Customer <ChevronsUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Customer ID
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                City
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                    Last Booking <ChevronsUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Bookings
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-slate-700">
                                    LTV <ChevronsUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="relative px-4 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {isLoading && (
                            <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">Loading customers…</td></tr>
                        )}
                        {isError && (
                            <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-rose-500">Failed to load customers.</td></tr>
                        )}
                        {!isLoading && !isError && customers.length === 0 && (
                            <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">No customers found.</td></tr>
                        )}
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onCustomerClick(customer)}>
                                <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1" />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                                {customer.avatar}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-slate-900">{customer.name}</div>
                                            <div className="text-sm text-slate-500">{customer.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900 font-medium">{customer.id}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {customer.city}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {customer.lastBooking}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">
                                    {customer.totalBookings}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">
                                    ₹{customer.lifetimeSpend.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                    <StatusBadge status={customer.status} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={() => toggleAction(customer.id)}
                                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                    
                                    {/* Action Dropdown Menu */}
                                    {openActionId === customer.id && (
                                        <div className="absolute right-8 top-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10 py-1">
                                            <button onClick={() => { onCustomerClick(customer); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                                <FileEdit className="w-4 h-4 mr-2 text-slate-400" /> View Profile
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                                <CalendarDays className="w-4 h-4 mr-2 text-slate-400" /> Create Booking
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                                <Calculator className="w-4 h-4 mr-2 text-slate-400" /> Create Estimate
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                                <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" /> WhatsApp
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-blue-500" /> Call
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center">
                                                <Trash2 className="w-4 h-4 mr-2 text-rose-500" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Mock */}
            <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6 mt-auto">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{customers.length}</span> of <span className="font-medium">{customers.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                Previous
                            </button>
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-blue-50 text-sm font-medium text-blue-600">
                                1
                            </button>
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                                2
                            </button>
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                                3
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700">
                                ...
                            </span>
                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
