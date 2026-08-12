'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/office/PageHeader';
import {
    Plus, Download, RefreshCw, Filter, Search, Clock, 
    CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, MoreVertical, 
    Eye, Edit, Phone, MessageCircle, FileText, Calendar as CalendarIcon,
    Trash2, X, ChevronLeft, ChevronRight, ChevronDown, IndianRupee,
    FileDigit, Copy, Send, Mail, Printer, ThumbsUp, ThumbsDown, 
    ArrowRightLeft, Share2, History, Timer, UserPlus, FileCheck,
    CheckSquare, AlertCircle, PieChart, FileDown
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, accentColor }) => {
    const accentColors = {
        default: 'bg-blue-50 text-blue-600',
        yellow: 'bg-amber-50 text-amber-600',
        red: 'bg-rose-50 text-rose-600',
        green: 'bg-emerald-50 text-emerald-600',
        gray: 'bg-slate-100 text-slate-600',
        purple: 'bg-purple-50 text-purple-600',
        indigo: 'bg-indigo-50 text-indigo-600',
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
        'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
        'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
        'Sent': 'bg-blue-50 text-blue-700 border-blue-200',
        'Viewed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Negotiation': 'bg-purple-50 text-purple-700 border-purple-200',
        'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
        'Expired': 'bg-slate-50 text-slate-500 border-slate-200',
        'Converted': 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
        'Cancelled': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {status}
        </span>
    );
};

