import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import StatusPill from './StatusPill';

// The shared card shape from the blueprint (Section 2) — used identically by
// My Services, and reused in spirit (simplified) by Dashboard's Active/Upcoming
// cards. `primaryLabel` is deliberately the only action on the card itself;
// everything else lives behind the card tap-through to Service Details, per
// the blueprint's "never more than one primary action per card" rule.
export default function ServiceCard({ booking, primaryLabel = 'Details' }) {
  return (
    <Link
      href={`/customer/services/${booking.id}`}
      className="flex items-center justify-between gap-4 p-4 bg-white border border-[#0F172A]/10 rounded-2xl hover:border-[#2554F0]/30 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-[#F0F4FF] flex items-center justify-center text-xl shrink-0">
          {booking.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-[#0F172A] truncate">{booking.service}</h3>
          </div>
          <p className="text-xs text-[#0F172A]/50">{booking.id} · {booking.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-[#0F172A]">₹{booking.amount.toLocaleString()}</p>
        </div>
        <StatusPill status={statusLabel(booking)} />
        <span className="flex items-center gap-1 text-xs font-semibold text-[#2554F0] group-hover:gap-1.5 transition-all">
          {primaryLabel} <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function statusLabel(booking) {
  if (booking.status === 'active') return 'In Progress';
  if (booking.status === 'upcoming') return 'Scheduled';
  if (booking.status === 'completed') return 'Completed';
  if (booking.status === 'cancelled') return 'Cancelled';
  return booking.status;
}
