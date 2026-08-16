'use client';
import { useState } from 'react';
import Dialog from '@/components/office/ui/Dialog';
import { useCreateEnquiryMutation } from '@/store/api/enquiryApi';
import { useGetEnumsQuery } from '@/store/api/configApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { useGetServiceAreasQuery } from '@/store/api/serviceAreaApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function CreateEnquiryModal({ isOpen, onClose }) {
    const { data: enums = {} } = useGetEnumsQuery();
    const { data: categories = [] } = useGetCategoriesQuery('active=true');
    const { data: services = [] } = useGetServicesQuery('active=true');
    const { data: serviceAreas = [] } = useGetServiceAreasQuery();
    const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();
    
    // Extract unique cities from service areas
    const uniqueCities = Array.from(new Set(serviceAreas.map(area => area.city).filter(Boolean)));
    const [form, setForm] = useState({
        name: '', phone: '', altPhone: '', email: '',
        address: '', city: '', serviceCategory: '', specificService: '',
        priority: 'normal', preferredDate: '', preferredTime: '',
        source: 'call', status: 'new', description: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const resetForm = () => setForm({
        name: '', phone: '', altPhone: '', email: '',
        address: '', city: '', serviceCategory: '', specificService: '',
        priority: 'normal', preferredDate: '', preferredTime: '',
        source: 'call', status: 'new', description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await createEnquiry(form).unwrap();
            resetForm();
            onClose();
        } catch (err) {
            setError(err?.data?.message || 'Failed to create enquiry. Please try again.');
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Create New Enquiry" maxWidth="max-w-2xl">
            <div className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name *</label>
                            <input required name="name" value={form.name} onChange={handleChange} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. Rahul Sharma" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                            <input required name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="+91" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Alternative Phone</label>
                            <input name="altPhone" value={form.altPhone} onChange={handleChange} type="tel" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="+91" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address (Optional)</label>
                            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="email@example.com" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address / Location</label>
                        <input name="address" value={form.address} onChange={handleChange} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="Building, Street, Area" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                            <select name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="">Select City</option>
                                {uniqueCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Category *</label>
                            <select required name="serviceCategory" value={form.serviceCategory} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Specific Service</label>
                            <select name="specificService" value={form.specificService} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="">Select Service</option>
                                {services
                                    .filter(s => !form.serviceCategory || s.categoryId?.name === form.serviceCategory)
                                    .map(s => (
                                    <option key={s._id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                {(enums.workOrder?.priority || ['low', 'normal', 'high']).map(p => (
                                    <option key={p} value={p}>{formatEnum(p)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Date</label>
                            <input name="preferredDate" value={form.preferredDate} onChange={handleChange} type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Time Slot</label>
                            <select name="preferredTime" value={form.preferredTime} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                <option value="">Select Time Slot</option>
                                {(enums.enquiry?.timeSlots || ['9 - 11', '11 - 1', '2 - 4', '4 - 6']).map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lead Source</label>
                            <select name="source" value={form.source} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                {(enums.enquiry?.source || ['call', 'website', 'whatsapp', 'facebook', 'instagram']).map(s => (
                                    <option key={s} value={s}>{formatEnum(s)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                                {(enums.enquiry?.status || ['new', 'contacted', 'qualified', 'converted', 'dropped']).map(s => (
                                    <option key={s} value={s}>{formatEnum(s)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description / Problem</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Detailed description of the requirement..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm">
                            {isLoading ? 'Creating...' : 'Create Enquiry'}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
