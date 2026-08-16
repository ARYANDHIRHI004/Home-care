'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QrCode, Download, Receipt, ChevronDown } from 'lucide-react';
import StatusPill from '@/components/customer/StatusPill';
import EmptyState from '@/components/customer/EmptyState';
import { useGetCustomerInvoicesQuery } from '@/store/api/invoiceApi';
import { useGetCustomerPaymentsQuery } from '@/store/api/paymentApi';
import { mapCustomerInvoice, mapCustomerPayment } from '@/lib/customerApiMappers';

function InvoiceRow({ invoice }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#0F172A]/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">{invoice.id}</p>
          <p className="text-xs text-[#0F172A]/50">{invoice.service} · ₹{invoice.amount.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusPill status={invoice.status} />
          {invoice.status === 'Paid' ? (
            <Link href={`/customer/invoices/${invoice.id}/preview`} className="p-2 text-[#0F172A]/40 hover:text-[#2554F0] hover:bg-[#F0F4FF] rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </Link>
          ) : invoice.status === 'Unpaid' ? (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F4FF] text-[#2554F0] rounded-lg text-xs font-bold"
            >
              How to pay <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          ) : null}
        </div>
      </div>

      {/* No payment gateway for MVP — payment is collected via a UPI QR sent
          over WhatsApp, and this status only flips once the office manually
          verifies it (payments.status: verified, per the DB schema). */}
      {expanded && invoice.status === 'Unpaid' && (
        <div className="px-4 pb-4 pt-1 border-t border-[#0F172A]/5 flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-[#F0F4FF] flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6 text-[#2554F0]" />
          </div>
          <p className="text-xs text-[#0F172A]/60 leading-relaxed">
            Scan the QR code sent to your WhatsApp to pay, or{' '}
            <a
              href={`https://wa.me/919111466642?text=${encodeURIComponent(`Hi, could you resend the payment QR for invoice ${invoice.id}?`)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#2554F0] font-semibold"
            >
              tap here to have it resent
            </a>.
            Your invoice will update once we&apos;ve confirmed the payment — usually within a few hours.
          </p>
        </div>
      )}
      {invoice.status === 'Payment Under Verification' && (
        <div className="px-4 pb-4 pt-1 border-t border-[#0F172A]/5">
          <p className="text-xs text-[#0F172A]/60">
            We&apos;ve received your payment confirmation and are verifying it — usually within a few hours.
          </p>
        </div>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  const [tab, setTab] = useState('invoices');
  const { data: rawInvoices = [], isLoading: invoicesLoading, isError: invoicesError } = useGetCustomerInvoicesQuery();
  const { data: rawPayments = [], isLoading: paymentsLoading, isError: paymentsError } = useGetCustomerPaymentsQuery();
  const invoices = rawInvoices.map((invoice) => mapCustomerInvoice(invoice));
  const payments = rawPayments.map(mapCustomerPayment);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Invoices &amp; Payments
      </h1>

      <div className="flex gap-1 border-b border-[#0F172A]/10">
        {['invoices', 'payments'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-[#2554F0] text-[#2554F0]' : 'border-transparent text-[#0F172A]/50 hover:text-[#0F172A]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'invoices' ? (
        invoicesLoading ? (
          <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading invoices...</div>
        ) : invoicesError ? (
          <div className="py-12 text-center text-sm text-rose-600">Unable to load invoices.</div>
        ) : invoices.length === 0 ? (
          <div className="bg-white border border-[#0F172A]/10 rounded-2xl">
            <EmptyState icon={Receipt} title="No invoices yet" description="These appear once a service is completed." />
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <InvoiceRow key={inv.id} invoice={inv} />
            ))}
          </div>
        )
      ) : paymentsLoading ? (
        <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading payments...</div>
      ) : paymentsError ? (
        <div className="py-12 text-center text-sm text-rose-600">Unable to load payments.</div>
      ) : payments.length === 0 ? (
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl">
          <EmptyState icon={Receipt} title="No payments yet" />
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-[#0F172A]/10 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-[#0F172A]">₹{p.amount.toLocaleString()} · {p.method}</p>
                <p className="text-xs text-[#0F172A]/50">{p.invoiceId} · {p.date}</p>
              </div>
              <StatusPill status={p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
