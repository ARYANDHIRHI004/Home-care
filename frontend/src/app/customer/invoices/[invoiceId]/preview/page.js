'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Sparkles } from 'lucide-react';
import StatusPill from '@/components/customer/StatusPill';
import { findInvoiceById, MOCK_PROFILE } from '@/lib/customerData';

export default function InvoicePreviewPage() {
  const { invoiceId } = useParams();
  const router = useRouter();
  const invoice = findInvoiceById(invoiceId);

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-bold text-[#0F172A] mb-1">Invoice not found</p>
        <button onClick={() => router.back()} className="text-sm text-[#2554F0] font-medium">← Go back</button>
      </div>
    );
  }

  const subtotal = invoice.lineItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const total = subtotal + (invoice.visitCharge || 0) - (invoice.discount || 0) + (invoice.gst || 0);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toolbar — hidden when actually printing */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[#0F172A]/60 hover:text-[#0F172A]">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors"
        >
          <Printer className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* Printable document */}
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-8 print:border-0 print:rounded-none print:p-0">
        <div className="flex items-start justify-between pb-6 border-b border-[#0F172A]/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#2554F0] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HomeCare247</p>
              <p className="text-xs text-[#0F172A]/50">Bhilai-Durg, Chhattisgarh</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#0F172A]">{invoice.id}</p>
            <p className="text-xs text-[#0F172A]/50">{invoice.booking.date}</p>
            <div className="mt-1"><StatusPill status={invoice.status} /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-1">Billed To</p>
            <p className="font-medium text-[#0F172A]">{MOCK_PROFILE.name}</p>
            <p className="text-[#0F172A]/60">{MOCK_PROFILE.phone}</p>
            <p className="text-[#0F172A]/60">{invoice.booking.address}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-1">Booking Reference</p>
            <p className="font-medium text-[#0F172A]">{invoice.booking.id}</p>
            <p className="text-[#0F172A]/60">{invoice.booking.service}</p>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b border-[#0F172A]/10 text-left text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, i) => (
              <tr key={i} className="border-b border-[#0F172A]/5">
                <td className="py-2.5 text-[#0F172A]">{item.name}</td>
                <td className="py-2.5 text-center text-[#0F172A]/60">{item.qty}</td>
                <td className="py-2.5 text-right text-[#0F172A]/60">₹{item.price.toLocaleString()}</td>
                <td className="py-2.5 text-right font-medium text-[#0F172A]">₹{(item.qty * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-56 space-y-2 text-sm">
            <div className="flex justify-between text-[#0F172A]/60">
              <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
            </div>
            {invoice.visitCharge > 0 && (
              <div className="flex justify-between text-[#0F172A]/60">
                <span>Visit Charge</span><span>₹{invoice.visitCharge.toLocaleString()}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span><span>− ₹{invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[#0F172A]/60">
              <span>GST</span><span>₹{invoice.gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#0F172A] pt-2 border-t border-[#0F172A]/10">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#0F172A]/40 mt-8 pt-4 border-t border-[#0F172A]/10">
          This is a system-generated invoice from HomeCare247. For questions, contact support via WhatsApp with reference {invoice.booking.id}.
        </p>
      </div>
    </div>
  );
}
