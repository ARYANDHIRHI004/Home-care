'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FileCheck, Download } from 'lucide-react';
import StatusPill from '@/components/customer/StatusPill';
import EmptyState from '@/components/customer/EmptyState';
import EstimateDocument from '@/components/customer/EstimateDocument';
import { useGetCustomerEstimatesQuery } from '@/store/api/estimateApi';
import { mapCustomerEstimate } from '@/lib/customerApiMappers';

// No 'Expired' — the backend's approvalStatus enum is only
// pending/approved/rejected, and nothing computes an expiry from validUntil,
// so an 'Expired' tab could never match a real estimate.
const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function EstimatesPage() {
  const [filter, setFilter] = useState('All');
  const docRefs = useRef({});
  const { data: rawEstimates = [], isLoading, isError } = useGetCustomerEstimatesQuery();
  const estimates = useMemo(() => rawEstimates.map((estimate) => mapCustomerEstimate(estimate)), [rawEstimates]);

  const filtered = useMemo(
    () => (filter === 'All' ? estimates : estimates.filter((e) => e.status === filter)),
    [filter, estimates]
  );

  async function downloadEstimatePdf(estimate) {
    const node = docRefs.current[estimate.id];
    if (!node) return;

    const { default: html2pdf } = await import('html2pdf.js');
    await html2pdf()
      .set({
        margin: 0,
        filename: `${estimate.id}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(node)
      .save();
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Estimates
      </h1>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
              filter === f ? 'bg-[#2554F0] border-[#2554F0] text-white' : 'bg-white border-[#0F172A]/15 text-[#0F172A]/60 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading estimates...</div>
      ) : isError ? (
        <div className="py-12 text-center text-sm text-rose-600">Unable to load estimates.</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl">
          <EmptyState
            icon={FileCheck}
            title="No estimates yet"
            description="They'll show up here once you request a service and our team reviews it."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((estimate) => (
            <div key={estimate.id} className="relative">
              <Link
                href={`/customer/services/${estimate.bookingId}#estimate`}
                className="flex items-center justify-between gap-4 p-4 bg-white border border-[#0F172A]/10 rounded-2xl hover:border-[#2554F0]/30 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">
                    {estimate.id} · {estimate.service}
                  </p>
                  <p className="text-xs text-[#0F172A]/50">
                    ₹{estimate.amount.toLocaleString()}
                    {estimate.expiresIn && ` · Expires in ${estimate.expiresIn}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusPill status={estimate.status} />
                  <button
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      downloadEstimatePdf(estimate);
                    }}
                    className="p-1.5 text-[#0F172A]/40 hover:text-[#2554F0] hover:bg-[#F0F4FF] rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#0F172A]/30" />
                </div>
              </Link>
              <div className="absolute -left-[9999px] top-0 pointer-events-none">
                <div ref={(node) => { if (node) docRefs.current[estimate.id] = node; }}>
                  <EstimateDocument
                    estimate={{
                      ...estimate,
                      // Real address isn't populated by this list endpoint
                      // (getMyEstimates doesn't select it) — leave it for
                      // EstimateDocument to render its own "on file" fallback
                      // rather than show a fabricated address as if real.
                      booking: {
                        id: estimate.bookingId,
                        service: estimate.service,
                        address: estimate.booking?.address || null,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
