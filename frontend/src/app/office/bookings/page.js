'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/office/PageHeader';
import {
    Plus, Download, RefreshCw, Filter, Search, Clock, 
    CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, MoreVertical, 
    Eye, Edit, Phone, MessageCircle, FileText, Calendar as CalendarIcon,
    Trash2, X, MapPin, AlertCircle, Image as ImageIcon, Paperclip, 
    ChevronLeft, ChevronRight, ChevronDown, Wrench, IndianRupee,
    CalendarCheck, UserCheck, ShieldAlert, CreditCard, LayoutGrid, CalendarDays,
    Briefcase, Banknote, List, Map, Timer, UserPlus, FileDigit
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, accentColor }) => {
    const accentColors = {
        default: 'bg-blue-50 text-blue-600',
        yellow: 'bg-amber-50 text-amber-600',
        red: 'bg-rose-50 text-rose-600',
        green: 'bg-emerald-50 text-emerald-600',
        gray: 'bg-slate-100 text-slate-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    const accent = accentColors[accentColor] || accentColors.default;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${accent}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'Pending Assignment': 'bg-amber-50 text-amber-700 border-amber-200',
        'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
        'Confirmed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Professional On The Way': 'bg-purple-50 text-purple-700 border-purple-200',
        'In Progress': 'bg-cyan-50 text-cyan-700 border-cyan-200',
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200',
        'Rescheduled': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {status}
        </span>
    );
};

const PaymentBadge = ({ status }) => {
    const styles = {
        'Pending': 'bg-rose-50 text-rose-700 border-rose-200',
        'Partially Paid': 'bg-amber-50 text-amber-700 border-amber-200',
        'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Refunded': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {status}
        </span>
    );
};

