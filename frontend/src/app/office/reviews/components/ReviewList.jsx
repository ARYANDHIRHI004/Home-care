import { Star, MoreHorizontal, ShieldCheck, CornerDownRight, MessageSquare, AlertTriangle, MessageCircleHeart } from 'lucide-react';
import { useState } from 'react';

const mockReviews = [
    {
        id: 'REV-10492',
        bookingId: 'BKG-84920',
        customerName: 'Rahul Sharma',
        customerAvatar: 'RS',
        partnerName: 'Vikram Singh',
        serviceName: 'Deep Home Cleaning',
        rating: 5,
        title: 'Excellent and thorough cleaning!',
        description: 'Vikram was very professional and did an amazing job with the deep cleaning. Every corner of the house is shining. Highly recommend his services!',
        reviewDate: 'Oct 25, 2023',
        serviceDate: 'Oct 24, 2023',
        status: 'New',
        sentiment: 'Positive',
        tags: ['Punctuality', 'Quality', 'Would Recommend']
    },
    {
        id: 'REV-10491',
        bookingId: 'BKG-84915',
        customerName: 'Priya Patel',
        customerAvatar: 'PP',
        partnerName: 'Amit Kumar',
        serviceName: 'AC Repair & Service',
        rating: 2,
        title: 'AC stopped working again after 2 days',
        description: 'The technician came and fixed the AC, but it started leaking water the very next day. I tried calling but got no response. Very disappointed.',
        reviewDate: 'Nov 04, 2023',
        serviceDate: 'Nov 02, 2023',
        status: 'Escalated',
        sentiment: 'Negative',
        tags: ['Quality', 'Communication']
    },
    {
        id: 'REV-10490',
        bookingId: 'BKG-84910',
        customerName: 'Sneha Gupta',
        customerAvatar: 'SG',
        partnerName: 'Rajesh Khanna',
        serviceName: 'Bathroom Cleaning',
        rating: 4,
        title: 'Good job, but slightly late',
        description: 'The cleaning was perfect, but the partner arrived 30 minutes late. Otherwise, very satisfied with the service quality.',
        reviewDate: 'Aug 16, 2023',
        serviceDate: 'Aug 15, 2023',
        status: 'Replied',
        sentiment: 'Neutral',
        tags: ['Quality']
    },
];

const RatingStars = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} 
                />
            ))}
        </div>
    );
};

const SentimentBadge = ({ sentiment }) => {
    if (sentiment === 'Positive') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"><MessageCircleHeart className="w-3 h-3 mr-1" /> Positive</span>;
    if (sentiment === 'Negative') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3 mr-1" /> Negative</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"><MessageSquare className="w-3 h-3 mr-1" /> Neutral</span>;
};

const StatusBadge = ({ status }) => {
    const styles = {
        'New': 'bg-blue-50 text-blue-700 border-blue-200',
        'Replied': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Escalated': 'bg-rose-50 text-rose-700 border-rose-200',
        'Resolved': 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['New']}`}>
            {status}
        </span>
    );
}

export default function ReviewList({ onReviewClick }) {
    const [openActionId, setOpenActionId] = useState(null);

    const toggleAction = (e, id) => {
        e.stopPropagation();
        setOpenActionId(openActionId === id ? null : id);
    };

    return (
        <div className="flex-1 flex flex-col gap-4">
            {mockReviews.map((review) => (
                <div 
                    key={review.id}
                    onClick={() => onReviewClick(review)}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative group"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                                {review.customerAvatar}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 leading-none">{review.customerName}</h4>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Booking" />
                                    <SentimentBadge sentiment={review.sentiment} />
                                </div>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                    <span>{review.reviewDate}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span>Booking {review.bookingId}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <StatusBadge status={review.status} />
                            
                            <div className="relative">
                                <button 
                                    onClick={(e) => toggleAction(e, review.id)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                
                                {openActionId === review.id && (
                                    <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10 py-1" onClick={e => e.stopPropagation()}>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                            <CornerDownRight className="w-4 h-4 mr-2 text-blue-500" /> Reply
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                            <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" /> Escalate
                                        </button>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Booking</button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Customer</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <RatingStars rating={review.rating} />
                            <span className="text-sm font-semibold text-slate-900 ml-1">{review.title}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            "{review.description}"
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                            {review.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="text-xs text-slate-500">
                            Service: <span className="font-medium text-slate-700">{review.serviceName}</span> by <span className="font-medium text-slate-700">{review.partnerName}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
