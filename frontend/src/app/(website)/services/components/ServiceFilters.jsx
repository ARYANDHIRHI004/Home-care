import React from 'react';
import { SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, Star, Clock } from 'lucide-react';

export default function ServiceFilters({ filters, setFilters }) {
  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  const handleRatingChange = (e) => {
    setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }));
  };

  const handleAvailabilityChange = (e) => {
    setFilters(prev => ({ ...prev, availability: e.target.value }));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-b border-slate-200">
      
      <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
        <div className="flex items-center gap-2 text-slate-500">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Rating Filter */}
        <select 
          value={filters.minRating}
          onChange={handleRatingChange}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer"
        >
          <option value="0">All Ratings</option>
          <option value="4">4.0+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4.8">4.8+ Stars</option>
        </select>

        {/* Availability Filter */}
        <select 
          value={filters.availability}
          onChange={handleAvailabilityChange}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer"
        >
          <option value="all">Any Availability</option>
          <option value="today">Available Today</option>
          <option value="tomorrow">Available Tomorrow</option>
          <option value="weekend">Available Weekend</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <span className="text-slate-500">Sort By:</span>
        <select 
          value={filters.sort}
          onChange={handleSortChange}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer text-slate-700 font-semibold"
        >
          <option value="popular">Popularity</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

    </div>
  );
}