export default function EstimatesPage() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // details, pdf, versions
    
    // Mock Data
    const estimates = [
        { id: 'EST-4091', customer: 'Anand Mahindra', phone: '+91 98765 43210', service: 'Full Home Renovation', amount: '₹1,25,000', discount: '₹5,000', finalAmount: '₹1,20,000', validity: '3 Days Left', createdBy: 'Amit Kumar', status: 'Approved', date: 'Oct 25, 2023', initial: 'A' },
        { id: 'EST-4092', customer: 'Priya Reddy', phone: '+91 87654 32109', service: 'Office Deep Cleaning', amount: '₹15,000', discount: '₹0', finalAmount: '₹15,000', validity: '5 Days Left', createdBy: 'Neha Singh', status: 'Sent', date: 'Oct 25, 2023', initial: 'P' },
        { id: 'EST-4093', customer: 'Ratan Tata', phone: '+91 76543 21098', service: 'Annual Maintenance', amount: '₹85,000', discount: '₹10,000', finalAmount: '₹75,000', validity: 'Valid', createdBy: 'System', status: 'Converted', date: 'Oct 24, 2023', initial: 'R' },
        { id: 'EST-4094', customer: 'Sunita Sharma', phone: '+91 65432 10987', service: 'Kitchen Remodeling', amount: '₹45,000', discount: '₹2,000', finalAmount: '₹43,000', validity: 'Expired', createdBy: 'Rahul Admin', status: 'Expired', date: 'Oct 15, 2023', initial: 'S' },
        { id: 'EST-4095', customer: 'Vikram Singh', phone: '+91 54321 09876', service: 'Plumbing Contract', amount: '₹25,000', discount: '₹1,500', finalAmount: '₹23,500', validity: 'Requires Approval', createdBy: 'Priya Support', status: 'Pending Approval', date: 'Oct 26, 2023', initial: 'V' },
        { id: 'EST-4096', customer: 'Deepak Chopra', phone: '+91 43210 98765', service: 'AC Servicing (5 Units)', amount: '₹6,000', discount: '₹500', finalAmount: '₹5,500', validity: '1 Day Left', createdBy: 'Amit Kumar', status: 'Viewed', date: 'Oct 22, 2023', initial: 'D' },
    ];

    const openDrawer = (est) => {
        setSelectedRow(est);
        setIsDrawerOpen(true);
        setActiveTab('details');
    };

    return (
        <div className="pb-10 relative">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Operations', href: '#' }, { label: 'Estimates' }]}
                title="Estimates"
                description="Create, manage and track customer quotations before converting them into confirmed bookings."
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            Create Estimate
                        </button>
                    </>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
                <StatCard title="Today's Estimates" value="18" icon={FileText} trend="up" trendValue="12%" subtitle="vs yesterday" accentColor="default" />
                <StatCard title="Pending Approval" value="5" icon={Clock} subtitle="Requires manager review" accentColor="yellow" />
                <StatCard title="Approved Estimates" value="12" icon={ThumbsUp} trend="up" trendValue="5%" subtitle="Awaiting conversion" accentColor="green" />
                <StatCard title="Rejected Estimates" value="2" icon={ThumbsDown} subtitle="This week" accentColor="red" />
                <StatCard title="Converted to Booking" value="42" icon={CheckCircle2} trend="up" trendValue="15%" subtitle="Conversion rate: 68%" accentColor="indigo" />
                <StatCard title="Estimated Revenue" value="₹4.2L" icon={PieChart} subtitle="Pipeline value" accentColor="purple" />
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
                                placeholder="Search estimate ID, customer, phone..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            {['Estimate Status', 'Service Category', 'Assigned Employee', 'Price Range'].map((filter) => (
                                <button key={filter} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                                    {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
                                </button>
                            ))}
                            <button className="px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Estimate Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                                        <th className="p-4">Estimate ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Requested Service</th>
                                        <th className="p-4 text-right">Estimate Amount</th>
                                        <th className="p-4 text-right">Final Amount</th>
                                        <th className="p-4">Validity</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {estimates.length > 0 ? estimates.map((est) => (
                                        <tr key={est.id} onClick={() => openDrawer(est)} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                                            <td className="p-4 font-medium text-slate-900">{est.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                        {est.initial}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{est.customer}</div>
                                                        <div className="text-xs text-slate-500">{est.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-700 font-medium">{est.service}</td>
                                            <td className="p-4 text-right">
                                                <div className="text-slate-500 line-through text-xs">{est.amount}</div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="font-bold text-slate-900">{est.finalAmount}</div>
                                                {est.discount !== '₹0' && <div className="text-[10px] text-emerald-600 font-medium">Save {est.discount}</div>}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {est.validity.includes('Left') ? (
                                                    <span className="flex items-center gap-1.5 text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-md w-fit text-xs">
                                                        <Timer className="w-3.5 h-3.5" />
                                                        {est.validity}
                                                    </span>
                                                ) : est.validity === 'Expired' ? (
                                                    <span className="flex items-center gap-1.5 text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-md w-fit text-xs">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        {est.validity}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 text-xs font-medium">{est.validity}</span>
                                                )}
                                            </td>
                                            <td className="p-4"><StatusBadge status={est.status} /></td>
                                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative group/action">
                                                    <MoreVertical className="w-4 h-4" />
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-20 py-1">
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Eye className="w-4 h-4 text-slate-400" /> View Estimate</div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Edit className="w-4 h-4 text-slate-400" /> Edit</div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Copy className="w-4 h-4 text-slate-400" /> Duplicate</div>
                                                        <div className="border-t border-slate-100 my-1"></div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Send className="w-4 h-4 text-emerald-500" /> Share WhatsApp</div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /> Email Estimate</div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><FileDown className="w-4 h-4 text-slate-400" /> Generate PDF</div>
                                                        <div className="border-t border-slate-100 my-1"></div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-600" /> Approve</div>
                                                        <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-indigo-600 font-medium" /> Convert To Booking</div>
                                                        <div className="border-t border-slate-100 my-1"></div>
                                                        <div className="px-3 py-2 hover:bg-rose-50 text-left text-sm text-rose-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="9" className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                        <FileText className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No estimates available</h3>
                                                    <p className="text-slate-500 text-sm max-w-sm mb-6">Create your first professional quotation for a customer.</p>
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                                        Create Estimate
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
                                <span className="text-sm text-slate-500 mr-4">1-6 of 24</span>
                                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <Plus className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">New Estimate</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <Copy className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">Duplicate</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <FileDown className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">Import Pricing</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <Send className="w-5 h-5 text-slate-500 group-hover:text-blue-600 mb-1.5" />
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">Bulk Send</span>
                            </button>
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-5">
                        <h3 className="text-base font-semibold text-amber-900 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            Pending Approvals
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold text-slate-900">EST-4095</span>
                                    <span className="text-xs font-medium text-amber-600">₹23,500</span>
                                </div>
                                <div className="text-xs text-slate-500 mb-2">Requires 10% discount approval</div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 transition-colors">Approve</button>
                                    <button className="flex-1 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-xs font-medium hover:bg-rose-100 transition-colors">Reject</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiry Warning Widget */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            Upcoming Expiry
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <span className="block text-sm font-bold text-slate-900">Deepak Chopra</span>
                                    <span className="block text-xs text-slate-500">EST-4096 • Expires Tomorrow</span>
                                </div>
                                <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200">
                                    <Phone className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 sticky top-0">
                            <div>
                                <div className="text-sm font-medium text-slate-500 mb-1">{selectedRow?.id}</div>
                                <h2 className="text-xl font-bold text-slate-900">Estimate Details</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={selectedRow?.status} />
                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
                            <button 
                                onClick={() => setActiveTab('details')}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}
                            >
                                Details & Pricing
                            </button>
                            <button 
                                onClick={() => setActiveTab('pdf')}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pdf' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}
                            >
                                PDF Preview
                            </button>
                            <button 
                                onClick={() => setActiveTab('versions')}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'versions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}
                            >
                                Version History
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                            
                            {activeTab === 'details' && (
                                <>
                                    {/* Customer Alert */}
                                    {selectedRow?.status === 'Viewed' && (
                                        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-indigo-700">
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm font-medium">Customer viewed this estimate 2 hours ago.</span>
                                            </div>
                                            <button className="text-sm font-medium text-indigo-700 hover:underline">Follow up</button>
                                        </div>
                                    )}

                                    {/* Itemized Pricing */}
                                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex justify-between items-center">
                                            Itemized Pricing
                                            <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Service</button>
                                        </h4>
                                        <div className="overflow-x-auto mb-4">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-slate-500">
                                                        <th className="pb-2 font-medium">Service</th>
                                                        <th className="pb-2 font-medium text-center">Qty</th>
                                                        <th className="pb-2 font-medium text-right">Rate</th>
                                                        <th className="pb-2 font-medium text-right">Disc.</th>
                                                        <th className="pb-2 font-medium text-right">GST</th>
                                                        <th className="pb-2 font-medium text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-slate-700">
                                                    <tr className="border-b border-slate-50">
                                                        <td className="py-3 font-medium text-slate-900">{selectedRow?.service}</td>
                                                        <td className="py-3 text-center">1</td>
                                                        <td className="py-3 text-right">{selectedRow?.amount}</td>
                                                        <td className="py-3 text-right text-emerald-600">{selectedRow?.discount}</td>
                                                        <td className="py-3 text-right">18%</td>
                                                        <td className="py-3 text-right font-medium">{selectedRow?.finalAmount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-3 font-medium text-slate-900">Material Procurement Charge</td>
                                                        <td className="py-3 text-center">1</td>
                                                        <td className="py-3 text-right">₹1,500</td>
                                                        <td className="py-3 text-right text-emerald-600">₹0</td>
                                                        <td className="py-3 text-right">18%</td>
                                                        <td className="py-3 text-right font-medium">₹1,500</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm ml-auto w-full max-w-sm">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Subtotal</span>
                                                <span className="font-medium text-slate-900">{selectedRow?.amount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Discount</span>
                                                <span className="font-medium text-emerald-600">-{selectedRow?.discount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">GST (18%)</span>
                                                <span className="font-medium text-slate-900">₹4,500</span>
                                            </div>
                                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                                                <span className="font-bold text-slate-900">Grand Total</span>
                                                <span className="font-bold text-2xl text-blue-700">{selectedRow?.finalAmount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Timeline */}
                                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Estimate Timeline</h4>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Customer Viewed Estimate', date: 'Today, 2:15 PM', status: 'done', icon: Eye },
                                                { title: 'Sent via WhatsApp', date: 'Yesterday, 10:30 AM', status: 'done', icon: Send },
                                                { title: 'Manager Approved', date: 'Yesterday, 9:45 AM', status: 'done', icon: CheckSquare },
                                                { title: 'Estimate Created', date: 'Yesterday, 9:00 AM', status: 'done', icon: FileText },
                                            ].map((event, idx, arr) => (
                                                <div key={idx} className="flex gap-4 relative">
                                                    {idx !== arr.length - 1 && <div className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${event.status === 'done' ? 'bg-blue-200' : 'bg-slate-100'}`}></div>}
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${event.status === 'done' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                                        <event.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="pb-4">
                                                        <div className={`text-sm font-medium ${event.status === 'done' ? 'text-slate-900' : 'text-slate-400'}`}>{event.title}</div>
                                                        <div className="text-xs text-slate-400 mt-1">{event.date}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'pdf' && (
                                <div className="bg-slate-200 p-8 rounded-xl flex items-center justify-center min-h-[500px]">
                                    <div className="bg-white w-full max-w-lg aspect-[1/1.4] shadow-lg rounded p-8 flex flex-col relative overflow-hidden">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button className="p-2 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><Printer className="w-4 h-4" /></button>
                                            <button className="p-2 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><Download className="w-4 h-4" /></button>
                                        </div>
                                        <div className="border-b-2 border-blue-600 pb-4 mb-6">
                                            <h1 className="text-2xl font-bold text-slate-900">ESTIMATE</h1>
                                            <div className="text-xs text-slate-500 mt-1"># {selectedRow?.id}</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-sm mb-8">
                                            <div>
                                                <div className="font-bold text-slate-700 mb-1">To:</div>
                                                <div className="text-slate-900">{selectedRow?.customer}</div>
                                                <div className="text-slate-500">{selectedRow?.phone}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-slate-700 mb-1">Date:</div>
                                                <div className="text-slate-900">{selectedRow?.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                                            <div className="h-4 bg-slate-100 rounded w-3/4 mb-8"></div>
                                            
                                            <div className="h-8 bg-slate-100 rounded w-full mb-2"></div>
                                            <div className="h-8 bg-slate-100 rounded w-full mb-2"></div>
                                            <div className="h-8 bg-slate-100 rounded w-full mb-2"></div>
                                        </div>
                                        <div className="border-t border-slate-200 pt-4 text-right">
                                            <div className="text-xl font-bold text-slate-900">Total: {selectedRow?.finalAmount}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'versions' && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center py-12">
                                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-slate-900">Version History</h3>
                                    <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Compare previous quotation versions and track pricing changes over time.</p>
                                    <div className="space-y-3 max-w-md mx-auto text-left">
                                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-blue-900 text-sm">Version 2 (Current)</div>
                                                <div className="text-xs text-blue-700">Added ₹5,000 discount</div>
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">{selectedRow?.finalAmount}</div>
                                        </div>
                                        <div className="p-4 border border-slate-200 bg-white rounded-xl flex justify-between items-center opacity-70">
                                            <div>
                                                <div className="font-bold text-slate-700 text-sm">Version 1</div>
                                                <div className="text-xs text-slate-500">Initial Quote</div>
                                            </div>
                                            <div className="text-sm font-bold text-slate-500">{selectedRow?.amount}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-white z-10 grid grid-cols-3 gap-3">
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] rounded-xl text-sm font-medium hover:bg-[#25D366]/20 transition-colors shadow-sm">
                                <Send className="w-4 h-4" /> WhatsApp
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                <CheckSquare className="w-4 h-4" /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
