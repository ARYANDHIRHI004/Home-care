import React from 'react';

export default function ServiceSection({ title, subtitle, children }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="flex flex-col mb-10">
        {subtitle && (
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2">
            {subtitle}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
