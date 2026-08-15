'use client';

import { Star, MoreHorizontal, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useGetFeedbackQuery, useDeleteFeedbackMutation } from '@/store/api/feedbackApi';

const fallbackReviews = [
    {
        id: 'REV-10492',
        _id: '1',
        bookingId: 'BKG-84920',
        customerName: 'Rahul Sharma',
        customerAvatar: 'RS',
        partnerName: 'Vikram Singh',
        serviceName: 'Deep Home Cleaning',
        rating: 5,
        title: 'Excellent and thorough cleaning!',
        description: 'The team was very professional and did an amazing job with the deep cleaning. Highly recommend!',
        reviewDate: 'Oct 25, 2023',
        status: 'Published',
        tags: ['Punctuality', 'Quality']
    },
    {
        id: 'REV-10491',
        _id: '2',
        bookingId: 'BKG-84915',
        customerName: 'Priya Patel',
        customerAvatar: 'PP',
        partnerName: 'Amit Kumar',
        serviceName: 'AC Repair & Service',
        rating: 4,
        title: 'Great and fast resolution',
        description: 'Fixed the AC cooling issue quickly. Polite and clean workmanship.',
        reviewDate: 'Nov 04, 2023',
        status: 'Published',
        tags: ['Quality', 'Communication']
    },
    {
        id: 'REV-10490',
        _id: '3',
        bookingId: 'BKG-84910',
        customerName: 'Sneha Gupta',
        customerAvatar: 'SG',
        partnerName: 'Rajesh Khanna',
        serviceName: 'Bathroom Cleaning',
        rating: 4,
        title: 'Good job, satisfied with service',
        description: 'The cleaning was thorough and neat. Satisfied with the service quality.',
        reviewDate: 'Aug 16, 2023',
        status: 'Published',
        tags: ['Quality']
    },
];

const RatingStars = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                    key={star}
                    className={`w-3.5 h-3.5 ${
                        star <= rating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-200 fill-slate-200'
                    }`}
                />
            ))}
        </div>
    );
};

export default function ReviewList({ searchQuery, onReviewClick }) {
    const { data: rawFeedback = [], isLoading } = useGetFeedbackQuery();
    const [deleteFeedback] = useDeleteFeedbackMutation();
    const [openMenuId, setOpenMenuId] = useState(null);

    const reviews = rawFeedback.length > 0
        ? rawFeedback.map(f => ({
            id: `REV-${f._id?.slice(-5).toUpperCase()}`,
            _id: f._id,
            bookingId: f.workOrderId ? `WO-${f.workOrderId.toString().slice(-4).toUpperCase()}` : 'WO-RECENT',
            customerName: f.customerId?.name || 'Customer',
            customerAvatar: (f.customerId?.name || 'CU').slice(0, 2).toUpperCase(),
            partnerName: 'Service Team',
            serviceName: 'HomeCare Service',
            rating: f.rating || 5,
            title: f.comment ? (f.comment.slice(0, 40) + '...') : 'Service Feedback',
            description: f.comment || 'Satisfied with the service provided.',
            reviewDate: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Recent',
            status: 'Published',
            tags: ['Verified Customer'],
            _raw: f,
        }))
        : fallbackReviews;

    const filtered = reviews.filter(r =>
        !searchQuery ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteFeedback(id).unwrap();
                setOpenMenuId(null);
            } catch (err) {
                console.error('Failed to delete review', err);
            }
        }
    };

    return (
        <div className="space-y-4">
            {filtered.map((review) => (
                <div 
                    key={review._id || review.id}
                    onClick={() => onReviewClick?.(review)}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                >
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100 flex-shrink-0">
                                {review.customerAvatar}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {review.customerName}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                                        <ShieldCheck className="w-3 h-3" /> Verified
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5 font-mono">{review.id} • {review.bookingId}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                            <RatingStars rating={review.rating} />
                            {review._raw && (
                                <button
                                    onClick={(e) => handleDelete(review._id, e)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Delete Review"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-1">{review.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{review.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                        <span>{review.serviceName}</span>
                        <span>{review.reviewDate}</span>
                    </div>
                </div>
            ))}

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
                    No reviews found.
                </div>
            )}
        </div>
    );
}