export default function BookingsPage() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    
    // Mock Data
    const bookings = [
        { id: 'BKG-9012', customer: 'Ramesh Gupta', phone: '+91 98765 43210', service: 'AC Deep Cleaning', date: 'Oct 25, 2023', time: '10:00 AM - 12:00 PM', assignedTo: 'Amit Kumar', status: 'In Progress', payment: 'Pending', amount: '₹1,299', createdBy: 'System', initial: 'R' },
        { id: 'BKG-9013', customer: 'Sneha Reddy', phone: '+91 87654 32109', service: 'Full Home Cleaning', date: 'Oct 25, 2023', time: '02:00 PM - 06:00 PM', assignedTo: 'Neha Singh', status: 'Professional On The Way', payment: 'Partially Paid', amount: '₹4,500', createdBy: 'Rahul Admin', initial: 'S' },
        { id: 'BKG-9014', customer: 'Vijay Sharma', phone: '+91 76543 21098', service: 'Plumbing Repair', date: 'Oct 25, 2023', time: '04:00 PM - 05:00 PM', assignedTo: 'Unassigned', status: 'Pending Assignment', payment: 'Pending', amount: '₹499', createdBy: 'Online', initial: 'V' },
        { id: 'BKG-9015', customer: 'Anita Desai', phone: '+91 65432 10987', service: 'Electrical Work', date: 'Oct 24, 2023', time: '11:00 AM - 01:00 PM', assignedTo: 'Rajesh Verma', status: 'Completed', payment: 'Paid', amount: '₹850', createdBy: 'Priya Support', initial: 'A' },
        { id: 'BKG-9016', customer: 'Karan Patel', phone: '+91 54321 09876', service: 'Sofa Cleaning', date: 'Oct 26, 2023', time: '09:00 AM - 11:00 PM', assignedTo: 'Suresh Kumar', status: 'Confirmed', payment: 'Paid', amount: '₹1,500', createdBy: 'System', initial: 'K' },
    ];

    const openDrawer = (bkg) => {
        setSelectedRow(bkg);
        setIsDrawerOpen(true);
    };

    return (
        <div className="pb-10 relative">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Operations', href: '#' }, { label: 'Bookings' }]}
                title="Bookings"
                description="Manage all confirmed customer bookings, assign professionals, track progress and monitor service execution."
                actions={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                <List className="w-4 h-4" />
                                List
                            </button>
                            <button 
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                <CalendarDays className="w-4 h-4" />
                                Calendar
                            </button>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            Create Booking
                        </button>
                    </>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
                <StatCard title="Today's Bookings" value="48" icon={CalendarCheck} trend="up" trendValue="12%" subtitle="vs yesterday" accentColor="default" />
                <StatCard title="Active Jobs" value="12" icon={Wrench} subtitle="Currently in progress" accentColor="purple" />
                <StatCard title="Completed Today" value="15" icon={CheckCircle2} trend="up" trendValue="5%" subtitle="Successfully finished" accentColor="green" />
                <StatCard title="Scheduled Tomorrow" value="32" icon={Clock} subtitle="Upcoming bookings" accentColor="yellow" />
                <StatCard title="Pending Assignment" value="8" icon={UserPlus} subtitle="Action required" accentColor="red" />
                <StatCard title="Cancelled Bookings" value="3" icon={XCircle} trend="down" trendValue="2%" subtitle="This week" accentColor="gray" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
                {/* Main Content Area */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Search and Filters */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search booking ID, customer, phone..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            {['Booking Status', 'Service Category', 'Assigned Partner', 'Date Range', 'Payment Status', 'Priority'].map((filter) => (
                                <button key={filter} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                                    {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
                                </button>
                            ))}
                            <button className="px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Booking Table */}
                    {viewMode === 'list' ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                                            <th className="p-4">Booking ID</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Service</th>
                                            <th className="p-4">Schedule</th>
                                            <th className="p-4">Assigned To</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Payment</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {bookings.length > 0 ? bookings.map((bkg) => (
                                            <tr key={bkg.id} onClick={() => openDrawer(bkg)} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                                <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                                                <td className="p-4 font-medium text-slate-900">{bkg.id}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                            {bkg.initial}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{bkg.customer}</div>
                                                            <div className="text-xs text-slate-500">{bkg.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-700 font-medium">{bkg.service}</td>
                                                <td className="p-4">
                                                    <div className="text-slate-900 font-medium">{bkg.date}</div>
                                                    <div className="text-xs text-slate-500">{bkg.time}</div>
                                                </td>
                                                <td className="p-4 text-slate-600">
                                                    {bkg.assignedTo !== 'Unassigned' ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                                {bkg.assignedTo.charAt(0)}
                                                            </div>
                                                            {bkg.assignedTo}
                                                        </div>
                                                    ) : (
                                                        <button className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 text-xs font-medium hover:bg-amber-100 transition-colors" onClick={(e) => { e.stopPropagation(); alert('Assign Professional Modal'); }}>
                                                            Assign Now
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-4"><StatusBadge status={bkg.status} /></td>
                                                <td className="p-4"><PaymentBadge status={bkg.payment} /></td>
                                                <td className="p-4 font-medium text-slate-900">{bkg.amount}</td>
                                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative group/action">
                                                        <MoreVertical className="w-4 h-4" />
                                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-20 py-1">
                                                            <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Eye className="w-4 h-4 text-slate-400" /> View Details</div>
                                                            <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Edit className="w-4 h-4 text-slate-400" /> Edit Booking</div>
                                                            <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><UserPlus className="w-4 h-4 text-slate-400" /> Assign Professional</div>
                                                            <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-slate-400" /> Reschedule</div>
                                                            <div className="border-t border-slate-100 my-1"></div>
                                                            <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><FileDigit className="w-4 h-4 text-slate-400" /> Generate Invoice</div>
                                                            <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><List className="w-4 h-4 text-slate-400" /> Customer Timeline</div>
                                                            <div className="border-t border-slate-100 my-1"></div>
                                                            <div className="px-3 py-2 hover:bg-rose-50 text-left text-sm text-rose-600 flex items-center gap-2"><XCircle className="w-4 h-4" /> Cancel Booking</div>
                                                        </div>
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="10" className="p-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                            <Briefcase className="w-8 h-8 text-slate-300" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No bookings available</h3>
                                                        <p className="text-slate-500 text-sm max-w-sm mb-6">Bookings created from enquiries or manual entry will appear here.</p>
                                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                                            Create First Booking
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="border-t border-slate-100 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>Rows per page:</span>
                                    <select className="bg-transparent font-medium text-slate-700 focus:outline-none">
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500 mr-4">1-5 of 48</span>
                                    <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 transition-colors">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 p-12 text-center flex flex-col items-center justify-center h-[500px]">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Calendar View</h3>
                            <p className="text-slate-500 max-w-md">Interactive calendar view for drag & drop rescheduling, workload visualization, and capacity planning.</p>
                            <button onClick={() => setViewMode('list')} className="mt-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                                Switch back to List View
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Live Status Widget */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-700">Running Jobs</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">12</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-700">Upcoming (2h)</span>
                                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">5</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="text-sm font-medium text-rose-800">Delayed Jobs</span>
                                <span className="text-sm font-bold text-rose-600 bg-white px-2 py-0.5 rounded-md shadow-sm">2</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 mt-2">
                                <span className="text-sm font-medium text-slate-700">Pros Available</span>
                                <span className="text-sm font-bold text-slate-900">24 / 80</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-slate-400" />
                            Today's Revenue
                        </h3>
                        <div className="mb-4">
                            <div className="text-3xl font-bold text-slate-900">₹42,500</div>
                            <div className="text-sm text-emerald-600 font-medium flex items-center gap-1 mt-1">
                                <ArrowUpRight className="w-4 h-4" /> +15.2% vs yesterday
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Online/UPI</span>
                                <span className="font-medium text-slate-900">₹28,000</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full w-[65%]"></div>
                            </div>
                            <div className="flex justify-between text-sm mt-3">
                                <span className="text-slate-500">Cash Collection</span>
                                <span className="font-medium text-slate-900">₹14,500</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full w-[35%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Cards */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <Plus className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">New Booking</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <UserPlus className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">Assign Pro</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <FileDigit className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">Invoice</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <CalendarIcon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">Reschedule</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 sticky top-0">
                            <div>
                                <div className="text-sm font-medium text-slate-500 mb-1">{selectedRow?.id}</div>
                                <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                            
                            {/* Customer & Service Info */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                                {selectedRow?.status === 'Pending Assignment' && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                                )}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                                        {selectedRow?.initial}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900">{selectedRow?.customer}</h3>
                                        <p className="text-sm text-slate-500">{selectedRow?.phone}</p>
                                    </div>
                                    <StatusBadge status={selectedRow?.status} />
                                </div>
                                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 mb-4">
                                    <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Service Requested</div>
                                    <div className="text-sm font-bold text-slate-900">{selectedRow?.service}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Schedule</div>
                                        <div className="text-sm font-medium text-slate-900">{selectedRow?.date}</div>
                                        <div className="text-xs text-slate-500">{selectedRow?.time}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</div>
                                        <div className="text-sm font-medium text-slate-900 truncate">124, Shanti Nagar, Mumbai</div>
                                        <button className="text-xs text-blue-600 hover:underline mt-0.5 font-medium">View on Map</button>
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Professional */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center justify-between">
                                    Assigned Professional
                                    {selectedRow?.status === 'In Progress' && (
                                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full normal-case">
                                            <Timer className="w-3 h-3" /> ETA: 15 mins
                                        </span>
                                    )}
                                </h4>
                                {selectedRow?.assignedTo !== 'Unassigned' ? (
                                    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {selectedRow?.assignedTo.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{selectedRow?.assignedTo}</div>
                                                <div className="text-xs text-slate-500">Expert Technician • ⭐ 4.8</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                                                <Phone className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-4 border border-dashed border-amber-300 bg-amber-50 rounded-xl">
                                        <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-amber-800 mb-1">No Professional Assigned</div>
                                        <div className="text-xs text-amber-600 mb-3">Assign a partner to confirm the booking.</div>
                                        <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 shadow-sm transition-colors w-full">
                                            Assign Professional Now
                                        </button>
                                    </div>
                                )}
                                {selectedRow?.assignedTo !== 'Unassigned' && (
                                     <button className="w-full mt-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                                        Reassign Partner
                                    </button>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex justify-between items-center">
                                    Payment Details
                                    <PaymentBadge status={selectedRow?.payment} />
                                </h4>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Service Charge</span>
                                        <span className="font-medium text-slate-900">₹{selectedRow?.amount.replace('₹', '')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Taxes (18% GST)</span>
                                        <span className="font-medium text-slate-900">₹{(parseInt(selectedRow?.amount.replace('₹', '').replace(',', '')) * 0.18).toFixed(0)}</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex justify-between">
                                        <span className="font-bold text-slate-900">Total Amount</span>
                                        <span className="font-bold text-blue-700">₹{(parseInt(selectedRow?.amount.replace('₹', '').replace(',', '')) * 1.18).toFixed(0)}</span>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors">
                                    <FileDigit className="w-4 h-4" /> View Invoice
                                </button>
                            </div>

                            {/* Service Timeline */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Service Timeline</h4>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Service Started', date: 'Today, 10:15 AM', status: selectedRow?.status === 'In Progress' || selectedRow?.status === 'Completed' ? 'done' : 'pending' },
                                        { title: 'Reached Location', date: 'Today, 10:05 AM', status: selectedRow?.status === 'In Progress' || selectedRow?.status === 'Completed' || selectedRow?.status === 'Professional On The Way' ? 'done' : 'pending' },
                                        { title: 'Professional Assigned', date: 'Yesterday, 4:30 PM', status: selectedRow?.assignedTo !== 'Unassigned' ? 'done' : 'pending' },
                                        { title: 'Booking Confirmed', date: 'Yesterday, 4:10 PM', status: 'done' },
                                    ].map((event, idx, arr) => (
                                        <div key={idx} className="flex gap-4 relative">
                                            {idx !== arr.length - 1 && <div className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${event.status === 'done' ? 'bg-blue-200' : 'bg-slate-100'}`}></div>}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${event.status === 'done' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                                {event.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-200"></div>}
                                            </div>
                                            <div className="pb-4">
                                                <div className={`text-sm font-medium ${event.status === 'done' ? 'text-slate-900' : 'text-slate-400'}`}>{event.title}</div>
                                                <div className="text-xs text-slate-400 mt-1">{event.status === 'done' ? event.date : '--'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-white z-10 flex gap-3">
                            <button className="flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-center">
                                Edit
                            </button>
                            <button className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                                <CheckCircle2 className="w-4 h-4" /> Mark Completed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
