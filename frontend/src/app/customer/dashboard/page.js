import Link from 'next/link';
import { AlertTriangle, MapPin, Clock, Calendar, Plus, Wrench, MessageCircle, ChevronRight } from 'lucide-react';
import StatusPill from '@/components/customer/StatusPill';
import EmptyState from '@/components/customer/EmptyState';
import { MOCK_BOOKINGS, MOCK_PROFILE, TIMELINE_STEPS } from '@/lib/customerData';

export default function DashboardPage() {
  const active = MOCK_BOOKINGS.find((b) => b.status === 'active');
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === 'upcoming').slice(0, 1)[0];
  const pendingEstimate = MOCK_BOOKINGS.find((b) => b.estimate?.status === 'Pending');
  const hasAnyActivity = active || upcoming || pendingEstimate;

  const firstName = MOCK_PROFILE.name.split(' ')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Hi {firstName} 👋
        </h1>
        <p className="text-sm text-[#0F172A]/50">Here's what's happening with your services.</p>
      </div>

      {!hasAnyActivity ? (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl">
          <EmptyState
            icon={Wrench}
            title="No active services"
            description="Book a service and it'll show up here so you can track it end to end."
            actionLabel="Book New Service"
            actionHref="/customer/book"
          />
        </div>
      ) : (
        <>
          {/* Pending action banner */}
          {pendingEstimate && (
            <Link
              href={`/customer/services/${pendingEstimate.id}`}
              className="flex items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-900">You have an estimate awaiting your response</p>
                  <p className="text-xs text-amber-700">
                    {pendingEstimate.estimate.id} · ₹{pendingEstimate.estimate.amount.toLocaleString()} · Expires in {pendingEstimate.estimate.expiresIn}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-800 shrink-0">
                Review <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}

          {/* Active service */}
          {active && (
            <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider">Active Service</span>
                <StatusPill status="In Progress" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F4FF] flex items-center justify-center text-2xl">{active.icon}</div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">{active.service}</h3>
                  <p className="text-xs text-[#0F172A]/50">{TIMELINE_STEPS[active.timelineStep]}</p>
                </div>
              </div>
              {active.partner && (
                <div className="flex items-center justify-between p-3 bg-[#F0F4FF]/60 rounded-xl mb-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{active.partner.name}</p>
                    <p className="text-xs text-[#0F172A]/50">★{active.partner.rating} · {active.partner.experience}</p>
                  </div>
                  <span className="text-xs font-medium text-[#0F172A]/60">On the way</span>
                </div>
              )}
              <Link
                href={`/customer/services/${active.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors"
              >
                Track Service
              </Link>
            </div>
          )}

          {/* Upcoming */}
          {upcoming && (
            <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
              <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-3 block">Upcoming</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#F0F4FF] flex items-center justify-center text-xl">{upcoming.icon}</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{upcoming.service}</h3>
                    <p className="text-xs text-[#0F172A]/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {upcoming.date}, {upcoming.time}
                    </p>
                  </div>
                </div>
                <Link href={`/customer/services/${upcoming.id}`} className="text-xs font-bold text-[#2554F0] flex items-center gap-1">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Recent activity */}
          <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
            <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-3 block">Recent Activity</span>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2554F0] shrink-0" />
                <span className="text-[#0F172A]/70">Partner assigned for {active?.service || 'your booking'}</span>
                <span className="text-[#0F172A]/30 text-xs ml-auto shrink-0">2 hrs ago</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]/20 shrink-0" />
                <span className="text-[#0F172A]/70">Booking confirmed</span>
                <span className="text-[#0F172A]/30 text-xs ml-auto shrink-0">Yesterday</span>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Quick actions — desktop only, mobile already has these as the bottom nav */}
      <div className="hidden md:flex gap-3">
        <Link href="/customer/book" className="flex items-center gap-2 px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors">
          <Plus className="w-4 h-4" /> Book New Service
        </Link>
        {active && (
          <Link href={`/customer/services/${active.id}`} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <MapPin className="w-4 h-4" /> Track Service
          </Link>
        )}
        <a
          href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20my%20HomeCare%20booking"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" /> Contact Support
        </a>
      </div>
    </div>
  );
}
