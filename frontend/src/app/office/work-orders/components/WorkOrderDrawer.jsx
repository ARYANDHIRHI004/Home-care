import { X, User, MapPin, Package, Clock, CheckSquare, Plus, FileText, Image, StickyNote, History, CheckCircle2, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const timeline = [
    { label: 'Booking Confirmed', date: 'Nov 04, 09:00 AM', done: true },
    { label: 'Work Order Created', date: 'Nov 04, 09:05 AM', done: true },
    { label: 'Partner Assigned', date: 'Nov 04, 09:30 AM', done: true },
    { label: 'Partner Accepted', date: 'Nov 04, 09:45 AM', done: true },
    { label: 'Partner Reached', date: '—', done: false },
    { label: 'Work Started', date: '—', done: false },
    { label: 'Completed', date: '—', done: false },
    { label: 'Invoice Generated', date: '—', done: false },
    { label: 'Closed', date: '—', done: false },
];

const Section = ({ icon: Icon, title, children, action }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-5 bg-white">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{title}</h4>
            </div>
            {action && <div>{action}</div>}
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const InfoRow = ({ label, value, highlight }) => (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-xs text-slate-500 flex-shrink-0 w-32">{label}</span>
        <span className={`text-xs font-medium text-right ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</span>
    </div>
);

export default function WorkOrderDrawer({ workOrder, isOpen, onClose }) {
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Customer Verified', done: true },
        { id: 2, text: 'Before Photos Uploaded', done: true },
        { id: 3, text: 'Work Started', done: true },
        { id: 4, text: 'Materials Recorded', done: false },
        { id: 5, text: 'After Photos Uploaded', done: false },
        { id: 6, text: 'Customer Signature', done: false }
    ]);

    const toggleCheck = (id) => {
        setChecklist(checklist.map(c => c.id === id ? { ...c, done: !c.done } : c));
    };

    if (!isOpen || !workOrder) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-4xl bg-slate-50 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-bold text-slate-900">{workOrder.id}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">Booking {workOrder.bookingId}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Medium Priority</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">{workOrder.service}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex-shrink-0 flex flex-wrap items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                        Assign Partner
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                        Update Status
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                        Generate Invoice
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors ml-auto">
                        Close Work Order
                    </button>
                </div>

                {/* Scrollable Body - 2 Columns */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Main Content (Left Column) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Service Details */}
                            <Section icon={Package} title="Service Details">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 text-sm text-blue-900 leading-relaxed">
                                    "Customer requested special attention to the master bedroom AC which has been making noise."
                                </div>
                                <InfoRow label="Service Name" value={workOrder.service} />
                                <InfoRow label="Category" value="AC & Appliance" />
                                <InfoRow label="Est. Duration" value="2 Hours" />
                            </Section>

                            {/* Editable Work Items Table */}
                            <Section icon={FileText} title="Work Items & Estimate" action={<button className="text-xs font-medium text-blue-600 hover:text-blue-700">+ Add Item</button>}>
                                <div className="overflow-x-auto -mx-4 px-4 pb-2">
                                    <table className="w-full text-xs text-left whitespace-nowrap">
                                        <thead>
                                            <tr className="text-slate-500 border-b border-slate-100">
                                                <th className="font-semibold py-2">Service / Item</th>
                                                <th className="font-semibold py-2">Qty</th>
                                                <th className="font-semibold py-2 text-right">Unit Price</th>
                                                <th className="font-semibold py-2 text-right">Tax (18%)</th>
                                                <th className="font-semibold py-2 text-right">Total</th>
                                                <th className="w-8"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="group">
                                                <td className="py-2.5 font-medium text-slate-800">{workOrder.service}</td>
                                                <td className="py-2.5"><input type="number" defaultValue="1" className="w-12 border border-slate-200 rounded px-1.5 py-0.5 text-center focus:outline-none focus:border-blue-500" /></td>
                                                <td className="py-2.5 text-right">₹1,200</td>
                                                <td className="py-2.5 text-right text-slate-500">₹216</td>
                                                <td className="py-2.5 text-right font-medium text-slate-900">₹1,416</td>
                                                <td className="py-2.5 text-right"><X className="w-3.5 h-3.5 text-slate-300 hover:text-rose-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-auto" /></td>
                                            </tr>
                                            <tr className="group">
                                                <td className="py-2.5 font-medium text-slate-800">Visiting Charge</td>
                                                <td className="py-2.5"><input type="number" defaultValue="1" className="w-12 border border-slate-200 rounded px-1.5 py-0.5 text-center focus:outline-none focus:border-blue-500" /></td>
                                                <td className="py-2.5 text-right">₹299</td>
                                                <td className="py-2.5 text-right text-slate-500">₹54</td>
                                                <td className="py-2.5 text-right font-medium text-slate-900">₹353</td>
                                                <td className="py-2.5 text-right"><X className="w-3.5 h-3.5 text-slate-300 hover:text-rose-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-auto" /></td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="border-t-2 border-slate-100">
                                            <tr>
                                                <td colSpan="4" className="py-3 text-right font-semibold text-slate-600">Grand Total</td>
                                                <td className="py-3 text-right font-bold text-slate-900 text-sm">₹1,769</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded hover:bg-slate-200 font-medium">+ Add Material Cost</button>
                                    <button className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded hover:bg-slate-200 font-medium">+ Add Discount</button>
                                </div>
                            </Section>

                            {/* Checklist */}
                            <Section icon={CheckSquare} title="Operational Checklist">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    {checklist.map(item => (
                                        <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                checked={item.done}
                                                onChange={() => toggleCheck(item.id)}
                                                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                            <span className={`text-sm select-none ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                {item.text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </Section>

                            {/* Photos */}
                            <Section icon={Image} title="Photo Gallery" action={<button className="text-xs font-medium text-blue-600 hover:text-blue-700">+ Upload</button>}>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {['Before 1', 'Before 2', 'After 1'].map((label, i) => (
                                        <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium flex-col gap-1 hover:bg-slate-200 cursor-pointer transition-colors relative group">
                                            <Image className="w-5 h-5" />
                                            <span className="text-[10px]">{label}</span>
                                        </div>
                                    ))}
                                    <div className="aspect-square bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                </div>
                            </Section>

                            {/* Internal Notes */}
                            <Section icon={StickyNote} title="Notes & Communication">
                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3 text-xs text-slate-700">
                                    <p className="font-semibold text-slate-800 mb-1">System (Auto) — Nov 04, 09:45 AM</p>
                                    Partner accepted the job and is preparing to leave.
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-400"
                                        placeholder="Add an internal note..."
                                    />
                                    <button className="flex-shrink-0 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                                        Post Note
                                    </button>
                                </div>
                            </Section>
                        </div>

                        {/* Sidebar Content (Right Column) */}
                        <div className="space-y-6">
                            
                            {/* Customer Info */}
                            <Section icon={User} title="Customer">
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                        {workOrder.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{workOrder.customer}</p>
                                        <p className="text-xs text-slate-500">Premium Customer</p>
                                    </div>
                                </div>
                                <InfoRow label="Phone" value="+91 98765 43210" highlight />
                                <InfoRow label="Address" value="402, Elite Tower, Andheri W." />
                                <button className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                    <MapPin className="w-3.5 h-3.5" /> View on Map
                                </button>
                            </Section>

                            {/* Assigned Partner */}
                            <Section icon={User} title="Assigned Partner">
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                        {workOrder.assignedTo.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{workOrder.assignedTo}</p>
                                        <p className="text-xs text-slate-500">Rating: 4.8 ★ (124 jobs)</p>
                                    </div>
                                </div>
                                <InfoRow label="Status" value={workOrder.status} />
                                <button className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                    Replace Partner
                                </button>
                            </Section>

                            {/* Timeline */}
                            <Section icon={History} title="Job Timeline">
                                <div className="relative pl-1">
                                    {timeline.map((step, i) => (
                                        <div key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                                            {i < timeline.length - 1 && (
                                                <div className={`absolute left-[3px] top-4 bottom-0 w-0.5 ${step.done ? 'bg-blue-200' : 'bg-slate-100'}`}></div>
                                            )}
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 z-10 ${step.done ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-200'}`}></div>
                                            <div>
                                                <p className={`text-xs ${step.done ? 'font-medium text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                                <p className={`text-[10px] ${step.done ? 'text-slate-500' : 'text-slate-300'}`}>{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
