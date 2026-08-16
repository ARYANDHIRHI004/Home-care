'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';
import { useGetPartnersQuery } from '@/store/api/partnerApi';

export default function PartnerStatus() {
    const { data: partners = [] } = useGetPartnersQuery();

    const activeCount = partners.filter(p => p.active !== false).length;
    const busyCount = partners.filter(p => p.active !== false && p.isBusy).length;
    const offlineCount = partners.filter(p => p.active === false).length;

    const topPartners = partners.length > 0 
        ? [...partners].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3) 
        : [];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-slate-900/50 p-6 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Partner Status Overview</h3>
                <Link href="/office/partners" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Manage
                </Link>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Online & Active</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {activeCount}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">On Job (Busy)</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {busyCount}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Offline</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {offlineCount}
                    </span>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-4">Top Performers</h4>
                {topPartners.length > 0 ? (
                    <div className="flex gap-4">
                        {topPartners.map((p, i) => (
                            <div key={i} className="flex-1 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-2 flex items-center justify-center text-lg transition-colors">👨🏽‍🔧</div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">{p.name || `Partner ${i+1}`}</p>
                                <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{p.rating || 4.9}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No active partners yet.</p>
                )}
            </div>
        </div>
    );
}
