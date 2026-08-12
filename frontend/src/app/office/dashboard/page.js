import PageHeader from '@/components/office/PageHeader';
import { 
    Plus, 
    Download, 
    RefreshCw, 
    Inbox, 
    CalendarCheck, 
    Wrench, 
    IndianRupee, 
    Ticket, 
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    UserPlus,
    FileText,
    FileDigit,
    UserCheck,
    Clock,
    CheckCircle2,
    Database
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {trendValue}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
    </div>
);

const QuickAction = ({ title, icon: Icon, onClick }) => (
    <button className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all group">
        <div className="w-10 h-10 mb-3 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
            <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
        </div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">{title}</span>
    </button>
);

export default function OfficeDashboard() {
    return (
        <div className="pb-10">
            <PageHeader 
                breadcrumbs={[{ label: 'HomeCare', href: '#' }, { label: 'Dashboard' }]}
                title="Good Morning, Admin 👋"
                description="Here's what's happening with your operations today."
                actions={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            New Booking
                        </button>
                    </>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-6 mb-8">
                <StatCard title="Total Enquiries" value="1,284" icon={Database} subtitle="Till now" />
                <StatCard title="Today's Enquiries" value="42" icon={Inbox} trend="up" trendValue="12%" subtitle="vs last week" />
                <StatCard title="Today's Bookings" value="18" icon={CalendarCheck} trend="up" trendValue="5%" subtitle="vs last week" />
                <StatCard title="Active Jobs" value="24" icon={Wrench} />
                <StatCard title="Pending Payments" value="₹12,450" icon={CreditCard} trend="down" trendValue="2%" subtitle="vs yesterday" />
                <StatCard title="Revenue (Today)" value="₹45,200" icon={IndianRupee} trend="up" trendValue="8%" subtitle="vs yesterday" />
                <StatCard title="Pending Tickets" value="5" icon={Ticket} />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <QuickAction title="Create Booking" icon={CalendarCheck} />
                    <QuickAction title="Create Estimate" icon={FileText} />
                    <QuickAction title="Create Invoice" icon={FileDigit} />
                    <QuickAction title="Add Customer" icon={UserPlus} />
                    <QuickAction title="Assign Partner" icon={UserCheck} />
                </div>
            </div>

            {/* Main Grid for Tables and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Live Job Status - takes 2 columns on lg */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Live Job Status</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View all</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-sm font-medium text-slate-500">
                                    <th className="pb-3 pr-4">Job ID</th>
                                    <th className="pb-3 pr-4">Service</th>
                                    <th className="pb-3 pr-4">Customer</th>
                                    <th className="pb-3 pr-4">Partner</th>
                                    <th className="pb-3 pr-4">Time</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 pr-4 font-medium text-slate-900">#JB-202{item}</td>
                                        <td className="py-3 pr-4 text-slate-600">AC Deep Cleaning</td>
                                        <td className="py-3 pr-4 text-slate-600">Rahul Sharma</td>
                                        <td className="py-3 pr-4 text-slate-600">Amit Kumar</td>
                                        <td className="py-3 pr-4 text-slate-500">10:00 AM</td>
                                        <td className="py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                <Clock className="w-3.5 h-3.5" /> In Progress
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: '09:00 AM', title: 'Partner Onboarding', type: 'Meeting' },
                            { time: '11:30 AM', title: 'Review AC Complaints', type: 'Task' },
                            { time: '02:00 PM', title: 'Vendor Call - LG Parts', type: 'Call' },
                            { time: '04:00 PM', title: 'Weekly Ops Sync', type: 'Meeting' },
                        ].map((event, idx) => (
                            <div key={idx} className="flex gap-4 items-start relative pl-4 border-l-2 border-slate-100">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                <div className="min-w-[65px] text-xs font-medium text-slate-500 mt-0.5">{event.time}</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{event.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activities</h3>
                    <div className="space-y-5">
                        {[
                            { user: 'Sarah J.', action: 'assigned booking', target: '#JB-2021 to Amit K.', time: '10 mins ago', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { user: 'System', action: 'generated invoice', target: '#INV-0892', time: '25 mins ago', icon: FileDigit, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { user: 'Customer', action: 'raised ticket', target: '#TCK-011', time: '1 hour ago', icon: Ticket, color: 'text-rose-600', bg: 'bg-rose-50' },
                            { user: 'Admin', action: 'updated pricing for', target: 'AC Services', time: '2 hours ago', icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((activity, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bg} ${activity.color}`}>
                                    <activity.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-900">
                                        <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partner Status */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100/50 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Partner Status Overview</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">Manage</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-medium text-slate-700">Online & Active</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">145</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <span className="text-sm font-medium text-slate-700">On Job (Busy)</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">42</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <span className="text-sm font-medium text-slate-700">Offline</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">38</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-semibold text-slate-900 mb-4">Top Performers (This Week)</h4>
                        <div className="flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-1 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto mb-2 flex items-center justify-center text-lg">👨🏽‍🔧</div>
                                    <p className="text-xs font-semibold text-slate-900">Partner {i}</p>
                                    <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-[10px] font-medium text-slate-600">4.9</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Ensure Star is imported at the top
import { Star } from 'lucide-react';
