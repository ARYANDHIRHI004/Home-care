'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/office/PageHeader';
import {
    Plus, Download, RefreshCw, Filter, Search, Inbox, Clock, Flame, 
    CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, MoreVertical, 
    Eye, Edit, Phone, MessageCircle, FileText, Calendar, ArrowRightLeft, 
    Trash2, X, MapPin, AlertCircle, Image as ImageIcon, Paperclip, 
    ChevronLeft, ChevronRight, ChevronDown
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, accentColor }) => {
    const accentColors = {
        default: 'bg-blue-50 text-blue-600',
        yellow: 'bg-amber-50 text-amber-600',
        red: 'bg-rose-50 text-rose-600',
        green: 'bg-emerald-50 text-emerald-600',
        gray: 'bg-slate-100 text-slate-600',
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

const PriorityBadge = ({ priority }) => {
    const styles = {
        Low: 'bg-slate-50 text-slate-700 border-slate-200',
        Medium: 'bg-blue-50 text-blue-700 border-blue-200',
        High: 'bg-amber-50 text-amber-700 border-amber-200',
        Urgent: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[priority] || styles.Low}`}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'New': 'bg-blue-50 text-blue-700 border-blue-200',
        'Contacted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Requirement Understood': 'bg-purple-50 text-purple-700 border-purple-200',
        'Estimate Sent': 'bg-amber-50 text-amber-700 border-amber-200',
        'Negotiation': 'bg-orange-50 text-orange-700 border-orange-200',
        'Converted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Lost': 'bg-slate-100 text-slate-700 border-slate-200',
        'Closed': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.New}`}>
            {status}
        </span>
    );
};

const SourceBadge = ({ source }) => {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
            {source}
        </span>
    );
};

