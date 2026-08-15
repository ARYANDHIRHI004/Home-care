'use client';

import { X, User, ShieldCheck, CreditCard, Activity, Briefcase, FileText, Calendar, Star, Phone, Mail, MapPin, Loader2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCreatePartnerMutation, useUpdatePartnerMutation } from '@/store/api/partnerApi';

export default function PartnerDrawer({ partner, isOpen, onClose }) {
    const isNew = !partner || !partner._raw;
    const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
    const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();

    const [activeTab, setActiveTab] = useState('overview');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [skill, setSkill] = useState('Plumbing');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (partner && partner._raw) {
            setName(partner._raw.name || '');
            setPhone(partner._raw.phone || '');
            setSkill(partner._raw.skills?.[0] || 'Plumbing');
        } else if (partner) {
            setName(partner.name || '');
            setPhone(partner.phone || '');
            setSkill(partner.skill || 'Plumbing');
        } else {
            setName('');
            setPhone('');
            setSkill('Plumbing');
        }
        setErrorMsg('');
    }, [partner, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim()) {
            setErrorMsg('Partner name is required');
            return;
        }

        if (!phone.trim()) {
            setErrorMsg('Partner phone is required');
            return;
        }

        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            skills: [skill],
            active: true,
        };

        try {
            if (partner && partner._raw && partner._raw._id) {
                await updatePartner({ id: partner._raw._id, ...payload }).unwrap();
            } else {
                await createPartner(payload).unwrap();
            }
            onClose();
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to save partner.');
        }
    };

    const isSubmitting = isCreating || isUpdating;

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
                        <div className="w-20 h-20 rounded-2xl bg-white border-4 border-slate-800 shadow-xl flex items-center justify-center overflow-hidden font-bold text-2xl text-slate-700">
                            {name ? name.charAt(0).toUpperCase() : <User className="w-10 h-10 text-slate-300" />}
                        </div>
                        <div className="pt-1 flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {isNew ? 'Add New Partner' : (name || partner?.name)}
                                </h2>
                                {!isNew && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        {partner?.status || 'Active'}
                                    </span>
                                )}
                            </div>
                            
                            {!isNew && (
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-slate-300">
                                    <div className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {phone || partner?.phone}</div>
                                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {skill || partner?.skill}</div>
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
                                    type="button"
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
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                                    {errorMsg}
                                </div>
                            )}

                            {/* TAB: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-in fade-in duration-200">
                                    {/* Personal Details */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-600" /> Partner Details
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                                                <input 
                                                    type="text" 
                                                    value={name} 
                                                    onChange={e => setName(e.target.value)} 
                                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                                    placeholder="e.g. Rajesh Kumar"
                                                    required 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                                                <input 
                                                    type="text" 
                                                    value={phone} 
                                                    onChange={e => setPhone(e.target.value)} 
                                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                                    placeholder="+91 98765 43210"
                                                    required 
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Skill / Category</label>
                                                <select 
                                                    value={skill} 
                                                    onChange={e => setSkill(e.target.value)} 
                                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                                >
                                                    <option value="Plumbing">Plumbing</option>
                                                    <option value="AC Repair">AC Repair</option>
                                                    <option value="Deep Cleaning">Deep Cleaning</option>
                                                    <option value="Electrical">Electrical</option>
                                                    <option value="Pest Control">Pest Control</option>
                                                    <option value="Painting">Painting</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PERFORMANCE */}
                            {activeTab === 'performance' && (
                                <div className="space-y-6 animate-in fade-in duration-200">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-semibold text-slate-500 mb-1">Completed Jobs</p>
                                            <p className="text-2xl font-bold text-slate-900">{partner?.jobs || 24}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-semibold text-slate-500 mb-1">Average Rating</p>
                                            <p className="text-2xl font-bold text-slate-900">{partner?.rating || 4.8}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                                            <p className="text-2xl font-bold text-emerald-600">Active</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: DOCUMENTS */}
                            {activeTab === 'documents' && (
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-600" /> Verification Documents
                                    </h3>
                                    <p className="text-xs text-slate-500">Aadhaar Card, Police Verification, and Skills Certifications.</p>
                                    <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500 bg-slate-50">
                                        Documents are automatically verified during partner onboarding.
                                    </div>
                                </div>
                            )}

                            {/* TAB: HISTORY */}
                            {activeTab === 'history' && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">Date</th>
                                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">Booking</th>
                                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">Service</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-5 py-3 text-slate-600">Recent</td>
                                                <td className="px-5 py-3 font-medium text-blue-600">#WO-2026-1024</td>
                                                <td className="px-5 py-3 text-slate-700">{skill}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 z-10">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> {isNew ? 'Register Partner' : 'Save Changes'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
