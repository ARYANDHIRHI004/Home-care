import { X, Phone, MessageCircle, UserCog, CheckCircle2, XCircle, Calendar, User, Package, Wrench, Image, StickyNote, History, ChevronRight, Send } from 'lucide-react';
import { useState } from 'react';

const timeline = [
    { label: 'Complaint Submitted', date: 'Nov 04, 10:12 AM', done: true, color: 'bg-blue-500' },
    { label: 'Complaint Reviewed', date: 'Nov 04, 11:30 AM', done: true, color: 'bg-indigo-500' },
    { label: 'Re-service Work Order Created', date: 'Nov 04, 12:00 PM', done: true, color: 'bg-violet-500' },
    { label: 'Assigned to Manager', date: 'Nov 04, 01:15 PM', done: false, color: 'bg-amber-400' },
    { label: 'Work Started', date: '—', done: false, color: 'bg-slate-300' },
    { label: 'Resolved', date: '—', done: false, color: 'bg-emerald-400' },
    { label: 'Closed', date: '—', done: false, color: 'bg-slate-300' },
];

const priorityConfig = {
    Critical: 'bg-rose-100 text-rose-700',
    High:     'bg-orange-100 text-orange-700',
    Medium:   'bg-amber-100 text-amber-700',
    Low:      'bg-slate-100 text-slate-600',
};

const statusConfig = {
    New:              'bg-blue-50 text-blue-700',
    Open:             'bg-indigo-50 text-indigo-700',
    Investigating:    'bg-violet-50 text-violet-700',
    'Waiting Customer': 'bg-amber-50 text-amber-700',
    Resolved:         'bg-emerald-50 text-emerald-700',
    Closed:           'bg-slate-100 text-slate-500',
};

const Section = ({ icon: Icon, title, children }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-5">
        <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <Icon className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{title}</h4>
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const InfoRow = ({ label, value, highlight }) => (
    <div className="flex justify-between items-start py-1.5">
        <span className="text-xs text-slate-500 flex-shrink-0 w-32">{label}</span>
        <span className={`text-xs font-medium text-right ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</span>
    </div>
);

export default function ComplaintDrawer({ complaint, isOpen, onClose }) {
    const [note, setNote] = useState('');

    if (!isOpen || !complaint) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]" onClick={onClose}>
            <div
                className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-blue-600">{complaint.id}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityConfig[complaint.priority]}`}>{complaint.priority}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[complaint.status] || statusConfig['New']}`}>{complaint.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Created {complaint.created}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-white overflow-x-auto">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0">
                        <UserCog className="w-3.5 h-3.5" /> Assign
                    </button>
                    {/* "Create Ticket" replaced — a generic support ticket doesn't map to
                        anything else in this system. What actually resolves a service
                        complaint operationally is a new Work Order (e.g. the 7-day
                        re-service warranty), which is the real, trackable unit this ERP
                        already uses everywhere else. isReservice/parentComplaintId on
                        that new work order is what links it back to this complaint. */}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors whitespace-nowrap flex-shrink-0">
                        <Wrench className="w-3.5 h-3.5" /> Create Re-service Work Order
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors whitespace-nowrap flex-shrink-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors whitespace-nowrap flex-shrink-0">
                        <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors whitespace-nowrap flex-shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Close
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-5">

                    {/* Customer Details */}
                    <Section icon={User} title="Customer Details">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                {complaint.customer.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{complaint.customer}</p>
                                <p className="text-xs text-slate-500">CUST-4920 · Mumbai, MH</p>
                            </div>
                        </div>
                        <InfoRow label="Phone" value="+91 98765 43210" highlight />
                        <InfoRow label="Email" value="customer@email.com" highlight />
                        <InfoRow label="Total Complaints" value="3 complaints" />
                        <InfoRow label="Total Bookings" value="18 bookings" />
                    </Section>

                    {/* Complaint Details */}
                    <Section icon={Package} title="Complaint Details">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 text-sm text-amber-900 leading-relaxed">
                            "The technician came and fixed the AC, but it started leaking water the very next day. I tried calling the support but got no response."
                        </div>
                        <InfoRow label="Service" value={complaint.service} />
                        <InfoRow label="Booking ID" value={complaint.booking} highlight />
                        <InfoRow label="Partner" value={complaint.partner} />
                        <InfoRow label="Assigned To" value={complaint.assignedTo} />
                    </Section>

                    {/* Timeline */}
                    <Section icon={History} title="Timeline">
                        <div className="relative">
                            {timeline.map((step, i) => (
                                <div key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                                    {i < timeline.length - 1 && (
                                        <div className={`absolute left-[9px] top-5 bottom-0 w-0.5 ${step.done ? 'bg-blue-200' : 'bg-slate-100'}`}></div>
                                    )}
                                    <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ring-4 ring-white ${step.done ? step.color : 'bg-slate-200'}`}>
                                        {step.done && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </div>
                                    <div className="flex-1 flex justify-between items-start">
                                        <p className={`text-sm ${step.done ? 'font-medium text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                        <p className={`text-xs ${step.done ? 'text-slate-500' : 'text-slate-300'}`}>{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Photos */}
                    <Section icon={Image} title="Attached Photos">
                        <div className="grid grid-cols-3 gap-2">
                            {['Before', 'After', 'Issue'].map((label, i) => (
                                <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium flex-col gap-1 hover:bg-slate-200 cursor-pointer transition-colors">
                                    <Image className="w-5 h-5" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Internal Notes */}
                    <Section icon={StickyNote} title="Internal Notes">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3 text-xs text-slate-700">
                            <p className="font-semibold text-slate-800 mb-1">Riya (Manager) — Nov 04, 1:15 PM</p>
                            Customer is very upset. Escalated to Amit Kumar's supervisor. Follow up required by end of day.
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white placeholder:text-slate-400"
                                placeholder="Add an internal note..."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                            <button className="flex-shrink-0 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    );
}
