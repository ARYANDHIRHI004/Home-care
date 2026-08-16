'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import EstimateDocument from '@/components/customer/EstimateDocument';
import { useGetMyEstimateByIdQuery, useRespondToMyEstimateMutation } from '@/store/api/estimateApi';
import { mapCustomerEstimate } from '@/lib/customerApiMappers';
import { authClient } from '@/lib/auth';

const REJECT_REASONS = ['Price too high', "Timing doesn't work", 'Found another provider', 'Other'];

// The shareable link an office worker copies from CreateEstimateModal and the
// URL the estimate email's "View & Approve Estimate" button points to — this
// route is what makes both of those real. Lives behind the same authenticated
// /customer/** guard as the rest of the dashboard (see middleware.js); a
// logged-out visitor is bounced through /login and lands back here.
export default function CustomerEstimateDetailPage() {
  const { estimateId } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: rawEstimate, isLoading, isError } = useGetMyEstimateByIdQuery(estimateId, { skip: !estimateId });
  const [respondToEstimate, { isLoading: isResponding, error: respondError }] = useRespondToMyEstimateMutation();
  const [status, setStatus] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (isLoading) return <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading estimate...</div>;

  if (isError || !rawEstimate) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-bold text-[#0F172A] mb-1">Estimate not found</p>
        <p className="text-xs text-[#0F172A]/50 mb-4">It may have been removed, or it doesn&apos;t belong to this account.</p>
        <button onClick={() => router.push('/customer/estimates')} className="text-sm text-[#2554F0] font-medium">← Back to Estimates</button>
      </div>
    );
  }

  const estimate = mapCustomerEstimate(rawEstimate);
  const profile = session?.user ? { name: session.user.name, phone: session.user.phoneNumber } : null;
  const currentStatus = status || estimate.status;
  const isPending = currentStatus === 'Pending';

  async function acceptEstimate() {
    try {
      await respondToEstimate({ id: estimateId, approvalStatus: 'approved' }).unwrap();
      setStatus('Approved');
    } catch {
      // respondError below already surfaces this
    }
  }

  async function confirmReject() {
    try {
      await respondToEstimate({ id: estimateId, approvalStatus: 'rejected', rejectReason }).unwrap();
      setStatus('Rejected');
      setRejectOpen(false);
    } catch {
      // respondError below already surfaces this — leave modal open to retry
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <button onClick={() => router.push('/customer/estimates')} className="flex items-center gap-1.5 text-sm text-[#0F172A]/60 hover:text-[#0F172A]">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      <div className="bg-white border border-[#0F172A]/10 rounded-2xl overflow-hidden print:border-0 print:rounded-none">
        <EstimateDocument
          estimate={{
            ...estimate,
            booking: estimate.booking || { id: estimate.bookingId || '-', service: estimate.service, address: '-' },
          }}
          profile={profile}
        />
      </div>

      {/* This is the page the estimate email's "View & Approve Estimate"
          button actually links to — without a real accept/reject action
          here, a customer following that link had no way to respond at all. */}
      {isPending && (
        <div className="mt-4 p-5 bg-white border border-[#0F172A]/10 rounded-2xl print:hidden space-y-3">
          <div className="flex gap-3">
            <button
              onClick={acceptEstimate}
              disabled={isResponding}
              className="flex-1 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-50"
            >
              {isResponding ? 'Saving…' : 'Accept Estimate'}
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
            <p className="text-xs text-rose-600">{respondError.data?.message || 'Could not save your response. Please try again.'}</p>
          )}
        </div>
      )}

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
            <div className="flex gap-3">
              <button onClick={() => setRejectOpen(false)} className="flex-1 py-2.5 text-sm font-medium text-[#0F172A]/70 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                disabled={!rejectReason || isResponding}
                onClick={confirmReject}
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
