import { X, User, ShieldCheck, CreditCard, Activity, Briefcase, FileText, Upload, Calendar, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function PartnerDrawer({ partner, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');
    
    if (!isOpen) return null;

    const isNew = !partner;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'performance', label: 'Performance & Schedule', icon: Activity },
        { id: 'history', label: 'Work History', icon: Briefcase },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Profile Section */}
                <div className="bg-slate-900 px-8 pt-8 pb-0 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                    
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10">
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-white border-4 border-slate-800 shadow-xl flex items-center justify-center overflow-hidden">
                            <User className="w-12 h-12 text-slate-300" />
                        </div>
                        <div className="pt-2 flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {isNew ? 'Add New Partner' : partner.name}
                                </h2>
                                {!isNew && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        Active
                                    </span>
                                )}
                            </div>
                            
                            {!isNew && (
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-slate-300">
                                    <div className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {partner.phone}</div>
                                    <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-slate-400" /> {partner.id}</div>
                                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {partner.skill}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex gap-6 mt-8 relative z-10 border-b border-white/10">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors relative ${
                                        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    <div className="max-w-3xl mx-auto">
                        
                        {/* TAB: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Personal Details */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-600" /> Personal Details
                                        </h3>
                                        {!isNew && <button className="text-blue-600 text-xs font-semibold hover:underline">Edit</button>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
                                            <input type="text" defaultValue={partner?.name || ''} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
                                            <input type="text" defaultValue={partner?.phone || ''} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
                                            <input type="email" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" placeholder="Optional" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Emergency Contact</label>
                                            <input type="text" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Address</label>
                                            <textarea rows={2} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none"></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Details */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-blue-600" /> Professional Info
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Primary Skill</label>
                                            <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                                                <option>Plumbing</option>
                                                <option>Deep Cleaning</option>
                                                <option>Electrical</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Years of Experience</label>
                                            <input type="number" defaultValue={5} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Service Areas (Zones)</label>
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">North Zone <X className="w-3 h-3 cursor-pointer" /></span>
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">East Zone <X className="w-3 h-3 cursor-pointer" /></span>
                                                <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50">+ Add Area</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-blue-600" /> Bank Details
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Account Holder Name</label>
                                            <input type="text" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Bank Name</label>
                                            <input type="text" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Account Number</label>
                                            <input type="password" placeholder="•••• •••• 1234" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono tracking-wider" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">IFSC Code</label>
                                            <input type="text" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 uppercase" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: DOCUMENTS */}
                        {activeTab === 'documents' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-800">Verification Pending</h4>
                                        <p className="text-xs text-amber-700/80 mt-1">Please upload and verify the Police Verification document to fully activate this partner.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { title: 'Aadhaar Card', status: 'verified', desc: 'Front & Back uploaded' },
                                        { title: 'PAN Card', status: 'verified', desc: 'Uploaded' },
                                        { title: 'Police Verification', status: 'pending', desc: 'Required before first job' },
                                        { title: 'Bank Passbook', status: 'uploaded', desc: 'Awaiting admin approval' },
                                        { title: 'Training Certificate', status: 'missing', desc: 'Optional' },
                                    ].map((doc, i) => (
                                        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900">{doc.title}</h4>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">{doc.desc}</p>
                                                </div>
                                                {doc.status === 'verified' && <span className="bg-emerald-100 text-emerald-700 p-1 rounded-md"><ShieldCheck className="w-4 h-4" /></span>}
                                                {doc.status === 'pending' && <span className="bg-amber-100 text-amber-700 p-1 rounded-md"><Clock className="w-4 h-4" /></span>}
                                                {doc.status === 'uploaded' && <span className="bg-blue-100 text-blue-700 p-1 rounded-md"><FileText className="w-4 h-4" /></span>}
                                            </div>
                                            
                                            {doc.status === 'missing' || doc.status === 'pending' ? (
                                                <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
                                                    <Upload className="w-3.5 h-3.5" /> Upload File
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors">View</button>
                                                    {doc.status === 'uploaded' && (
                                                        <button className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors">Approve</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB: PERFORMANCE */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Completion Rate</p>
                                        <p className="text-2xl font-bold text-slate-900">96%</p>
                                        <p className="text-[10px] text-emerald-600 mt-1">Excellent standing</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Customer Rating</p>
                                        <p className="text-2xl font-bold text-slate-900">4.8</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Based on 120 reviews</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Total Earnings</p>
                                        <p className="text-2xl font-bold text-slate-900">₹42.5K</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Lifetime</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" /> Today's Schedule
                                    </h3>
                                    
                                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-white"></div>
                                            <p className="text-xs font-bold text-slate-900">10:00 AM - 12:00 PM</p>
                                            <p className="text-sm text-slate-700 mt-0.5">AC Servicing • Booking #1024</p>
                                            <p className="text-xs text-emerald-600 font-medium mt-1">Completed</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white animate-pulse"></div>
                                            <p className="text-xs font-bold text-slate-900">02:00 PM - 04:00 PM</p>
                                            <p className="text-sm text-slate-700 mt-0.5">Deep Cleaning • Booking #1028</p>
                                            <p className="text-xs text-blue-600 font-medium mt-1">On Job (Current)</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full ring-4 ring-white"></div>
                                            <p className="text-xs font-bold text-slate-400">05:30 PM - 06:30 PM</p>
                                            <p className="text-sm text-slate-400 mt-0.5">Plumbing Inspection • Booking #1031</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1">Upcoming</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: HISTORY */}
                        {activeTab === 'history' && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-5 py-3 text-xs font-semibold text-slate-500">Date</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-slate-500">Booking</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-slate-500">Service</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-slate-500">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[1,2,3,4].map(i => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-5 py-3 text-slate-600">Oct 12, 2023</td>
                                                <td className="px-5 py-3 font-medium text-blue-600">#BKG-102{i}</td>
                                                <td className="px-5 py-3 text-slate-700">Deep Cleaning</td>
                                                <td className="px-5 py-3 text-amber-500 font-bold flex items-center gap-1">5.0 <Star className="w-3 h-3 fill-amber-500" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                        {isNew ? 'Register Partner' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
