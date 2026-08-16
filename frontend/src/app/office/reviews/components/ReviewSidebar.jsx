import { AlertTriangle, UserCheck, TrendingDown, PieChart, BarChart3, ChevronRight } from 'lucide-react';
import { useGetFeedbackQuery } from '@/store/api/feedbackApi';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
const WidgetCard = ({ title, icon: Icon, children, alert }) => (
    <div className={`bg-white rounded-xl border ${alert ? 'border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-200 shadow-sm'} p-4 mb-4`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold flex items-center gap-2 text-sm ${alert ? 'text-rose-700' : 'text-slate-900'}`}>
                <Icon className={`w-4 h-4 ${alert ? 'text-rose-500' : 'text-slate-500'}`} />
                {title}
            </h3>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

export default function ReviewSidebar() {
    const { data: rawFeedback = [] } = useGetFeedbackQuery();
    const { data: partners = [] } = useGetPartnersQuery();

    const badReviews = rawFeedback.filter(f => f.rating <= 2);
    const topBadReview = badReviews.length > 0 ? badReviews[0] : null;

    let fiveStar = 0, midStar = 0, lowStar = 0;
    const total = rawFeedback.length;
    rawFeedback.forEach(f => {
        if (f.rating === 5) fiveStar++;
        else if (f.rating >= 3) midStar++;
        else lowStar++;
    });

    const fivePct = total ? Math.round((fiveStar/total)*100) : 0;
    const midPct = total ? Math.round((midStar/total)*100) : 0;
    const lowPct = total ? Math.round((lowStar/total)*100) : 0;

    // Calculate Partner Ratings
    const partnerStats = {};
    rawFeedback.forEach(f => {
        const pId = f.workOrderId?.assignedPartnerId?._id || f.workOrderId?.assignedPartnerId;
        if (pId) {
            if (!partnerStats[pId]) partnerStats[pId] = { count: 0, total: 0 };
            partnerStats[pId].count += 1;
            partnerStats[pId].total += f.rating;
        }
    });

    const partnerRatings = Object.keys(partnerStats).map(id => {
        const p = partners.find(part => part._id === id);
        return {
            name: p ? p.name : 'Unknown Partner',
            rating: (partnerStats[id].total / partnerStats[id].count).toFixed(1),
            reviews: partnerStats[id].count
        };
    }).sort((a,b) => b.reviews - a.reviews);

    const topPartners = partnerRatings.filter(p => Number(p.rating) >= 4.0).slice(0, 3);
    const lowPartners = partnerRatings.filter(p => Number(p.rating) < 4.0).slice(0, 3);

    return (
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
            
            {/* Negative Review Alerts */}
            {topBadReview && (
                <WidgetCard title="Immediate Follow-up Required" icon={AlertTriangle} alert>
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-slate-900 line-clamp-1">{topBadReview.workOrderId?.serviceCategory || 'Service Issue'}</span>
                            <span className="text-xs font-medium bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded flex-shrink-0">{topBadReview.rating} Stars</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">"{topBadReview.comments}"</p>
                        <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center">
                            Assign Manager <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                    </div>
                </WidgetCard>
            )}

            {/* Analytics - Rating Distribution (Mock CSS Pie) */}
            <WidgetCard title="Rating Distribution" icon={PieChart}>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full border-[12px] border-slate-100 relative">
                        {/* CSS Hack for mock pie chart slices based on real percentages */}
                        {fivePct > 0 && <div className="absolute inset-[-12px] rounded-full border-[12px] border-emerald-400" style={{ clipPath: `polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 ${100 - fivePct}%)` }}></div>}
                        {midPct > 0 && <div className="absolute inset-[-12px] rounded-full border-[12px] border-amber-400" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%)' }}></div>}
                        {lowPct > 0 && <div className="absolute inset-[-12px] rounded-full border-[12px] border-rose-400" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)' }}></div>}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> 5 Stars</div>
                            <span className="font-semibold text-slate-700">{fivePct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 3-4 Stars</div>
                            <span className="font-semibold text-slate-700">{midPct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"></div> 1-2 Stars</div>
                            <span className="font-semibold text-slate-700">{lowPct}%</span>
                        </div>
                    </div>
                </div>
            </WidgetCard>

            {/* Partner Performance */}
            <WidgetCard title="Top Rated Partners" icon={UserCheck}>
                {topPartners.length > 0 ? topPartners.map((partner, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                {partner.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{partner.name}</p>
                                <p className="text-xs text-slate-500">{partner.reviews} reviews</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 text-sm font-bold">
                            ★ {partner.rating}
                        </div>
                    </div>
                )) : <div className="text-xs text-slate-500">No partner reviews yet.</div>}
            </WidgetCard>

            <WidgetCard title="Needs Improvement" icon={TrendingDown}>
                {lowPartners.length > 0 ? lowPartners.map((partner, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-xs">
                                {partner.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{partner.name}</p>
                                <p className="text-xs text-slate-500">{partner.reviews} reviews</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded text-rose-700 text-sm font-bold">
                            ★ {partner.rating}
                        </div>
                    </div>
                )) : <div className="text-xs text-slate-500">No poorly rated partners.</div>}
            </WidgetCard>

        </div>
    );
}
