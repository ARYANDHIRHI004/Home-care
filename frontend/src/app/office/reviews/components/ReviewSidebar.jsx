import { AlertTriangle, UserCheck, TrendingDown, PieChart, BarChart3, ChevronRight } from 'lucide-react';

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
    return (
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
            
            {/* Negative Review Alerts */}
            <WidgetCard title="Immediate Follow-up Required" icon={AlertTriangle} alert>
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-slate-900">AC Repair & Service</span>
                        <span className="text-xs font-medium bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded">2 Stars</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">"The technician came and fixed the AC, but it started leaking water the very next day..."</p>
                    <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center">
                        Assign Manager <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                </div>
            </WidgetCard>

            {/* Analytics - Rating Distribution (Mock CSS Pie) */}
            <WidgetCard title="Rating Distribution" icon={PieChart}>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full border-[12px] border-slate-100 relative">
                        {/* CSS Hack for mock pie chart slices */}
                        <div className="absolute inset-[-12px] rounded-full border-[12px] border-emerald-400" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }}></div>
                        <div className="absolute inset-[-12px] rounded-full border-[12px] border-amber-400" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%)' }}></div>
                        <div className="absolute inset-[-12px] rounded-full border-[12px] border-rose-400" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)' }}></div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> 5 Stars</div>
                            <span className="font-semibold text-slate-700">76%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 3-4 Stars</div>
                            <span className="font-semibold text-slate-700">18%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"></div> 1-2 Stars</div>
                            <span className="font-semibold text-slate-700">6%</span>
                        </div>
                    </div>
                </div>
            </WidgetCard>

            {/* Partner Performance */}
            <WidgetCard title="Top Rated Partners" icon={UserCheck}>
                {[
                    { name: 'Ramesh K.', rating: '4.9', reviews: 142 },
                    { name: 'Sita Verma', rating: '4.8', reviews: 98 },
                ].map((partner, i) => (
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
                ))}
            </WidgetCard>

            <WidgetCard title="Needs Improvement" icon={TrendingDown}>
                {[
                    { name: 'Amit Kumar', rating: '3.2', reviews: 45 },
                ].map((partner, i) => (
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
                ))}
            </WidgetCard>

        </div>
    );
}
