import { X, Calendar, User, Star, MessageSquare, Send, Paperclip, CheckCircle2, History, Info } from 'lucide-react';
import { useState } from 'react';

export default function ReviewDrawer({ review, isOpen, onClose }) {
    if (!isOpen || !review) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/20 backdrop-blur-sm transition-opacity">
            <div className="absolute inset-y-0 right-0 w-full max-w-md md:max-w-xl lg:max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">Review Details</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Summary Section */}
                        <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                                {review.customerAvatar}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-slate-900">{review.customerName}</h3>
                                <div className="text-sm text-slate-500 mt-0.5 flex flex-wrap gap-x-4 gap-y-1">
                                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> Customer ID: CUST-8492</span>
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Booking: {review.bookingId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Review Content */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-slate-500">{review.reviewDate}</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{review.title}</h4>
                            <p className="text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                "{review.description}"
                            </p>
                        </div>

                        {/* Attached Photos Mock */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Attached Photos</h4>
                            <div className="flex gap-3">
                                <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs">No Photos</div>
                            </div>
                        </div>

                        {/* Reply Section */}
                        <div className="border-t border-slate-200 pt-6">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                                <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                                Reply to Customer
                            </h4>
                            
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">Thank You</button>
                                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">Apology</button>
                                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">Issue Resolved</button>
                            </div>
                            
                            <div className="bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                <textarea 
                                    className="w-full p-4 text-sm text-slate-700 outline-none resize-none min-h-[120px] placeholder:text-slate-400"
                                    placeholder="Write your response here. This will be visible to the customer..."
                                ></textarea>
                                <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                                    <button className="text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Reply
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Internal Timeline */}
                        <div className="border-t border-slate-200 pt-6">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                                <History className="w-4 h-4 mr-2 text-slate-400" />
                                Timeline
                            </h4>
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[-0.35rem] md:ml-0 z-10"></div>
                                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-sm font-bold text-slate-900">Review Submitted</div>
                                            <time className="text-xs font-medium text-blue-600">{review.reviewDate}</time>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[-0.35rem] md:ml-0 z-10"></div>
                                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-sm font-bold text-slate-900">Booking Completed</div>
                                            <time className="text-xs font-medium text-slate-500">{review.serviceDate}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
