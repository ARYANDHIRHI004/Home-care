import { Star, ShieldAlert, Clock, UserCheck } from 'lucide-react';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import { useGetFeedbackQuery } from '@/store/api/feedbackApi';

export default function PartnerSidebar() {
    const { data: partners = [] } = useGetPartnersQuery();
    const { data: feedbackList = [] } = useGetFeedbackQuery();

    // Partners pending verification
    const pendingVerification = partners.filter(p => p.verificationStatus === 'pending').slice(0, 1);

    // Top performers: compute avg rating per partner from feedback
    const partnerFeedbackMap = {};
    feedbackList.forEach(f => {
        const pId = f.workOrderId?.assignedPartnerId?._id || f.workOrderId?.assignedPartnerId;
        if (pId) {
            if (!partnerFeedbackMap[pId]) partnerFeedbackMap[pId] = { total: 0, count: 0, jobs: 0 };
            partnerFeedbackMap[pId].total += f.rating;
            partnerFeedbackMap[pId].count += 1;
        }
    });

    const topPerformers = partners
        .map(p => {
            const fb = partnerFeedbackMap[p._id];
            return {
                name: p.name,
                jobs: (p.jobHistory || []).length || 0,
                rating: fb ? (fb.total / fb.count).toFixed(1) : null,
            };
        })
        .filter(p => p.rating !== null)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 2);

    // Recently joined (sorted by createdAt desc)
    const recentPartners = [...partners]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(p => {
            const diffMs = Date.now() - new Date(p.createdAt).getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            return {
                name: p.name,
                date: diffDays === 0 ? 'Today' : diffDays === 1 ? '1 day ago' : `${diffDays} days ago`,
            };
        });

    const availableNow = partners.filter(p => p.active !== false && !p.isBusy).length;

    return (
        <div className="w-80 bg-slate-50 border-l border-slate-200 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto hidden xl:block">
            <div className="p-6 space-y-8">
                
                {/* Verification Pending */}
                {pendingVerification.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-500" /> Action Required
                        </h3>
                        {pendingVerification.map((p, i) => (
                            <div key={i} className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 hover:border-amber-300 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Pending Verification</p>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1"></span>
                                </div>
                                <button className="w-full mt-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors">Review Docs</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Top Performers */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-emerald-500" /> Top Performers
                    </h3>
                    <div className="space-y-3">
                        {topPerformers.length > 0 ? topPerformers.map((p, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{p.jobs} Jobs Completed</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-500" /> {p.rating}</div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-400 text-center py-2">No rating data yet.</p>
                        )}
                    </div>
                </div>

                {/* Recently Joined */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" /> Recently Joined
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {recentPartners.length > 0 ? recentPartners.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
                                <h4 className="text-sm font-medium text-slate-700">{p.name}</h4>
                                <p className="text-[10px] text-slate-400">{p.date}</p>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-400 text-center py-4">No recent partners.</p>
                        )}
                    </div>
                </div>
                
                {/* Available Now */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-16 bg-blue-500/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <UserCheck className="w-6 h-6 text-emerald-400 mb-3" />
                        <h4 className="text-2xl font-bold tracking-tight">{availableNow}</h4>
                        <p className="text-xs text-slate-300 mt-1 font-medium">Partners currently available for instant dispatch.</p>
                        <button className="mt-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors w-full border border-white/10">View Map</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
