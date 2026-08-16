import React from 'react';

export default function CategoryTabs({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="sticky top-[61px] z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#2563EB]'}`} />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
