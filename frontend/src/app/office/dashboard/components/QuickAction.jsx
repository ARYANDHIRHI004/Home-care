import Link from 'next/link';

export default function QuickAction({ title, icon: Icon, href }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 hover:shadow-sm transition-all group duration-200">
            <div className="w-10 h-10 mb-3 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-center leading-tight transition-colors">{title}</span>
        </Link>
    );
}
