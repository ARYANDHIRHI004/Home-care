'use client';

import { useState, useMemo } from 'react';
import { Search, Wrench } from 'lucide-react';
import ServiceCard from '@/components/customer/ServiceCard';
import EmptyState from '@/components/customer/EmptyState';
import { MOCK_BOOKINGS } from '@/lib/customerData';

const TABS = [
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

// Per-tab empty state copy — an empty Cancelled tab is good news and shouldn't
// read like every other empty state, per the blueprint.
const EMPTY_COPY = {
  active: { title: 'No active services', description: 'Services you\u2019re currently receiving will show up here.' },
  upcoming: { title: 'Nothing scheduled', description: 'Book a service and it\u2019ll appear here once confirmed.' },
  completed: { title: 'No completed services yet', description: 'Your service history will build up here over time.' },
  cancelled: { title: 'Nothing cancelled \u2014 that\u2019s a good thing', description: null },
};

const PRIMARY_LABEL = { active: 'Track', upcoming: 'Details', completed: 'Book Again', cancelled: 'Rebook' };

export default function MyServicesPage() {
  const [tab, setTab] = useState('active');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return MOCK_BOOKINGS.filter((b) => b.status === tab).filter((b) =>
      query ? b.service.toLowerCase().includes(query.toLowerCase()) || b.id.toLowerCase().includes(query.toLowerCase()) : true
    );
  }, [tab, query]);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        My Services
      </h1>

      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-[#0F172A]/10 pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? 'border-[#2554F0] text-[#2554F0]' : 'border-transparent text-[#0F172A]/50 hover:text-[#0F172A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookings..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#0F172A]/15 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 focus:border-[#2554F0]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl">
          <EmptyState icon={Wrench} title={EMPTY_COPY[tab].title} description={EMPTY_COPY[tab].description} />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <ServiceCard key={b.id} booking={b} primaryLabel={PRIMARY_LABEL[tab]} />
          ))}
        </div>
      )}
    </div>
  );
}
