import React from 'react';
import { X } from 'lucide-react';

export default function TermsModal({ 
  isOpen, 
  categoryName, 
  terms, 
  onAccept, 
  onDecline 
}) {
  if (!isOpen || !terms) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close terms overlay" onClick={onDecline} className="absolute inset-0 bg-slate-900/40" />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#0F172A]/10 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#0F172A]/10 p-5">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">{categoryName} Terms &amp; Conditions</h2>
            <p className="mt-1 text-xs text-[#0F172A]/50">Version {terms.version}</p>
          </div>
          <button onClick={onDecline} className="rounded-lg p-2 text-[#0F172A]/50 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-5">
          <p className="text-sm leading-6 text-[#0F172A] whitespace-pre-wrap">{terms.content}</p>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={onDecline}
            className="flex-1 rounded-2xl border border-[#0F172A]/15 px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-slate-50"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 rounded-2xl bg-[#2554F0] px-4 py-3 text-sm font-medium text-white hover:bg-[#1D45D1]"
          >
            I Agree &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
