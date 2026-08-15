import { X, Tag, Calendar, ShieldAlert, Percent, MapPin, Users, Settings2, CheckCircle2, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CouponDrawer({ coupon, isOpen, onClose }) {
    // Live Preview State
    const [code, setCode] = useState('SAVE100');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('10');
    const [endDate, setEndDate] = useState('2024-12-31');

    useEffect(() => {
        if (coupon) {
            setCode(coupon.code || '');
            setDiscountType(coupon.type || 'percentage');
            // Mock parsing value from string for preview demo
            const val = coupon.discount ? coupon.discount.replace(/[^0-9]/g, '') : '10';
            setDiscountValue(val);
        } else {
            setCode(''); setDiscountType('percentage'); setDiscountValue('');
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

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-5xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isNew ? 'Create Coupon' : 'Edit Coupon'}
                        </h2>
                        {coupon && <p className="text-xs text-slate-500 mt-0.5">{coupon.campaign}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - 2 Columns */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-7 h-full">
                        
                        {/* Left Column: Form Fields (Scrollable independently on desktop) */}
                        <div className="lg:col-span-5 p-6 space-y-6 lg:border-r border-slate-200">
                            
                            {/* General */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Tag className="w-4 h-4" /> General Information</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Coupon Code *</label>
                                        <input 
                                            type="text" 
                                            value={code}
                                            onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                                            className="w-full text-sm font-mono tracking-wider border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white uppercase" 
                                            placeholder="e.g. SUMMER25"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Customers will enter this code at checkout.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Campaign Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={coupon?.campaign || ''}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                            placeholder="e.g. Summer Cleaning Sale"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Internal Description</label>
                                    <textarea 
                                        rows={2}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                                        placeholder="Notes for the team..."
                                    />
                                </div>
                            </div>

                            {/* Discount Configuration */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Percent className="w-4 h-4" /> Discount Value</h3>
                                
                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Discount Type</label>
                                        <select 
                                            value={discountType}
                                            onChange={e => setDiscountType(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="flat">Flat Amount (₹)</option>
                                            <option value="free_visit">Free Visiting Charge</option>
                                            <option value="free_service">Free Service</option>
                                        </select>
                                    </div>
                                    
                                    {(discountType === 'percentage' || discountType === 'flat') && (
                                        <div className="w-1/3">
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Discount Value</label>
                                            <input 
                                                type="number" 
                                                value={discountValue}
                                                onChange={e => setDiscountValue(e.target.value)}
                                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                                placeholder={discountType === 'percentage' ? "e.g. 10" : "e.g. 500"}
                                            />
                                        </div>
                                    )}

                                    {discountType === 'percentage' && (
                                        <div className="w-1/3">
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max Discount (₹)</label>
                                            <input type="number" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Leave empty for no limit" />
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Min Booking Amount (₹)</label>
                                    <input type="number" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="e.g. 1000" />
                                </div>
                            </div>

                            {/* Validity */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Validity</h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold text-slate-700">Starts</label>
                                        <input type="date" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                        <input type="time" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold text-slate-700">Ends</label>
                                        <input 
                                            type="date" 
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                        />
                                        <input type="time" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Settings2 className="w-4 h-4" /> Usage Limits</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Total Usage Limit</label>
                                        <input type="number" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Total number of times coupon can be used" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Limit Per Customer</label>
                                        <input type="number" defaultValue="1" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Restrictions & Eligibility */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Restrictions & Eligibility</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Customer Eligibility</label>
                                        <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                                            <option value="all">All Customers</option>
                                            <option value="first_time">First Time Customers Only</option>
                                            <option value="returning">Returning Customers Only</option>
                                        </select>
                                    </div>

                                    <div className="pt-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specific Services/Categories</label>
                                        <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors">
                                            + Select specific services or categories (Default: All)
                                        </button>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Specific Cities</label>
                                        <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors">
                                            + Select specific cities (Default: All)
                                        </button>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 space-y-3">
                                        <label className="relative inline-flex items-center cursor-pointer gap-3">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="text-sm text-slate-700">Cannot be combined with other coupons</span>
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer gap-3">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="text-sm text-slate-700">Exclude services that are already discounted</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pb-10"></div> {/* Spacer */}
                        </div>

                        {/* Right Column: Live Preview Sticky */}
                        <div className="lg:col-span-2 bg-slate-100 p-6 flex flex-col items-center">
                            
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
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        {isNew ? 'Create Campaign' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
