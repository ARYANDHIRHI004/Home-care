'use client';

import { useEffect, useState } from 'react';
import { X, MapPin, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useUpdateProfileMutation } from '@/store/api/customerAuthApi';
import { useGetServiceAreasQuery, useCheckServiceAreaMutation } from '@/store/api/serviceAreaApi';

const HEARD_FROM_OPTIONS = [
  { value: 'google_search', label: 'Google Search' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'friend_referral', label: 'A friend or family member' },
  { value: 'local_ad', label: 'Local ad/flyer' },
  { value: 'other', label: 'Other' },
];

const SECTOR_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

/**
 * Lightweight two-step onboarding prompt — not another checkout flow.
 *
 * `existingAddress` lets registration's address step (see login/register)
 * count for this too — if the customer already gave an address at signup,
 * step 1 is skipped rather than asking again. Skipping step 2 discards
 * everything gathered so far; the backend only requires address and heardFrom
 * together the first time profileCompletedAt is set, not necessarily in the
 * same call (see updateCustomerProfile), so registration's address alone is
 * already saved — this modal just needs to add heardFrom.
 * `onClose` fires on skip and on successful completion alike — the caller only
 * needs to know "stop showing this", not why.
 */
export default function CompleteProfileModal({ isOpen, onClose, existingAddress }) {
  const hasExistingAddress = !!(existingAddress?.line && existingAddress?.city);
  const [step, setStep] = useState(hasExistingAddress ? 2 : 1);
  const [address, setAddress] = useState({ line: '', city: 'Bhilai', landmark: '', locality: '', sectorNumber: '' });
  const [heardFrom, setHeardFrom] = useState('');
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
  const { data: rawServiceAreas = [] } = useGetServiceAreasQuery('active=true', { skip: !isOpen });
  const [checkServiceArea, { data: areaCheck, reset: resetAreaCheck }] = useCheckServiceAreaMutation();

  const sectorArea = rawServiceAreas.find((a) => a.matchType === 'sector');
  const namedAreas = rawServiceAreas.filter((a) => a.matchType !== 'sector');
  const computedLocality = address.locality === sectorArea?.name
    ? (address.sectorNumber ? `Sector ${address.sectorNumber}` : '')
    : address.locality;

  // Non-blocking — saving an address here is useful even outside the current
  // service area, so this is informational only, never a hard stop.
  useEffect(() => {
    if (!computedLocality) {
      resetAreaCheck();
      return;
    }
    const timeout = setTimeout(() => {
      checkServiceArea({ locality: computedLocality });
    }, 300);
    return () => clearTimeout(timeout);
  }, [computedLocality, checkServiceArea, resetAreaCheck]);

  if (!isOpen) return null;

  const canProceed = address.line.trim() && address.city.trim();

  async function handleSubmit() {
    if (!heardFrom) return;
    try {
      await updateProfile(
        hasExistingAddress ? { heardFrom } : { address: { ...address, locality: computedLocality }, heardFrom }
      ).unwrap();
      onClose();
    } catch {
      // error state below the chips already surfaces this; keep modal open to retry
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0F172A]/10">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">
              {step === 1 ? "What's your address?" : 'How did you hear about us?'}
            </h2>
            <p className="text-xs text-[#0F172A]/40 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#0F172A]/40 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-[#0F172A]/50 mb-1">Helps us find partners near you faster next time you book.</p>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#0F172A]/40" />
                <textarea
                  placeholder="Full address"
                  rows={2}
                  value={address.line}
                  onChange={(e) => setAddress((a) => ({ ...a, line: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  className="px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 bg-white"
                >
                  <option value="Bhilai">Bhilai</option>
                  <option value="Durg">Durg</option>
                </select>
                <input
                  placeholder="Landmark (optional)"
                  value={address.landmark}
                  onChange={(e) => setAddress((a) => ({ ...a, landmark: e.target.value }))}
                  className="px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
                />
              </div>

              <div className={address.locality === sectorArea?.name ? 'grid grid-cols-2 gap-3' : ''}>
                <select
                  value={address.locality}
                  onChange={(e) => setAddress((a) => ({ ...a, locality: e.target.value, sectorNumber: '' }))}
                  className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 bg-white"
                >
                  <option value="">Area / Locality (optional)</option>
                  {namedAreas.map((a) => (
                    <option key={a._id} value={a.name}>{a.name}</option>
                  ))}
                  {sectorArea && <option value={sectorArea.name}>{sectorArea.name}</option>}
                </select>
                {address.locality === sectorArea?.name && (
                  <select
                    value={address.sectorNumber}
                    onChange={(e) => setAddress((a) => ({ ...a, sectorNumber: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 bg-white"
                  >
                    <option value="">Select sector</option>
                    {SECTOR_NUMBERS.map((n) => (
                      <option key={n} value={n}>Sector {n}</option>
                    ))}
                  </select>
                )}
              </div>

              {areaCheck && areaCheck.serviceable === false && (
                <p className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  We don&apos;t currently serve this area yet — you can still save it for when we expand here.
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button onClick={onClose} className="text-xs font-medium text-[#0F172A]/40 hover:text-[#0F172A]/60 underline underline-offset-2">
                  Skip for now
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceed}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-40"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {HEARD_FROM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setHeardFrom(opt.value)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                      heardFrom === opt.value
                        ? 'border-[#2554F0] bg-[#F0F4FF] text-[#2554F0] font-medium'
                        : 'border-[#0F172A]/15 text-[#0F172A]/70 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-xs text-rose-600">
                  {error.data?.message || 'Could not save your profile. Please try again.'}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button onClick={onClose} className="text-xs font-medium text-[#0F172A]/40 hover:text-[#0F172A]/60 underline underline-offset-2">
                  Skip for now
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-[#0F172A]/60 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!heardFrom || isLoading}
                    className="px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-40"
                  >
                    {isLoading ? 'Saving…' : 'Done'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
