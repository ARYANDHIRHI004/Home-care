import React from 'react';
import Image from 'next/image';
import { Star, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const RatingBadge = ({ rating, count }) => {
  // The Service model has no rating/review data yet — hide the badge
  // entirely rather than show a fabricated number as if it were real.
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1 text-amber-500">
      <Star className="w-4 h-4 fill-current" />
      <span className="font-bold text-slate-800 text-sm">{rating}</span>
      {count ? <span className="text-xs text-slate-400 font-medium">({count} Reviews)</span> : null}
    </div>
  );
};

export const AvailabilityBadge = ({ status }) => {
  if (!status) return null;
  const isAvailable = status.toLowerCase() === 'today' || status.toLowerCase().includes('available');
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
      isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
      {status}
    </div>
  );
};

export const PriceBadge = ({ price }) => (
  <div className="bg-black/70 backdrop-blur-md text-white text-sm font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
    Starts from ₹{price}
  </div>
);

export default function ServiceCard({ service, onViewDetails, onBookNow }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Image Header */}
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden shrink-0 rounded-t-3xl">
        <Image
          src={service.image} 
          alt={service.title || service.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="bg-white/95 backdrop-blur-sm text-[#0F172A] text-xs font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-lg shadow-sm">
            {service.category}
          </span>
          {service.verified && (
            <div className="bg-[#2563EB] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <PriceBadge price={service.startingPrice || service.price} />
          {service.availability && <AvailabilityBadge status={service.availability} />}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <RatingBadge rating={service.rating} count={service.reviewCount} />
            {service.duration && (
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{service.duration}</span>
              </div>
            )}
          </div>

          <h3 className="font-extrabold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug mb-2 line-clamp-1">
            {service.title || service.name}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => onViewDetails(service)}
            className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all border border-slate-200 text-center hover:border-slate-300 shadow-sm"
          >
            View Details
          </button>
          <button
            onClick={() => onBookNow(service)}
            className="py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 text-center flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/30"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
