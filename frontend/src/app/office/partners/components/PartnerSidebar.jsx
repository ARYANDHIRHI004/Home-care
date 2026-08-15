import { Star, ShieldAlert, Clock, UserCheck } from 'lucide-react';

export default function PartnerSidebar() {
    return (
        <div className="w-80 bg-slate-50 border-l border-slate-200 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto hidden xl:block">
            <div className="p-6 space-y-8">
                
                {/* Verification Pending */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-500" /> Action Required
                    </h3>
                    <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 hover:border-amber-300 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Amit Sharma</h4>
                                <p className="text-xs text-slate-500 mt-1">Pending Police Verification</p>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1"></span>
                        </div>
                        <button className="w-full mt-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors">Review Docs</button>
                    </div>
                </div>

                {/* Top Performers */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-emerald-500" /> Top Performers (This Week)
                    </h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Rajesh Kumar', jobs: 24, rating: 4.9 },
                            { name: 'Priya Patel', jobs: 18, rating: 4.8 },
                        ].map((p, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{p.jobs} Jobs Completed</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-500" /> {p.rating}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recently Joined */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" /> Recently Joined
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {[
                            { name: 'Vikram Das', date: '2 days ago' },
                            { name: 'Suresh Singh', date: '5 days ago' },
                        ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
                                <h4 className="text-sm font-medium text-slate-700">{p.name}</h4>
                                <p className="text-[10px] text-slate-400">{p.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Available Now */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-16 bg-blue-500/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <UserCheck className="w-6 h-6 text-emerald-400 mb-3" />
                        <h4 className="text-2xl font-bold tracking-tight">64</h4>
                        <p className="text-xs text-slate-300 mt-1 font-medium">Partners currently available for instant dispatch in your city.</p>
                        <button className="mt-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors w-full border border-white/10">View Map</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
