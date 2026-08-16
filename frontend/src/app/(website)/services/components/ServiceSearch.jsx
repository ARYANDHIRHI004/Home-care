import React from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceSearch({ 
  searchQuery, 
  setSearchQuery, 
  showSuggestions, 
  setShowSuggestions, 
  suggestions, 
  onSuggestionClick 
}) {
  return (
    <div className="relative max-w-2xl mx-auto w-full z-40">
      <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 p-2 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#2563EB]/10 transition-all">
        
        {/* Service area — informational only, not a switcher (this app only
            serves Bhilai-Durg, so there's nothing to switch to). Not styled
            as clickable to avoid implying an inert control. */}
        <div className="hidden sm:flex items-center px-4 py-2 gap-2 text-slate-700 text-sm font-semibold border-r border-slate-200 shrink-0">
          <MapPin className="w-5 h-5 text-[#2563EB]" />
          <span>Bhilai - Durg</span>
        </div>

        {/* Search Input */}
        <div className="flex-grow flex items-center px-4 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for AC Repair, Deep Cleaning..."
            className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base text-[#0F172A] placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }} 
              className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showSuggestions && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="p-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-3 py-2 block">
                Suggested Services
              </span>
              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSuggestionClick(item.name)}
                    className="w-full text-left px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                    <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-slate-500 text-center">
                  No matches found for "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
