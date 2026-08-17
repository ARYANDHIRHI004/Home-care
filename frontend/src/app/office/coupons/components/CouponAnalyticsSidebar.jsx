import { X, Users, Tag, TrendingUp } from 'lucide-react';
import { useGetCouponsQuery } from '@/store/api/couponApi';

export default function CouponAnalyticsSidebar({ isOpen, onClose }) {
    const { data: coupons = [] } = useGetCouponsQuery(undefined, { skip: !isOpen });

    if (!isOpen) return null;

    // Redemption analytics can only be built from Coupon.usageCount — there's
    // no field anywhere (Payment/Invoice/Booking) linking a coupon to the
    // revenue it generated, so revenue-impact numbers can't be computed
    // honestly. Showing what the data actually supports instead of a fake ₹ figure.
    const totalUsage = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);
    const activeCount = coupons.filter(c => c.status === 'active').length;
    const topCoupons = [...coupons]
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 5);

    return (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[400px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Coupon Usage</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Across all campaigns</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">

                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <Users className="w-4 h-4 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium mb-1">Active Coupons</p>
                            <p className="text-lg font-bold text-slate-900">{activeCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <TrendingUp className="w-4 h-4 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium mb-1">Total Redemptions</p>
                            <p className="text-lg font-bold text-slate-900">{totalUsage}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Used Codes</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {topCoupons.length === 0 && (
                            <p className="p-4 text-xs text-slate-400">No coupons yet.</p>
                        )}
                        {topCoupons.map((c) => (
                            <div key={c._id} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                <div>
                                    <p className="text-sm font-bold font-mono text-slate-800">{c.code}</p>
                                    <p className="text-xs text-slate-500">{c.campaign}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">{c.usageCount || 0}</p>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><Tag className="w-3 h-3" /> redemptions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
