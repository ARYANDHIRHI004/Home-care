import { X, TrendingUp, IndianRupee, Users, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

export default function CouponAnalyticsSidebar({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[400px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Campaign Analytics</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Last 30 Days Performance</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                
                {/* Revenue Impact */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Revenue Impact</h3>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><IndianRupee className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Revenue Generated</p>
                                    <p className="text-lg font-bold text-slate-900">₹8.4L</p>
                                </div>
                            </div>
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
                            </span>
                        </div>

                        <div className="h-px bg-slate-100 w-full"></div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Total Discount Given</p>
                                    <p className="text-lg font-bold text-slate-900">₹1.2L</p>
                                </div>
                            </div>
                            <span className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5%
                            </span>
                        </div>

                    </div>
                </div>

                {/* Conversion Stats */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Conversion</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <Users className="w-4 h-4 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium mb-1">New Customers</p>
                            <p className="text-lg font-bold text-slate-900">452</p>
                            <p className="text-[10px] text-emerald-600 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 8% up</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <Tag className="w-4 h-4 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium mb-1">Redemption Rate</p>
                            <p className="text-lg font-bold text-slate-900">24.5%</p>
                            <p className="text-[10px] text-rose-600 mt-1 flex items-center"><ArrowDownRight className="w-3 h-3" /> 2% down</p>
                        </div>
                    </div>
                </div>

                {/* Top Coupons */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Performing Codes</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {[
                            { code: 'DIWALI20', uses: 450, rev: '₹2.1L' },
                            { code: 'WINTERCLEAN', uses: 280, rev: '₹1.4L' },
                            { code: 'FIRST500', uses: 120, rev: '₹80K' },
                            { code: 'WEEKEND10', uses: 85, rev: '₹45K' },
                        ].map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                <div>
                                    <p className="text-sm font-bold font-mono text-slate-800">{c.code}</p>
                                    <p className="text-xs text-slate-500">{c.uses} redemptions</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">{c.rev}</p>
                                    <p className="text-[10px] text-emerald-600">Revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200">
                        View Full Report
                    </button>
                </div>

            </div>
        </div>
    );
}
