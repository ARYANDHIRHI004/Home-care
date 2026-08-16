'use client';

import { Sparkles } from 'lucide-react';
import StatusPill from './StatusPill';

export default function EstimateDocument({ estimate, profile }) {
  const subtotal = estimate.lineItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const total = subtotal + (estimate.visitCharge || 0) - (estimate.discount || 0);

  return (
    <div className="bg-white p-8 text-[#0F172A]">
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
          <p className="text-sm font-bold text-[#0F172A]">{estimate.id}</p>
          {estimate.expiresIn && <p className="text-xs text-[#0F172A]/50">Expires in {estimate.expiresIn}</p>}
          <div className="mt-1"><StatusPill status={estimate.status} /></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-1">Prepared For</p>
          <p className="font-medium text-[#0F172A]">{profile?.name || 'Customer'}</p>
          <p className="text-[#0F172A]/60">{profile?.phone || '-'}</p>
          <p className="text-[#0F172A]/60">{estimate.booking.address}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider mb-1">Booking Reference</p>
          <p className="font-medium text-[#0F172A]">{estimate.booking.id}</p>
          <p className="text-[#0F172A]/60">{estimate.booking.service}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-[#0F172A]/10 text-left text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider">
            <th className="pb-2">Service</th>
            <th className="pb-2 text-center">Qty</th>
            <th className="pb-2 text-right">Price</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {estimate.lineItems.map((item, i) => (
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
          {estimate.visitCharge > 0 && (
            <div className="flex justify-between text-[#0F172A]/60">
              <span>Visit Charge</span><span>₹{estimate.visitCharge.toLocaleString()}</span>
            </div>
          )}
          {estimate.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span><span>− ₹{estimate.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-[#0F172A] pt-2 border-t border-[#0F172A]/10">
            <span>Estimated Total</span><span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#0F172A]/40 mt-8 pt-4 border-t border-[#0F172A]/10">
        This is an estimate, not a bill — final charges may vary slightly based on work actually performed.
        GST will be added on the final invoice.
      </p>
    </div>
  );
}
