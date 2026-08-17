'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Inbox,
    CalendarCheck,
    FileText,
    Wrench,
    Users,
    Star,
    MessageSquareWarning,
    Ticket,
    Layers,
    Tag,
    Briefcase,
    Percent,
    UserCheck,
    ClipboardList,
    Clock,
    Activity,
    Shield,
    History,
    CreditCard,
    FileDigit,
    Undo2,
    Receipt,
    Megaphone,
    Bell,
    Mail,
    MessageCircle,
    BarChart3,
    PieChart,
    TrendingUp,
    Settings,
    Key,
    Blocks,
    HelpCircle,
    BookOpen,
    LogOut
} from 'lucide-react';

const navGroups = [
    {
        title: 'Dashboard',
        items: [
            { name: 'Dashboard', href: '/office/dashboard', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Operations',
        items: [
            { name: 'Enquiries', href: '/office/enquiries', icon: Inbox },
            { name: 'Bookings', href: '/office/bookings', icon: CalendarCheck },
            { name: 'Estimates', href: '/office/estimates', icon: FileText },
            { name: 'Work Orders', href: '/office/work-orders', icon: Wrench },
        ]
    },
    {
        title: 'Service Management',
        items: [
            { name: 'Categories', href: '/office/categories', icon: Layers },
            { name: 'Services', href: '/office/services-list', icon: Briefcase },
            { name: 'Pricing', href: '/office/pricing', icon: Tag },
            { name: 'Coupons', href: '/office/coupons', icon: Percent   },
        ]
    },
    // {
    //     title: 'Team',
    //     items: [
    //         { name: 'Office Employees', href: '/office/employees', icon: Users },
    //         { name: 'Roles & Permissions', href: '/office/roles', icon: Users },
    //     ]
    // },
    {
        title: 'Customers',
        items: [
            { name: 'Customers', href: '/office/customers', icon: Users },
            { name: 'Customer Reviews', href: '/office/reviews', icon: Star },
            { name: 'Complaints', href: '/office/complaints', icon: MessageSquareWarning },
            // { name: 'Tickets', href: '/office/tickets', icon: Ticket },
        ]
    },
    {
        title: 'Partners',
        items: [
            { name: 'Service Partners', href: '/office/partners', icon: UserCheck },
            // { name: 'Partner Applications', href: '/office/partner-applications', icon: ClipboardList },
            // { name: 'Attendance', href: '/office/attendance', icon: Clock },
            // { name: 'Partner Performance', href: '/office/partner-performance', icon: Activity },
        ]
    },
    // {
    //     title: 'Employees',
    //     items: [
    //         { name: 'Employees', href: '/office/employees', icon: Users },
    //         { name: 'Roles', href: '/office/roles', icon: Shield },
    //         { name: 'Permissions', href: '/office/permissions', icon: Key },
    //         { name: 'Activity Logs', href: '/office/activity-logs', icon: History },
    //     ]
    // },
    {
        title: 'Finance',
        items: [
            { name: 'Payments', href: '/office/payments', icon: CreditCard },
            { name: 'Invoices', href: '/office/invoices', icon: FileDigit },
            // { name: 'Refunds', href: '/office/refunds', icon: Undo2 },
            { name: 'Expenses', href: '/office/expenses', icon: Receipt },
        ]
    },
    // {
    //     title: 'Marketing',
    //     items: [
    //         { name: 'Campaigns', href: '/office/campaigns', icon: Megaphone },
    //         { name: 'Notifications', href: '/office/notifications', icon: Bell },
    //         { name: 'Email Templates', href: '/office/email-templates', icon: Mail },
    //         { name: 'WhatsApp Campaigns', href: '/office/whatsapp', icon: MessageCircle },
    //     ]
    // },
    {
        title: 'Reports',
        items: [
            { name: 'Revenue Reports', href: '/office/reports/revenue', icon: TrendingUp },
            { name: 'Booking Reports', href: '/office/reports/bookings', icon: BarChart3 },
            // { name: 'Customer Reports', href: '/office/reports/customers', icon: PieChart },
            // { name: 'Partner Reports', href: '/office/reports/partners', icon: BarChart3 },
        ]
    },
    {
        title: 'Content Management',
        items: [
            { name: 'FAQs', href: '/office/faqs', icon: HelpCircle },
        ]
    },
    // System section removed — Settings moved to profile dropdown
];

const bottomLinks = [
    { name: 'Help Center', href: '/office/help', icon: HelpCircle },
    { name: 'Documentation', href: '/office/docs', icon: BookOpen },
    { name: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

export default function Sidebar({ isOpen }) {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ width: 280 }}
            animate={{ width: isOpen ? 280 : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 relative overflow-hidden z-20 transition-colors duration-200"
        >
            <div className="h-[72px] flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
                        <img src="/logo.png" className='w-full h-full object-cover' alt="Brand Logo" />
                    </div>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">HomeCare</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Office ERP</span>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4">
                <div className="px-3 space-y-6">
                    {navGroups.map((group, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1"
                                >
                                    {group.title}
                                </motion.span>
                            )}
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        title={!isOpen ? item.name : undefined}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative ${
                                            isActive 
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                                        }`}
                                    >
                                        <div className={`flex items-center justify-center ${!isOpen && 'mx-auto'}`}>
                                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                                        </div>
                                        {isOpen && (
                                            <span className="whitespace-nowrap text-sm">{item.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                {bottomLinks.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        title={!isOpen ? item.name : undefined}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 group relative"
                        onClick={(e) => {
                            if (item.isLogout) {
                                // Add logout logic here
                            }
                        }}
                    >
                        <div className={`flex items-center justify-center ${!isOpen && 'mx-auto'}`}>
                            <item.icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                        </div>
                        {isOpen && (
                            <span className="whitespace-nowrap text-sm font-medium">{item.name}</span>
                        )}
                    </Link>
                ))}
            </div>
        </motion.aside>
    );
}
