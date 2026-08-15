import { X, Phone, Mail, MapPin, Calendar, CreditCard, Clock, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Activity } from 'lucide-react';
import { useState } from 'react';

export default function CustomerProfileDrawer({ customer, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'history', label: 'Booking History', icon: Calendar },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'notes', label: 'Notes & Comms', icon: FileText },
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/20 backdrop-blur-sm transition-opacity">
            <div className="absolute inset-y-0 right-0 w-full max-w-md md:max-w-xl lg:max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">Customer Profile</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {customer ? (
                        <>
                            {/* Profile Header Summary */}
                            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="h-20 w-20 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold shadow-inner">
                                    {customer.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
                                        {customer.status === 'VIP' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                <ShieldCheck className="w-3 h-3 mr-1" /> VIP Customer
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm mb-3">Customer ID: {customer.id} • Registered Oct 2022</p>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center text-slate-600">
                                            <Phone className="w-4 h-4 mr-2 text-slate-400" /> {customer.phone}
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <Mail className="w-4 h-4 mr-2 text-slate-400" /> {customer.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
                                <div className="p-4 text-center">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lifetime Spend</p>
                                    <p className="text-lg font-bold text-slate-900">₹{customer.lifetimeSpend?.toLocaleString()}</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Bookings</p>
                                    <p className="text-lg font-bold text-slate-900">{customer.totalBookings}</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Avg Rating</p>
                                    <p className="text-lg font-bold text-slate-900">{customer.rating} ★</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Health Score</p>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-lg font-bold text-emerald-600">92/100</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="border-b border-slate-200">
                                <nav className="flex -mb-px px-6 gap-6 overflow-x-auto" aria-label="Tabs">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`
                                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                                                    ${activeTab === tab.id 
                                                        ? 'border-blue-500 text-blue-600' 
                                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                                                `}
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        {/* Address Section */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Saved Addresses
                                            </h3>
                                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-2">Home</span>
                                                <p className="text-sm text-slate-700 font-medium">A-402, Sunshine Apartments</p>
                                                <p className="text-sm text-slate-500">Andheri West, {customer.city} - 400053</p>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Customer Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Residential</span>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Premium</span>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Returning</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {activeTab === 'history' && (
                                    <div className="text-center py-10">
                                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500">Booking history will be displayed here.</p>
                                    </div>
                                )}
                                
                                {activeTab === 'notes' && (
                                    <div className="text-center py-10">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500">Internal notes and communication timeline.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500">Select a customer to view details.</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {customer && (
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                            Edit Profile
                        </button>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
                                WhatsApp
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                Create Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
