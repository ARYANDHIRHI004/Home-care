import { X, Receipt, Calculator, Tag, Percent, Calendar, FileText, Save, Clock, History } from 'lucide-react';
import { useState, useEffect } from 'react';

const mockHistory = [
    { date: 'Oct 01, 2023', base: 4000, desc: 'Festive season surge pricing', user: 'Admin' },
    { date: 'Jun 15, 2023', base: 3500, desc: 'Standard summer pricing', user: 'Admin' },
    { date: 'Jan 10, 2023', base: 3200, desc: 'Initial launch price', user: 'System' },
];

export default function PricingDrawer({ pricing, isOpen, onClose }) {
    // State for live calculator
    const [base, setBase] = useState(0);
    const [labour, setLabour] = useState(0);
    const [visit, setVisit] = useState(0);
    const [gst, setGst] = useState(18);
    const [discount, setDiscount] = useState(0);
    
    // Init state when pricing prop changes
    useEffect(() => {
        if (pricing) {
            setBase(pricing.base || 0);
            setLabour(pricing.labour || 0);
            setVisit(pricing.visit || 0);
            setGst(pricing.gst || 18);
        } else {
            setBase(0); setLabour(0); setVisit(0); setGst(18); setDiscount(0);
        }
    }, [pricing]);

    if (!isOpen) return null;

    const isNew = !pricing;
    
    // Live Calculation
    const subtotal = Number(base) + Number(labour) + Number(visit);
    const taxAmount = subtotal * (Number(gst) / 100);
    const finalPrice = subtotal + taxAmount - Number(discount);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isNew ? 'Add Pricing' : 'Edit Pricing'}
                        </h2>
                        {pricing && <p className="text-xs text-slate-500 font-mono mt-0.5">{pricing.service}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - 2 Columns */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        
                        {/* Left Column: Form Fields */}
                        <div className="lg:col-span-3 space-y-6">
                            
                            {/* Core Pricing */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Tag className="w-4 h-4" /> Core Pricing</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Base Price (₹)</label>
                                        <input 
                                            type="number" 
                                            value={base}
                                            onChange={e => setBase(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Labour Charge (₹)</label>
                                        <input 
                                            type="number" 
                                            value={labour}
                                            onChange={e => setLabour(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Visiting Charge (₹)</label>
                                        <input 
                                            type="number" 
                                            value={visit}
                                            onChange={e => setVisit(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Material Charge (Fixed ₹)</label>
                                        <input 
                                            type="number" 
                                            defaultValue={0}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tax & Discount */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Percent className="w-4 h-4" /> Tax & Discount</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">GST (%)</label>
                                        <select 
                                            value={gst}
                                            onChange={e => setGst(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                        >
                                            <option value="0">0% (Exempt)</option>
                                            <option value="5">5%</option>
                                            <option value="12">12%</option>
                                            <option value="18">18%</option>
                                            <option value="28">28%</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max Default Discount (₹)</label>
                                        <input 
                                            type="number" 
                                            value={discount}
                                            onChange={e => setDiscount(e.target.value)}
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Surcharges */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Surcharges</h3>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Weekend (₹)</label>
                                        <input type="number" defaultValue={pricing?.weekend || 0} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Emergency (₹)</label>
                                        <input type="number" defaultValue={pricing?.emergency || 0} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Night (₹)</label>
                                        <input type="number" defaultValue={0} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Validity */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Validity & Notes</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Effective Date</label>
                                        <input type="date" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date (Optional)</label>
                                        <input type="date" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Version Notes</label>
                                    <textarea rows={2} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" placeholder="Reason for pricing update..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Calculator & History */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Live Calculator (Receipt Style) */}
                            <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden  top-0 border border-slate-800">
                                <div className="bg-slate-800 px-5 py-4 flex items-center gap-2 border-b border-slate-700">
                                    <Calculator className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-sm font-bold text-white tracking-wide uppercase">Live Calculator</h3>
                                </div>
                                
                                <div className="p-5 font-mono text-sm space-y-3">
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Base Price</span>
                                        <span>₹{Number(base).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Labour Charge</span>
                                        <span>+ ₹{Number(labour).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Visiting Charge</span>
                                        <span>+ ₹{Number(visit).toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="border-t border-slate-700 border-dashed my-3"></div>
                                    
                                    <div className="flex justify-between items-center font-medium text-slate-200">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span>GST ({gst}%)</span>
                                        <span>+ ₹{taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-emerald-400">
                                        <span>Discount</span>
                                        <span>- ₹{Number(discount).toFixed(2)}</span>
                                    </div>

                                    <div className="border-t-2 border-slate-700 mt-4 pt-4 flex justify-between items-center text-lg font-bold text-white">
                                        <span>Final Price</span>
                                        <span className="bg-blue-600 px-3 py-1 rounded-lg">₹{finalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-900/30 px-5 py-3 text-[10px] text-blue-300/80 text-center uppercase tracking-widest font-semibold">
                                    Estimated Calculation
                                </div>
                            </div>

                            {/* Price History */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-1.5"><History className="w-4 h-4" /> Price History</h3>
                                
                                <div className="relative pl-1">
                                    {mockHistory.map((h, i) => (
                                        <div key={i} className="flex gap-4 pb-5 last:pb-0 relative">
                                            {i < mockHistory.length - 1 && (
                                                <div className="absolute left-[3px] top-4 bottom-0 w-0.5 bg-slate-100"></div>
                                            )}
                                            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 z-10 bg-slate-200 ring-4 ring-white"></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">₹{h.base} Base Price</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{h.date} • by {h.user}</p>
                                                <p className="text-[10px] text-slate-400 italic mt-1">{h.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                        <Save className="w-4 h-4" /> Save Pricing
                    </button>
                </div>
            </div>
        </div>
    );
}
