import { X, Tag, Calendar, Percent, Settings2, CheckCircle2, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCreateCouponMutation, useUpdateCouponMutation } from '@/store/api/couponApi';
import { useGetEnumsQuery } from '@/store/api/configApi';

const formatEnum = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function CouponDrawer({ coupon, isOpen, onClose }) {
    // Live Preview State
    const [code, setCode] = useState('SAVE100');
    const [campaign, setCampaign] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('10');
    const [services, setServices] = useState('All Services');
    const [usageLimit, setUsageLimit] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('2024-12-31');
    const [createCoupon] = useCreateCouponMutation();
    const [updateCoupon] = useUpdateCouponMutation();
    const { data: enums = {} } = useGetEnumsQuery();

    useEffect(() => {
        if (coupon) {
            const raw = coupon._raw || {};
            setCode(coupon.code || '');
            setCampaign(coupon.campaign || '');
            setDiscountType(coupon.type || 'percentage');
            setDiscountValue(String(raw.discountValue ?? ''));
            setServices(raw.services || 'All Services');
            setUsageLimit(raw.usageLimit != null ? String(raw.usageLimit) : '');
            setStartDate(raw.startsAt ? new Date(raw.startsAt).toISOString().slice(0, 10) : '');
            setEndDate(raw.expiresAt ? new Date(raw.expiresAt).toISOString().slice(0, 10) : '');
        } else {
            setCode(''); setCampaign(''); setDiscountType('percentage'); setDiscountValue('');
            setServices('All Services'); setUsageLimit(''); setStartDate(''); setEndDate('');
        }
    }, [coupon]);

    if (!isOpen) return null;

    const isNew = !coupon;

    const getPreviewDiscount = () => {
        if (!discountValue) return '0 OFF';
        if (discountType === 'percentage') return `${discountValue}% OFF`;
        if (discountType === 'flat') return `₹${discountValue} OFF`;
        if (discountType === 'free_visit') return 'FREE VISIT';
        return 'SPECIAL OFFER';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No Expiry';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleSave = async () => {
        const payload = {
            code,
            campaign,
            type: discountType,
            discountValue: Number(discountValue) || 0,
            services: services || 'All Services',
            usageLimit: usageLimit ? Number(usageLimit) : null,
            startsAt: startDate || null,
            expiresAt: endDate || null,
        };
        try {
            if (isNew) {
                await createCoupon(payload).unwrap();
            } else {
                await updateCoupon({ id: coupon.id || coupon._id, ...payload }).unwrap();
            }
            onClose();
        } catch (err) {
            console.error('Failed to save coupon', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-5xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {isNew ? 'Create Coupon' : 'Edit Coupon'}
                        </h2>
                        {coupon && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{coupon.campaign}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - 2 Columns */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="grid grid-cols-1 lg:grid-cols-7 h-full">

                        {/* Left Column: Form Fields (Scrollable independently on desktop) */}
                        <div className="lg:col-span-5 p-6 space-y-6 lg:border-r border-slate-200 dark:border-slate-800">

                            {/* General */}
                            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5"><Tag className="w-4 h-4" /> General Information</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Coupon Code *</label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                                            className="w-full text-sm font-mono tracking-wider border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 uppercase"
                                            placeholder="e.g. SUMMER25"
                                        />
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Customers will enter this code at checkout.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Campaign Name</label>
                                        <input
                                            type="text"
                                            value={campaign}
                                            onChange={e => setCampaign(e.target.value)}
                                            className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                            placeholder="e.g. Summer Cleaning Sale"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discount Configuration */}
                            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5"><Percent className="w-4 h-4" /> Discount Value</h3>

                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Discount Type</label>
                                        <select
                                            value={discountType}
                                            onChange={e => setDiscountType(e.target.value)}
                                            className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 cursor-pointer"
                                        >
                                            {(enums.coupon?.type || ['percentage', 'flat', 'free_visit']).map(t => (
                                                <option key={t} value={t}>{formatEnum(t)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {(discountType === 'percentage' || discountType === 'flat') && (
                                        <div className="w-1/3">
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Discount Value</label>
                                            <input
                                                type="number"
                                                value={discountValue}
                                                onChange={e => setDiscountValue(e.target.value)}
                                                className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                                placeholder={discountType === 'percentage' ? "e.g. 10" : "e.g. 500"}
                                            />
                                        </div>
                                    )}

                                </div>
                                <div className="w-2/3">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Applicable Services</label>
                                    <input
                                        type="text"
                                        value={services}
                                        onChange={e => setServices(e.target.value)}
                                        className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                        placeholder="e.g. All Services, Deep Cleaning"
                                    />
                                </div>
                            </div>

                            {/* Validity */}
                            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Validity</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Starts</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Ends</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5"><Settings2 className="w-4 h-4" /> Usage Limits</h3>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Total Usage Limit</label>
                                    <input
                                        type="number"
                                        value={usageLimit}
                                        onChange={e => setUsageLimit(e.target.value)}
                                        className="w-full text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                        placeholder="Leave empty for unlimited"
                                    />
                                </div>
                            </div>

                            <div className="pb-10"></div> {/* Spacer */}
                        </div>

                        {/* Right Column: Live Preview Sticky — the card inside is a literal
                            rendering of what the CUSTOMER sees, so it's deliberately
                            light-only (like a print preview), but the panel chrome around
                            it is still admin UI and follows the theme. */}
                        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800 p-6 flex flex-col items-center">
                            
                            <div className="sticky top-6 w-full space-y-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Live Preview</h3>
                                
                                {/* Customer Facing Coupon Card Preview */}
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden transform transition-all hover:scale-[1.02]">
                                    
                                    {/* Top Half: Blue Ticket */}
                                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 relative">
                                        {/* Scalloped edges effect */}
                                        <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1">
                                            {[...Array(15)].map((_, i) => (
                                                <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/30">
                                                Promotion
                                            </div>
                                            <Ticket className="w-6 h-6 text-white/50" />
                                        </div>
                                        
                                        <div className="text-center relative z-10">
                                            <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                                                {getPreviewDiscount()}
                                            </h2>
                                            <p className="text-blue-100 text-sm mt-1 font-medium">On your next booking</p>
                                        </div>
                                    </div>

                                    {/* Bottom Half: Details */}
                                    <div className="bg-white p-6 pt-8 relative">
                                        {/* Dashed line separating top/bottom visually */}
                                        <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-slate-200"></div>
                                        
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Use Code</div>
                                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Valid Until</div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold px-3 py-1.5 rounded-lg text-lg tracking-widest shadow-inner">
                                                {code || 'CODE'}
                                            </div>
                                            <div className="text-slate-800 font-bold text-sm">
                                                {formatDate(endDate)}
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <p className="text-[10px] text-slate-400">T&C Apply. Valid for selected services.</p>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-xs text-slate-400 text-center px-4 leading-relaxed">
                                    This is how customers will see this coupon on the booking page and in marketing emails.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        {isNew ? 'Create Campaign' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
