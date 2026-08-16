'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPinOff, CheckCircle2 } from 'lucide-react';
import { useNotifyMeWhenAvailableMutation } from '@/store/api/serviceAreaApi';

export default function UnavailablePage() {
  const searchParams = useSearchParams();
  const locality = searchParams.get('locality') || '';

  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notifyMe, { isLoading, error }] = useNotifyMeWhenAvailableMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contact.trim()) return;
    try {
      await notifyMe({ contact: contact.trim(), locality }).unwrap();
      setSubmitted(true);
    } catch {
      // error surfaced below the form
    }
  }

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
        <MapPinOff className="w-7 h-7 text-amber-600" />
      </div>
      <h1 className="text-xl font-bold text-[#0F172A] mb-2">
        Sorry, we&apos;re not in your area yet
      </h1>
      <p className="text-sm text-[#0F172A]/60 mb-8">
        HomeCare247 currently serves select localities across Bhilai and Durg only
        {locality && <> — <span className="font-medium text-[#0F172A]">{locality}</span> isn&apos;t on that list yet</>}.
      </p>

      {submitted ? (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            We&apos;ll let you know the moment we launch in your area.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <label className="block text-xs font-medium text-[#0F172A]/70">
            Notify me when you launch here
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or mobile number"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
          />
          {error && (
            <p className="text-xs text-red-600">
              {error.data?.message || 'Could not save your details. Please try again.'}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2554F0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Saving…' : 'Notify me'}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-[#0F172A]/70 mt-8">
        <Link href="/customer/dashboard" className="text-[#2554F0] font-medium hover:underline">
          Back to Dashboard
        </Link>
      </p>
    </div>
  );
}
