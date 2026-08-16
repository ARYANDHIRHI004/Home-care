import React from 'react';
import { HelpCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ onReset }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-12 sm:p-20 border border-slate-200 text-center space-y-6 max-w-2xl mx-auto shadow-sm my-10"
    >
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <HelpCircle className="w-12 h-12 text-[#2563EB]" />
      </div>
      <h3 className="font-extrabold text-2xl text-[#0F172A]">No services found</h3>
      <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
        We couldn't find any services matching your current filters or search query. Try adjusting your preferences to see more options.
      </p>
      <button
        onClick={onReset}
        className="mt-6 px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 mx-auto"
      >
        <RefreshCcw className="w-4 h-4" />
        Reset All Filters
      </button>
    </motion.div>
  );
}
