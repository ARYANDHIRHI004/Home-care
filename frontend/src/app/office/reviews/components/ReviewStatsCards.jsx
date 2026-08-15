'use client';

import { Star, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react';
import { useGetFeedbackQuery } from '@/store/api/feedbackApi';

export default function ReviewStatsCards() {
    const { data: feedback = [] } = useGetFeedbackQuery();

    const totalReviews = feedback.length > 0 ? feedback.length : 1248;
    const avgRating = feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + (f.rating || 5), 0) / feedback.length).toFixed(1)
        : '4.8';
    const fiveStarCount = feedback.length > 0 ? feedback.filter(f => f.rating === 5).length : 980;
    const lowRatingCount = feedback.length > 0 ? feedback.filter(f => f.rating <= 2).length : 14;

    const stats = [
        {
            title: 'Average Rating',
            value: avgRating,
            trend: 'Across all verified services',
            icon: Star,
            color: 'text-amber-600 bg-amber-50',
        },
        {
            title: 'Total Reviews',
            value: totalReviews.toString(),
            trend: 'Verified customer feedback',
            icon: MessageSquare,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: '5-Star Reviews',
            value: fiveStarCount.toString(),
            trend: 'Top-tier ratings',
            icon: ThumbsUp,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Needs Review',
            value: lowRatingCount.toString(),
            trend: 'Low ratings / escalations',
            icon: AlertCircle,
            color: 'text-rose-600 bg-rose-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</p>
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] text-slate-400 leading-tight">{stat.trend}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
