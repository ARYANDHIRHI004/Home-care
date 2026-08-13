'use client';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function EnquiryStats({ title, value, icon: Icon, trend, trendValue, subtitle, accentColor }) {
    const accentColors = {
        default: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        yellow: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        red: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
        green: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        gray: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    };

    const accent = accentColors[accentColor] || accentColors.default;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${accent}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}
