import { CalendarDays, AlertTriangle, Users, TrendingUp, ChevronRight } from 'lucide-react';

const WidgetCard = ({ title, icon: Icon, children, viewAllLink }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4 text-slate-500" />
                {title}
            </h3>
            {viewAllLink && (
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    View all <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
            )}
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

export default function WorkOrderSidebar() {
    return (
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
            
            {/* Today's Schedule Timeline */}
            <WidgetCard title="Today's Timeline" icon={CalendarDays} viewAllLink>
                <div className="relative pl-3 border-l border-slate-200 ml-2 space-y-4">
                    <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                        <p className="text-xs font-semibold text-slate-900">09:00 AM</p>
                        <p className="text-xs text-slate-600 mt-0.5">Plumbing (Sneha Gupta)</p>
                        <p className="text-[10px] text-slate-400">Completed</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <p className="text-xs font-semibold text-slate-900">10:00 AM</p>
                        <p className="text-xs text-slate-600 mt-0.5">Deep Cleaning (Priya Patel)</p>
                        <p className="text-[10px] text-blue-600 font-medium">In Progress</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-white animate-pulse"></div>
                        <p className="text-xs font-semibold text-slate-900">01:00 PM</p>
                        <p className="text-xs text-slate-600 mt-0.5">Pest Control (Kavya Nair)</p>
                        <p className="text-[10px] text-amber-600 font-medium">On The Way</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                        <p className="text-xs font-semibold text-slate-900">02:00 PM</p>
                        <p className="text-xs text-slate-600 mt-0.5">AC Repair (Rahul Sharma)</p>
                        <p className="text-[10px] text-rose-600 font-medium">Unassigned</p>
                    </div>
                </div>
            </WidgetCard>

            {/* Delayed / Attention Needed */}
            <WidgetCard title="Attention Needed" icon={AlertTriangle}>
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-rose-800 mb-1">WO-10582 is delayed</p>
                    <p className="text-[10px] text-rose-600">Partner is 45 mins late to destination. Customer waiting.</p>
                    <button className="mt-2 text-[10px] font-bold text-rose-700 hover:text-rose-800 uppercase tracking-wide">Call Partner &rarr;</button>
                </div>
            </WidgetCard>

            {/* Partner Availability */}
            <WidgetCard title="Partner Availability" icon={Users} viewAllLink>
                <div className="space-y-3">
                    {['Cleaning', 'Plumbing', 'Electrical'].map((type, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">{type}</span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-4 bg-emerald-400 rounded-sm"></span>
                                <span className="w-1.5 h-4 bg-emerald-400 rounded-sm"></span>
                                <span className="w-1.5 h-4 bg-emerald-400 rounded-sm"></span>
                                <span className="w-1.5 h-4 bg-slate-100 rounded-sm"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </WidgetCard>

            {/* Quick Analytics */}
            <WidgetCard title="Revenue Today" icon={TrendingUp}>
                <div className="text-3xl font-bold text-slate-900 mb-1">₹14,500</div>
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +₹2,400 vs yesterday
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-500">Collected: <strong className="text-slate-800">₹8,500</strong></span>
                    <span className="text-slate-500">Pending: <strong className="text-rose-600">₹6,000</strong></span>
                </div>
            </WidgetCard>
        </div>
    );
}
