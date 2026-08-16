'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Calendar, Check, MessageCircle, Download, RotateCcw, X, AlertCircle, Star, RefreshCcw,
} from 'lucide-react';
import StatusPill from '@/components/customer/StatusPill';
import EstimateDocument from '@/components/customer/EstimateDocument';
import { useGetBookingByIdQuery } from '@/store/api/bookingApi';
import { useRespondToMyEstimateMutation } from '@/store/api/estimateApi';
import { mapCustomerBooking, mapCustomerEstimate, TIMELINE_STEPS } from '@/lib/customerApiMappers';

const REJECT_REASONS = ['Price too high', "Timing doesn't work", 'Found another provider', 'Other'];

// Reschedule/Cancel only make sense before a partner is already en route —
// once "Technician On Route" (index 5) or later, those actions disable with
// an explanation instead of just vanishing, per the blueprint.
const RESCHEDULE_CUTOFF_STEP = 5;

export default function ServiceDetailsPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const { data: rawBooking, isLoading, isError } = useGetBookingByIdQuery(bookingId);
  const booking = rawBooking ? mapCustomerBooking(rawBooking) : null;
  const estimate = rawBooking?.estimateId ? mapCustomerEstimate(rawBooking.estimateId, rawBooking) : null;
  const estimateDocRef = useRef(null);

  const [respondToEstimate, { isLoading: isResponding, error: respondError }] = useRespondToMyEstimateMutation();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [estimateStatus, setEstimateStatus] = useState(booking?.estimate?.status);
  const [review, setReview] = useState(booking?.review || null);
  const [draftRating, setDraftRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [draftComment, setDraftComment] = useState('');

  useEffect(() => {
    setEstimateStatus(booking?.estimate?.status);
  }, [booking?.estimate?.status]);

  if (isLoading) return <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading booking...</div>;
  if (isError) return <div className="py-12 text-center text-sm text-rose-600">Unable to load booking.</div>;

  if (!booking) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-10 h-10 text-[#0F172A]/20 mx-auto mb-3" />
        <p className="text-sm font-bold text-[#0F172A] mb-1">Couldn&apos;t load this booking</p>
        <Link href="/customer/services" className="text-sm text-[#2554F0] font-medium">← Back to My Services</Link>
      </div>
    );
  }

  const canReschedule = booking.status !== 'completed' && booking.status !== 'cancelled' && booking.timelineStep < RESCHEDULE_CUTOFF_STEP;
  const isPendingEstimate = estimateStatus === 'Pending';

  async function acceptEstimate() {
    try {
      await respondToEstimate({ id: booking.estimate.id, approvalStatus: 'approved' }).unwrap();
      setEstimateStatus('Approved');
    } catch {
      // respondError below the estimate card already surfaces this
    }
  }

  async function confirmRejectEstimate() {
    try {
      await respondToEstimate({ id: booking.estimate.id, approvalStatus: 'rejected', rejectReason }).unwrap();
      setEstimateStatus('Rejected');
      setRejectOpen(false);
    } catch {
      // respondError below the estimate card already surfaces this — leave
      // the modal open so the customer can retry instead of silently
      // losing their selected reason.
    }
  }

  async function downloadEstimatePdf() {
    if (!estimateDocRef.current || !estimate) return;
    const { default: html2pdf } = await import('html2pdf.js');
    await html2pdf()
      .set({
        margin: 0,
        filename: `${estimate.id}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(estimateDocRef.current)
      .save();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 -ml-1.5 text-[#0F172A]/50 hover:text-[#0F172A] rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-xs text-[#0F172A]/40">{booking.id}</p>
          <h1 className="text-lg font-bold text-[#0F172A]">{booking.service}</h1>
        </div>
      </div>

      {/* Status timeline — horizontal on desktop, vertical on mobile per the blueprint */}
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-center justify-between mb-2">
          {TIMELINE_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute top-2 right-1/2 w-full h-0.5 -z-10 ${i <= booking.timelineStep ? 'bg-[#2554F0]' : 'bg-[#0F172A]/10'}`} />
              )}
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center mb-2 ${
                  i < booking.timelineStep ? 'bg-[#2554F0]' : i === booking.timelineStep ? 'bg-[#2554F0] ring-4 ring-[#2554F0]/20' : 'bg-[#0F172A]/10'
                }`}
              >
                {i < booking.timelineStep && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className={`text-[10px] text-center leading-tight ${i <= booking.timelineStep ? 'text-[#0F172A] font-medium' : 'text-[#0F172A]/30'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {TIMELINE_STEPS.map((step, i) => (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    i < booking.timelineStep ? 'bg-[#2554F0]' : i === booking.timelineStep ? 'bg-[#2554F0] ring-4 ring-[#2554F0]/20' : 'bg-[#0F172A]/10'
                  }`}
                >
                  {i < booking.timelineStep && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className={`w-0.5 h-6 ${i < booking.timelineStep ? 'bg-[#2554F0]' : 'bg-[#0F172A]/10'}`} />
                )}
              </div>
              <span className={`text-xs pb-6 ${i <= booking.timelineStep ? 'text-[#0F172A] font-medium' : 'text-[#0F172A]/30'}`}>{step}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#0F172A]/50 text-center md:text-left mt-1">
          Current status: <span className="font-semibold text-[#2554F0]">{TIMELINE_STEPS[booking.timelineStep]}</span>
        </p>
      </div>

      {/* Booking + service info */}
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-[#0F172A]/70">
          <Calendar className="w-4 h-4 text-[#0F172A]/40" /> {booking.date}, {booking.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#0F172A]/70">
          <MapPin className="w-4 h-4 text-[#0F172A]/40" /> {booking.address}
        </div>
      </div>

      {/* Partner */}
      {booking.partner && (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
          <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-3 block">Assigned Partner</span>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#F0F4FF] text-[#2554F0] flex items-center justify-center font-bold">
              {booking.partner.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{booking.partner.name}</p>
              <p className="text-xs text-[#0F172A]/50">★{booking.partner.rating} · {booking.partner.experience} experience</p>
            </div>
          </div>
        </div>
      )}

      {/* Estimate */}
      {booking.estimate && estimate && (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5" id="estimate">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider">Estimate — {booking.estimate.id}</span>
            <div className="flex items-center gap-2">
              <StatusPill status={estimateStatus} />
              <button
                onClick={downloadEstimatePdf}
                className="p-2 text-[#0F172A]/40 hover:text-[#2554F0] hover:bg-[#F0F4FF] rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xl font-bold text-[#0F172A] mb-4">₹{booking.estimate.amount.toLocaleString()}</p>
          {isPendingEstimate && (
            <div className="space-y-2">
              <div className="flex gap-3">
                <button
                  onClick={acceptEstimate}
                  disabled={isResponding}
                  className="flex-1 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-50"
                >
                  {isResponding ? 'Saving…' : 'Accept'}
                </button>
                <button
                  onClick={() => setRejectOpen(true)}
                  disabled={isResponding}
                  className="flex-1 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
              {respondError && (
                <p className="text-xs text-rose-600">
                  {respondError.data?.message || 'Could not save your response. Please try again.'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {estimate && (
        <div className="absolute -left-[9999px] top-0 pointer-events-none">
          <div ref={estimateDocRef}>
            <EstimateDocument estimate={estimate} />
          </div>
        </div>
      )}

      {/* Invoice */}
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5" id="invoice">
        <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-3 block">Invoice</span>
        {booking.invoice ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{booking.invoice.id}</p>
              <p className="text-lg font-bold text-[#0F172A]">₹{booking.invoice.amount.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={booking.invoice.status} />
              {booking.invoice.status === 'Paid' && (
                <button className="p-2 text-[#0F172A]/50 hover:text-[#2554F0] hover:bg-[#F0F4FF] rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#0F172A]/40">Not yet generated</p>
        )}
      </div>

      {/* Review — only makes sense once the job is actually done. Shows the
          submitted review read-only if one exists, otherwise a star + comment
          form. This is the step the blueprint's customer journey ends on
          (Payment → Review) but wasn't actually built into the page before. */}
      {booking.status === 'completed' && (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
          <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-3 block">Your Review</span>

          {review ? (
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`w-4 h-4 ${n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#0F172A]/15'}`} />
                ))}
                <span className="text-xs text-[#0F172A]/40 ml-2">{review.date}</span>
              </div>
              {review.comment && <p className="text-sm text-[#0F172A]/70">{review.comment}</p>}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#0F172A]/60">How was {booking.partner?.name || 'your service'}?</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDraftRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star className={`w-6 h-6 transition-colors ${n <= (hoverRating || draftRating) ? 'fill-amber-400 text-amber-400' : 'text-[#0F172A]/15'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                placeholder="Tell us more (optional)"
                rows={2}
                className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 resize-none"
              />
              <button
                onClick={() =>
                  setReview({
                    rating: draftRating,
                    comment: draftComment,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  })
                }
                disabled={!draftRating}
                className="px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-40"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {booking.status === 'completed' && (
          // Pre-fills the checkout via the same query-param mechanism as the
          // My Services "Book Again" card action — one implementation, two
          // entry points into it.
          <Link
            href={`/customer/book?service=${encodeURIComponent(booking.service)}&address=ADDR-1`}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Book Again
          </Link>
        )}
        {/* Reschedule/Cancel aren't self-service yet — no backend endpoint lets
            a customer mutate a booking's schedule or status directly (the
            ones that exist are staff-permission-gated). Rather than leave
            these as enabled buttons with no handler, they hand off to a
            prefilled WhatsApp message to support — a real action, not a
            silent no-op, until a proper customer-facing endpoint exists. */}
        <div className="relative group">
          <a
            href={
              canReschedule
                ? `https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'd like to reschedule booking ${booking.id} (${booking.service}).`)}`
                : undefined
            }
            target={canReschedule ? '_blank' : undefined}
            rel={canReschedule ? 'noreferrer' : undefined}
            aria-disabled={!canReschedule}
            className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium transition-colors ${
              canReschedule ? 'hover:bg-slate-50' : 'opacity-40 pointer-events-none'
            }`}
          >
            <RotateCcw className="w-4 h-4" /> Reschedule
          </a>
          {!canReschedule && booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-[#0F172A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Contact support to change a booking already in progress
            </div>
          )}
        </div>
        <div className="relative group">
          <a
            href={
              canReschedule
                ? `https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'd like to cancel booking ${booking.id} (${booking.service}).`)}`
                : undefined
            }
            target={canReschedule ? '_blank' : undefined}
            rel={canReschedule ? 'noreferrer' : undefined}
            aria-disabled={!canReschedule}
            className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-medium transition-colors ${
              canReschedule ? 'hover:bg-rose-50' : 'opacity-40 pointer-events-none'
            }`}
          >
            <X className="w-4 h-4" /> Cancel
          </a>
        </div>
        <a
          href={`https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20booking%20${booking.id}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" /> Contact Support
        </a>
      </div>

      {/* Reject reason modal */}
      {rejectOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[#0F172A] mb-1">Why are you rejecting this estimate?</h3>
            <p className="text-xs text-[#0F172A]/50 mb-4">Helps our team follow up the right way.</p>
            <div className="space-y-2 mb-5">
              {REJECT_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRejectReason(r)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                    rejectReason === r ? 'border-[#2554F0] bg-[#F0F4FF] text-[#2554F0] font-medium' : 'border-[#0F172A]/15 text-[#0F172A]/70 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {respondError && (
              <p className="text-xs text-rose-600 mb-3">
                {respondError.data?.message || 'Could not save your response. Please try again.'}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setRejectOpen(false)} className="flex-1 py-2.5 text-sm font-medium text-[#0F172A]/70 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                disabled={!rejectReason || isResponding}
                onClick={confirmRejectEstimate}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-40"
              >
                {isResponding ? 'Saving…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
