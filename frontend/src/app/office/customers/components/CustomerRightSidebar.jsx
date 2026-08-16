import { UserPlus, Crown, Clock, Star, TrendingUp, ChevronRight } from 'lucide-react';
import { useGetCustomersQuery } from '@/store/api/customerApi';

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
    const { data: rawCustomers = [] } = useGetCustomersQuery();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayNewCustomers = rawCustomers
        .filter(c => new Date(c.createdAt) >= todayStart)
        .slice(0, 3)
        .map(c => ({
            name: c.name || 'Unknown',
            service: c.lastServiceCategory || 'New Customer',
            time: (() => {
                const diffMs = now - new Date(c.createdAt);
                const mins = Math.floor(diffMs / 60000);
                if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
                const hrs = Math.floor(mins / 60);
                return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
            })(),
        }));

    const followUpCustomers = rawCustomers
        .filter(c => c.nextFollowUp && new Date(c.nextFollowUp) >= todayStart)
        .slice(0, 3)
        .map(c => {
            const followUpDate = new Date(c.nextFollowUp);
            const tomorrow = new Date(todayStart);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const isToday = followUpDate < tomorrow;
            return {
                name: c.name || 'Unknown',
                task: c.followUpNote || 'Follow-up required',
                due: isToday ? 'Today' : 'Tomorrow',
            };
        });

    const topSpenders = [...rawCustomers]
        .sort((a, b) => (b.lifetimeSpend || 0) - (a.lifetimeSpend || 0))
        .slice(0, 3)
        .map(c => ({
            name: c.name || 'Unknown',
            spend: c.lifetimeSpend >= 100000
                ? `₹${(c.lifetimeSpend / 100000).toFixed(1)}L`
                : `₹${(c.lifetimeSpend || 0).toLocaleString()}`,
            bookings: c.totalBookings || 0,
        }));

    return (
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
            <WidgetCard title="Today's New Customers" icon={UserPlus} viewAllLink>
                {todayNewCustomers.length > 0 ? todayNewCustomers.map((user, i) => (
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
                )) : (
                    <p className="text-xs text-slate-400 text-center py-2">No new customers today.</p>
                )}
            </WidgetCard>

            <WidgetCard title="Customers Awaiting Follow-up" icon={Clock} viewAllLink>
                {followUpCustomers.length > 0 ? followUpCustomers.map((user, i) => (
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
                )) : (
                    <p className="text-xs text-slate-400 text-center py-2">No pending follow-ups.</p>
                )}
            </WidgetCard>

            <WidgetCard title="Top Spending Customers" icon={Crown}>
                {topSpenders.length > 0 ? topSpenders.map((user, i) => (
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
                )) : (
                    <p className="text-xs text-slate-400 text-center py-2">No spending data yet.</p>
                )}
            </WidgetCard>
        </div>
    );
}
