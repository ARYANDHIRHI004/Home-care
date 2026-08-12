import { UserPlus, Crown, Clock, Star, TrendingUp, ChevronRight } from 'lucide-react';

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

export default function CustomerRightSidebar() {
    return (
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
            <WidgetCard title="Today's New Customers" icon={UserPlus} viewAllLink>
                {[
                    { name: 'Kiran Reddy', time: '10 mins ago', service: 'Plumbing' },
                    { name: 'Suresh Menon', time: '1 hour ago', service: 'Deep Cleaning' },
                    { name: 'Anita Desai', time: '3 hours ago', service: 'AC Repair' },
                ].map((user, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.service}</p>
                        </div>
                        <div className="text-xs text-slate-400">{user.time}</div>
                    </div>
                ))}
            </WidgetCard>

            <WidgetCard title="Customers Awaiting Follow-up" icon={Clock} viewAllLink>
                {[
                    { name: 'Rahul Sharma', task: 'Send estimate', due: 'Today' },
                    { name: 'Priya Patel', task: 'Post-service call', due: 'Tomorrow' },
                ].map((user, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                        <div className="mt-0.5">
                            <div className={`w-2 h-2 rounded-full ${user.due === 'Today' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.task}</p>
                        </div>
                        <div className="text-xs font-medium text-slate-500">{user.due}</div>
                    </div>
                ))}
            </WidgetCard>

            <WidgetCard title="Top Spending Customers" icon={Crown}>
                {[
                    { name: 'Neha Kapoor', spend: '₹1.2L', bookings: 24 },
                    { name: 'Rajesh Khanna', spend: '₹95K', bookings: 18 },
                    { name: 'Sneha Gupta', spend: '₹82K', bookings: 15 },
                ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-xs font-bold border border-amber-100">
                                #{i + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.bookings} bookings</p>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                            {user.spend}
                        </div>
                    </div>
                ))}
            </WidgetCard>
        </div>
    );
}
