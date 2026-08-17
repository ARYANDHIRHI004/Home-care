import { X, Phone, MessageCircle, UserCog, CheckCircle2, XCircle, User, Package, Wrench, StickyNote, History, Send } from 'lucide-react';
import { useState } from 'react';
import { useUpdateTicketStatusMutation, useAssignTicketPartnerMutation, useAddTicketNoteMutation } from '@/store/api/ticketApi';
import { useCreateWorkOrderMutation } from '@/store/api/workOrderApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';

const priorityConfig = {
    high:   'bg-orange-100 text-orange-700',
    normal: 'bg-amber-100 text-amber-700',
    low:    'bg-slate-100 text-slate-600',
};

const statusConfig = {
    open:         'bg-blue-50 text-blue-700',
    estimate_sent:'bg-indigo-50 text-indigo-700',
    approved:     'bg-violet-50 text-violet-700',
    assigned:     'bg-violet-50 text-violet-700',
    in_progress:  'bg-amber-50 text-amber-700',
    completed:    'bg-emerald-50 text-emerald-700',
    closed:       'bg-slate-100 text-slate-500',
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
    const [isAssigning, setIsAssigning] = useState(false);

    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation();
    const [assignPartner, { isLoading: isAssigningPartner }] = useAssignTicketPartnerMutation();
    const [addNote, { isLoading: isAddingNote }] = useAddTicketNoteMutation();
    const [createWorkOrder, { isLoading: isCreatingWO }] = useCreateWorkOrderMutation();
    const { data: partners = [] } = useGetPartnersQuery(undefined, { skip: !isAssigning });

    if (!isOpen || !complaint) return null;

    const ticket = complaint._raw || {};
    const timeline = ticket.timeline || [];
    const internalNotes = ticket.internalNotes || [];
    const customerPhone = ticket.customerPhone || ticket.customerId?.phone || '—';

    const handleStatus = async (status) => {
        try {
            await updateStatus({ id: complaint._id, status }).unwrap();
        } catch (err) {
            console.error('Failed to update ticket status', err);
        }
    };

    const handleAssign = async (partnerId) => {
        try {
            await assignPartner({ id: complaint._id, assignedPartnerId: partnerId }).unwrap();
            setIsAssigning(false);
        } catch (err) {
            console.error('Failed to assign partner', err);
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        try {
            await addNote({ id: complaint._id, text: note.trim() }).unwrap();
            setNote('');
        } catch (err) {
            console.error('Failed to add note', err);
        }
    };

    const handleReservice = async () => {
        if (!ticket.enquiryId || !ticket.customerId) return;
        if (!window.confirm('Create a new re-service Work Order for this complaint?')) return;
        try {
            await createWorkOrder({
                enquiryId: ticket.enquiryId?._id || ticket.enquiryId,
                customerId: ticket.customerId?._id || ticket.customerId,
                customerName: complaint.customer,
                customerPhone,
                priority: 'high',
            }).unwrap();
            window.alert('Re-service work order created.');
        } catch (err) {
            console.error('Failed to create re-service work order', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]" onClick={onClose}>
            <div
                className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-blue-600">{complaint.id}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priorityConfig[complaint.priority] || priorityConfig.normal}`}>{complaint.priority}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusConfig[complaint.status] || statusConfig.open}`}>{complaint.status?.replace('_', ' ')}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Created {complaint.created}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-white overflow-x-auto">
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setIsAssigning(!isAssigning)}
                            disabled={isAssigningPartner}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-60"
                        >
                            <UserCog className="w-3.5 h-3.5" /> Assign
                        </button>
                        {isAssigning && (
                            <div className="absolute left-0 top-9 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1 max-h-56 overflow-y-auto">
                                {partners.length === 0 && <div className="px-3 py-2 text-xs text-slate-400">No partners found</div>}
                                {partners.map(p => (
                                    <button key={p._id} onClick={() => handleAssign(p._id)} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleReservice}
                        disabled={isCreatingWO}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-60"
                    >
                        <Wrench className="w-3.5 h-3.5" /> Create Re-service Work Order
                    </button>
                    <a href={customerPhone !== '—' ? `tel:${customerPhone}` : undefined} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors whitespace-nowrap flex-shrink-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
                    </a>
                    <a href={customerPhone !== '—' ? `https://wa.me/91${customerPhone.replace(/\D/g, '').slice(-10)}` : undefined} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors whitespace-nowrap flex-shrink-0">
                        <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp
                    </a>
                    <button
                        onClick={() => handleStatus('completed')}
                        disabled={isUpdatingStatus}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-60"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </button>
                    <button
                        onClick={() => handleStatus('closed')}
                        disabled={isUpdatingStatus}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-60"
                    >
                        <XCircle className="w-3.5 h-3.5" /> Close
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">

                    <Section icon={User} title="Customer Details">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                {complaint.customer.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{complaint.customer}</p>
                            </div>
                        </div>
                        <InfoRow label="Phone" value={customerPhone} highlight />
                    </Section>

                    <Section icon={Package} title="Complaint Details">
                        <InfoRow label="Service" value={complaint.service} />
                        <InfoRow label="Booking ID" value={complaint.booking} highlight />
                        <InfoRow label="Partner" value={complaint.partner} />
                        <InfoRow label="Assigned To" value={complaint.assignedTo} />
                    </Section>

                    <Section icon={History} title="Timeline">
                        {timeline.length === 0 && <p className="text-xs text-slate-400">No status history recorded yet.</p>}
                        <div className="relative">
                            {timeline.map((step, i) => (
                                <div key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                                    {i < timeline.length - 1 && (
                                        <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-blue-200"></div>
                                    )}
                                    <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ring-4 ring-white bg-blue-500">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                    <div className="flex-1 flex justify-between items-start">
                                        <p className="text-sm font-medium text-slate-900 capitalize">{step.status?.replace('_', ' ')}</p>
                                        <p className="text-xs text-slate-500">{step.timestamp ? new Date(step.timestamp).toLocaleString() : '—'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section icon={StickyNote} title="Internal Notes">
                        {internalNotes.length === 0 && <p className="text-xs text-slate-400 mb-2">No notes yet.</p>}
                        {internalNotes.map((n, i) => (
                            <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-2 text-xs text-slate-700">
                                <p className="font-semibold text-slate-800 mb-1">{n.timestamp ? new Date(n.timestamp).toLocaleString() : ''}</p>
                                {n.text}
                            </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white placeholder:text-slate-400"
                                placeholder="Add an internal note..."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                            />
                            <button onClick={handleAddNote} disabled={isAddingNote || !note.trim()} className="flex-shrink-0 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    );
}
