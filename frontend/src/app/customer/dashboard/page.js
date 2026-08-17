'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, MapPin, Clock, Calendar, Plus, Wrench, MessageCircle, ChevronRight } from 'lucide-react';
import StatusPill from '@/components/customer/StatusPill';
import EmptyState from '@/components/customer/EmptyState';
import CompleteProfileModal from '@/components/customer/CompleteProfileModal';
import { useGetCustomerBookingsQuery } from '@/store/api/bookingApi';
import { useGetMyEnquiriesQuery } from '@/store/api/enquiryApi';
import { mapCustomerBooking, mapCustomerEnquiry, TIMELINE_STEPS } from '@/lib/customerApiMappers';
import { authClient } from '@/lib/auth';

const PROMPTED_FLAG = 'homecare_profile_prompt_shown';

function timeAgo(date) {
  if (!date) return '';
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

// Real events derived from actual bookings/enquiries — replaces what used
// to be two hardcoded "2 hrs ago" / "Yesterday" lines shown identically to
// every customer regardless of their actual account history.
function buildActivityFeed(bookings, pendingRequests) {
  const events = [];
  for (const b of bookings) {
    const raw = b._raw;
    if (raw?.createdAt) {
      events.push({ key: `${b.id}-created`, text: `Booking confirmed for ${b.service}`, date: raw.createdAt });
    }
    if (b.partner && raw?.updatedAt) {
      events.push({ key: `${b.id}-partner`, text: `Partner assigned for ${b.service}`, date: raw.updatedAt });
    }
  }
  for (const r of pendingRequests) {
    if (r._raw?.createdAt) {
      events.push({ key: `${r.id}-submitted`, text: `Request submitted for ${r.service}`, date: r._raw.createdAt });
    }
  }
  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
}

export default function DashboardPage() {
  const { data: rawBookings = [], isLoading, isError } = useGetCustomerBookingsQuery();
  const { data: rawEnquiries = [] } = useGetMyEnquiriesQuery();
  const { data: session } = authClient.useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    // Presence of profileCompletedAt, not the individual fields — a customer
    // who explicitly skipped still has it null, so they're asked again next
    // login, but not repeatedly within this same visit.
    if (session.user.profileCompletedAt) return;
    if (sessionStorage.getItem(PROMPTED_FLAG)) return;

    sessionStorage.setItem(PROMPTED_FLAG, '1');
    setShowProfileModal(true);
  }, [session]);
  const bookings = rawBookings.map(mapCustomerBooking);

  // console.log(rawBookings, rawEnquiries, bookings);
  

  // A submitted request has no Booking yet — that only exists once office
  // converts an approved Estimate — so without this it has nowhere to show
  // up at all despite the customer having just submitted it seconds ago.
  const pendingRequests = rawEnquiries
    .filter((e) => e.status !== 'converted' && e.status !== 'dropped')
    .map(mapCustomerEnquiry);
  const active = bookings.find((b) => b.status === 'active') || pendingRequests[0];
  const upcoming = bookings.filter((b) => b.status === 'upcoming').slice(0, 1)[0];
  const pendingEstimate = bookings.find((b) => b.estimate?.status === 'Pending');
  const hasAnyActivity = active || upcoming || pendingEstimate;
  const activityFeed = buildActivityFeed(bookings, pendingRequests);

  const firstName = rawBookings[0]?.customerId?.name?.split(' ')[0] || 'there';

  const profileModal = (
    <CompleteProfileModal
      isOpen={showProfileModal}
      onClose={() => setShowProfileModal(false)}
      existingAddress={session?.user?.address}
    />
  );

  if (isLoading) {
    return (
      <>
        {profileModal}
        <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading dashboard...</div>
      </>
    );
  }
  if (isError) {
    return (
      <>
        {profileModal}
        <div className="py-12 text-center text-sm text-rose-600">Unable to load dashboard.</div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {profileModal}
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
                <StatusPill status={active.isPendingRequest ? 'Pending Review' : 'In Progress'} />
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
              {active.isPendingRequest ? (
                <p className="text-center text-xs text-[#0F172A]/50 py-2.5">
                  Our team will call you within 2 hours to confirm and share an estimate.
                </p>
              ) : (
              <Link
                href={`/customer/services/${active.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors"
              >
                Track Service
              </Link>
              )}
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

          {/* Recent activity — real events, not the same two hardcoded lines
              every customer used to see regardless of their own history. */}
          {activityFeed.length > 0 && (
            <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
              <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-3 block">Recent Activity</span>
              <ul className="space-y-3">
                {activityFeed.map((event, i) => (
                  <li key={event.key} className="flex items-center gap-3 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-[#2554F0]' : 'bg-[#0F172A]/20'}`} />
                    <span className="text-[#0F172A]/70">{event.text}</span>
                    <span className="text-[#0F172A]/30 text-xs ml-auto shrink-0">{timeAgo(event.date)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Quick actions — desktop only, mobile already has these as the bottom nav */}
      <div className="hidden md:flex gap-3">
        <Link href="/customer/book" className="flex items-center gap-2 px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors">
          <Plus className="w-4 h-4" /> Book New Service
        </Link>
        {active && !active.isPendingRequest && (
          <Link href={`/customer/services/${active.id}`} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <MapPin className="w-4 h-4" /> Track Service
          </Link>
        )}
        <a
          href="https://wa.me/919111466642?text=Hi%2C%20I%20need%20help%20with%20my%20HomeCare%20booking"
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