export default function EnquiriesPage() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Mock Data
    const enquiries = [
        { id: 'ENQ-8021', customer: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', service: 'AC Deep Cleaning', source: 'Website', priority: 'High', assignedTo: 'Amit Kumar', nextFollowUp: 'Today, 2:00 PM', status: 'Estimate Sent', date: 'Oct 24, 2023', initial: 'R' },
        { id: 'ENQ-8022', customer: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 87654 32109', service: 'Full Home Cleaning', source: 'WhatsApp', priority: 'Urgent', assignedTo: 'Neha Singh', nextFollowUp: 'Tomorrow, 10:00 AM', status: 'New', date: 'Oct 24, 2023', initial: 'P' },
        { id: 'ENQ-8023', customer: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 76543 21098', service: 'Plumbing Repair', source: 'Phone', priority: 'Medium', assignedTo: 'Rajesh Verma', nextFollowUp: 'Oct 26, 4:00 PM', status: 'Contacted', date: 'Oct 23, 2023', initial: 'V' },
        { id: 'ENQ-8024', customer: 'Anita Desai', email: 'anita.d@example.com', phone: '+91 65432 10987', service: 'Electrical Work', source: 'Instagram', priority: 'Low', assignedTo: 'Unassigned', nextFollowUp: 'None', status: 'Lost', date: 'Oct 22, 2023', initial: 'A' },
        { id: 'ENQ-8025', customer: 'Suresh Kumar', email: 'suresh.k@example.com', phone: '+91 54321 09876', service: 'Pest Control', source: 'Google Business', priority: 'High', assignedTo: 'Amit Kumar', nextFollowUp: 'Today, 5:00 PM', status: 'Negotiation', date: 'Oct 22, 2023', initial: 'S' },
    ];

    const openDrawer = (enq) => {
        setSelectedRow(enq);
        setIsDrawerOpen(true);
    };

    return (
        <div className="pb-10 relative">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Operations', href: '#' }, { label: 'Enquiries' }]}
                title="Enquiries"
                description="Manage and track all incoming customer enquiries from every channel before they become bookings."
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter className="w-4 h-4" />
                            Advanced Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            New Enquiry
                        </button>
                    </>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
                <StatCard title="Today's Enquiries" value="124" icon={Inbox} trend="up" trendValue="14%" subtitle="from all channels" accentColor="default" />
                <StatCard title="Pending Follow-ups" value="38" icon={Clock} subtitle="Action required today" accentColor="yellow" />
                <StatCard title="Hot Leads" value="15" icon={Flame} subtitle="High intent to book" accentColor="red" />
                <StatCard title="Converted Today" value="42" icon={CheckCircle2} trend="up" trendValue="5%" subtitle="Booking created" accentColor="green" />
                <StatCard title="Lost Enquiries" value="7" icon={XCircle} trend="down" trendValue="2%" subtitle="Could not convert" accentColor="gray" />
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search customer, phone, enquiry ID..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {['Status', 'Priority', 'Service Category', 'Lead Source', 'Assigned Employee', 'Date Range'].map((filter) => (
                        <button key={filter} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                            {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                    ))}
                    <button className="px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                                <th className="p-4">Enquiry ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Requested Service</th>
                                <th className="p-4">Source</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Assigned To</th>
                                <th className="p-4">Next Follow-up</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {enquiries.length > 0 ? enquiries.map((enq) => (
                                <tr key={enq.id} onClick={() => openDrawer(enq)} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                                    <td className="p-4 font-medium text-slate-900">{enq.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                {enq.initial}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{enq.customer}</div>
                                                <div className="text-xs text-slate-500">{enq.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{enq.phone}</td>
                                    <td className="p-4 text-slate-700 font-medium">{enq.service}</td>
                                    <td className="p-4"><SourceBadge source={enq.source} /></td>
                                    <td className="p-4"><PriorityBadge priority={enq.priority} /></td>
                                    <td className="p-4 text-slate-600">
                                        {enq.assignedTo !== 'Unassigned' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                    {enq.assignedTo.charAt(0)}
                                                </div>
                                                {enq.assignedTo}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-600 text-xs">
                                        {enq.nextFollowUp !== 'None' ? (
                                            <div className="flex items-center gap-1.5 text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-md w-fit">
                                                <Clock className="w-3.5 h-3.5" />
                                                {enq.nextFollowUp}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">None</span>
                                        )}
                                    </td>
                                    <td className="p-4"><StatusBadge status={enq.status} /></td>
                                    <td className="p-4 text-slate-500">{enq.date}</td>
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative group/action">
                                            <MoreVertical className="w-4 h-4" />
                                            {/* Action Dropdown (simulated) */}
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-10 py-1">
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Eye className="w-4 h-4 text-slate-400" /> View Details</div>
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Edit className="w-4 h-4 text-slate-400" /> Edit Enquiry</div>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Phone className="w-4 h-4 text-blue-500" /> Call</div>
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp</div>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> Create Estimate</div>
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Schedule Follow-up</div>
                                                <div className="px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-700 flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-emerald-600" /> Convert to Booking</div>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <div className="px-3 py-2 hover:bg-rose-50 text-left text-sm text-rose-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="12" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Inbox className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-1">No enquiries yet</h3>
                                            <p className="text-slate-500 text-sm max-w-sm mb-6">Customer enquiries from website, phone, WhatsApp and social channels will appear here.</p>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                                Create First Enquiry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
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
                        <span className="text-sm text-slate-500 mr-4">1-5 of 124</span>
                        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
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
                                <h2 className="text-xl font-bold text-slate-900">Enquiry Details</h2>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                            
                            {/* Customer Information */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                                        {selectedRow?.initial}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900">{selectedRow?.customer}</h3>
                                        <p className="text-sm text-slate-500">{selectedRow?.email}</p>
                                    </div>
                                    <StatusBadge status={selectedRow?.status} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Phone</div>
                                        <div className="text-sm font-medium text-slate-900">{selectedRow?.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Source</div>
                                        <SourceBadge source={selectedRow?.source} />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address</div>
                                    <div className="text-sm font-medium text-slate-900">124, Shanti Nagar, Andheri East, Mumbai 400059</div>
                                </div>
                            </div>

                            {/* Service Request */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Service Request</h4>
                                <div className="mb-4">
                                    <div className="text-xs text-slate-500 mb-1">Requested Service</div>
                                    <div className="text-base font-semibold text-blue-700">{selectedRow?.service}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Problem Description</div>
                                    <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        AC is making a loud noise and not cooling properly for the last 2 days. Need immediate assistance.
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Uploaded Images</div>
                                    <div className="flex gap-2">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Follow-up Card */}
                            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                                <div className="flex items-center gap-2 mb-3 text-amber-800">
                                    <Clock className="w-5 h-5" />
                                    <h4 className="font-bold">Next Follow-up</h4>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-amber-100 flex items-center justify-between mb-3">
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{selectedRow?.nextFollowUp}</div>
                                        <div className="text-xs text-slate-500">Call to discuss estimate</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 mb-1">Assigned to</div>
                                        <div className="text-sm font-medium text-slate-900">{selectedRow?.assignedTo}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 px-3 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
                                        Reschedule
                                    </button>
                                    <button className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm">
                                        Mark Completed
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Activity Timeline</h4>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Estimate Sent', date: 'Today, 11:30 AM', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                                        { title: 'Customer Called', desc: 'Discussed requirements', date: 'Today, 10:15 AM', icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                        { title: 'Assigned to Amit Kumar', date: 'Yesterday, 4:30 PM', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-50' },
                                        { title: 'Enquiry Created', date: 'Yesterday, 4:10 PM', icon: Inbox, color: 'text-slate-500', bg: 'bg-slate-100' }
                                    ].map((event, idx) => (
                                        <div key={idx} className="flex gap-4 relative">
                                            {idx !== 3 && <div className="absolute left-4 top-8 bottom-[-16px] w-0.5 bg-slate-100"></div>}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${event.bg} ${event.color}`}>
                                                <event.icon className="w-4 h-4" />
                                            </div>
                                            <div className="pb-4">
                                                <div className="text-sm font-medium text-slate-900">{event.title}</div>
                                                {event.desc && <div className="text-xs text-slate-600 mt-0.5">{event.desc}</div>}
                                                <div className="text-xs text-slate-400 mt-1">{event.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Internal Notes</h4>
                                <div className="space-y-4 mb-4">
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-700">Amit Kumar</span>
                                            <span className="text-[10px] text-slate-400">Oct 24, 10:20 AM</span>
                                        </div>
                                        <p className="text-sm text-slate-600">Customer is comparing prices with Urban Company. Needs a small discount to close.</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        rows="3" 
                                        placeholder="Add a note..." 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                    ></textarea>
                                    <button className="absolute right-3 bottom-3 p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-white z-10 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                <Phone className="w-4 h-4 text-blue-600" /> Call
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] rounded-xl text-sm font-medium hover:bg-[#25D366]/20 transition-colors shadow-sm">
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                            <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                <ArrowRightLeft className="w-4 h-4" /> Convert to Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Ensure UserPlus is imported for the timeline
import { UserPlus } from 'lucide-react';
