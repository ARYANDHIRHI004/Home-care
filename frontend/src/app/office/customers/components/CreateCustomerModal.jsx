'use client';
import { useState } from 'react';
import { X, UserPlus, MapPin } from 'lucide-react';
import { useCreateCustomerMutation } from '@/store/api/customerApi';

/**
 * Manual customer entry — for the office team adding someone who called in or
 * walked in, not the customer's own OTP signup on the website (that's a
 * separate, customer-facing flow and isn't this modal's job). Matches the
 * `registrationChannel: "call"` case from the database design: an admin
 * vouches for the contact here, no OTP needed at creation time.
 */
export default function CreateCustomerModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', city: 'Bhilai', addressLine: '' });
    const [error, setError] = useState('');
    const [createCustomer] = useCreateCustomerMutation();

    if (!isOpen) return null;

    function update(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!form.name.trim()) {
            setError('Enter the customer\u2019s name');
            return;
        }
        if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
            setError('Enter a valid 10-digit mobile number');
            return;
        }

        createCustomer({
            id: `CUST-${Math.floor(8000 + Math.random() * 999)}`,
            name: form.name.trim(),
            email: form.email.trim() || '—',
            phone: form.phone.startsWith('+91') ? form.phone : `+91 ${form.phone}`,
            city: form.city,
            lastBooking: '—',
            totalBookings: 0,
            lifetimeSpend: 0,
            rating: 0,
            status: 'New',
            avatar: form.name.trim().charAt(0).toUpperCase(),
            registrationChannel: 'call',
        }).unwrap();
        setForm({ name: '', phone: '', email: '', city: 'Bhilai', addressLine: '' });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-600" /> Add Customer
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                            placeholder="Priya Sharma"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                            <span className="px-3 py-2.5 bg-slate-50 text-sm text-slate-600 border-r border-slate-200">+91</span>
                            <input
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={form.phone}
                                onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                                placeholder="98765 43210"
                                className="flex-1 px-3 py-2.5 text-sm outline-none"
                                required
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Used to match this customer if they later sign in on the website — same phone number, same profile.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Email <span className="text-slate-400 normal-case font-normal">(optional)</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update('email', e.target.value)}
                            placeholder="customer@email.com"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                            <select
                                value={form.city}
                                onChange={(e) => update('city', e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                            >
                                <option value="Bhilai">Bhilai</option>
                                <option value="Durg">Durg</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Address <span className="text-slate-400 normal-case font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.addressLine}
                                    onChange={(e) => update('addressLine', e.target.value)}
                                    placeholder="Sector 6"
                                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-xs text-rose-600">{error}</p>}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <UserPlus className="w-4 h-4" /> Add Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
