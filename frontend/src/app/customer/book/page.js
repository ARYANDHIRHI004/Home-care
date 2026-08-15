'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, ChevronLeft, MapPin, Calendar, Upload, Check, Pencil, PartyPopper, X,
} from 'lucide-react';
import { SERVICE_CATALOG, MOCK_ADDRESSES, TIME_SLOTS, MOCK_TERMS } from '@/lib/customerData';

const STEP_LABELS = ['Service', 'Address', 'Schedule', 'Details', 'Review'];

export default function BookServicePage() {
  const params = useSearchParams();
  const router = useRouter();

  // "Book Again" support — pre-fills service (and skips to address) or, if the
  // address is unchanged too, skips straight to Schedule. Matches the
  // blueprint's fix: Book Again has to actually save time, not just relabel
  // the same empty form.
  const prefillServiceName = params.get('service');
  const prefillAddressId = params.get('address');
  const prefillService = SERVICE_CATALOG.find((s) => s.name === prefillServiceName) || null;
  const prefillAddress = MOCK_ADDRESSES.find((a) => a.id === prefillAddressId) || null;

  const initialStep = prefillService ? (prefillAddress ? 3 : 2) : 1;

  const [step, setStep] = useState(initialStep);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);

  const [form, setForm] = useState({
    category: prefillService?.category || '',
    service: prefillService || null,
    acceptedTerms: prefillService ? null : null,
    addressId: prefillAddress?.id || (MOCK_ADDRESSES.length ? MOCK_ADDRESSES[0].id : ''),
    useNewAddress: MOCK_ADDRESSES.length === 0,
    newAddress: { name: '', phone: '', altPhone: '', line: '', city: 'Bhilai', landmark: '' },
    saveNewAddress: true,
    date: '',
    slot: '',
    emergency: false,
    description: '',
    instructions: '',
    agree: false,
  });

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function acceptTermsFor(service) {
    const terms = MOCK_TERMS[service?.category];
    if (!terms) return;
    update({
      category: service.category,
      service,
      acceptedTerms: {
        categoryId: service.category,
        version: terms.version,
        acceptedAt: new Date().toISOString(),
      },
    });
    setTermsOpen(false);
  }

  function selectService(service) {
    const terms = MOCK_TERMS[service.category];
    const hasAcceptedForCurrent = form.acceptedTerms
      && form.acceptedTerms.categoryId === service.category
      && form.acceptedTerms.version === terms?.version;

    update({
      category: service.category,
      service,
      acceptedTerms: hasAcceptedForCurrent ? form.acceptedTerms : null,
    });

    if (!hasAcceptedForCurrent) setTermsOpen(true);
  }

  function declineTerms() {
    update({
      category: '',
      service: null,
      acceptedTerms: null,
    });
    setTermsOpen(false);
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, 5));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }
  function jumpTo(s) {
    setStep(s);
  }

  const selectedAddress = form.useNewAddress ? null : MOCK_ADDRESSES.find((a) => a.id === form.addressId);
  const addressSummary = form.useNewAddress
    ? [form.newAddress.line, form.newAddress.city].filter(Boolean).join(', ')
    : selectedAddress?.line || '';
  const selectedTerms = form.service ? MOCK_TERMS[form.service.category] : null;
  const termsAccepted = !!form.acceptedTerms
    && form.acceptedTerms.categoryId === form.service?.category
    && form.acceptedTerms.version === selectedTerms?.version;

  // Same-day emergency toggle only shows if today's date is selected and a
  // slot is still open — per the clarification that emergency doesn't add a
  // fifth slot, it just flags urgency to the office within the four that exist.
  const isToday = form.date === new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!prefillService) return;
    selectService(prefillService);
    setStep(prefillAddress ? 3 : 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit() {
    const ref = `ENQ-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    setRefNumber(ref);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
          <PartyPopper className="w-7 h-7 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">Request Submitted!</h1>
        <p className="text-sm text-[#0F172A]/60 mb-1">Reference: <span className="font-bold text-[#0F172A]">{refNumber}</span></p>
        <p className="text-sm text-[#0F172A]/60 mb-8">Our team will call you within 2 hours to confirm.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/customer/dashboard" className="px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors">
            Track Request
          </Link>
          <Link href="/customer/dashboard" className="px-5 py-2.5 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Step indicator — dots on desktop, "Step X of 5" text on mobile per the blueprint */}
      <div>
        <p className="md:hidden text-xs font-bold text-[#0F172A]/50 mb-2">Step {step} of 5: {STEP_LABELS[step - 1]}</p>
        <div className="hidden md:flex items-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  i + 1 < step ? 'bg-[#2554F0] text-white' : i + 1 === step ? 'bg-[#2554F0] text-white ring-4 ring-[#2554F0]/20' : 'bg-[#0F172A]/10 text-[#0F172A]/40'
                }`}
              >
                {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`h-0.5 flex-1 ${i + 1 < step ? 'bg-[#2554F0]' : 'bg-[#0F172A]/10'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 — Choose Service */}
      {step === 1 && (
        <div className="space-y-4">
          <h1 className="text-lg font-bold text-[#0F172A]">Choose a service</h1>
          <div className="space-y-2">
            {SERVICE_CATALOG.map((s) => (
              <button
                key={s.name}
                onClick={() => selectService(s)}
                className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                  form.service?.name === s.name ? 'border-[#2554F0] bg-[#F0F4FF]' : 'border-[#0F172A]/10 bg-white hover:border-[#0F172A]/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#0F172A]">{s.name}</span>
                  <span className="text-xs font-bold text-[#2554F0]">From ₹{s.priceFrom}</span>
                </div>
                <p className="text-xs text-[#0F172A]/50">{s.desc} · {s.duration}</p>
              </button>
            ))}
          </div>
          <button
            onClick={goNext}
            disabled={!termsAccepted}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {termsOpen && form.service && selectedTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Close terms overlay" onClick={declineTerms} className="absolute inset-0 bg-slate-900/40" />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#0F172A]/10 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#0F172A]/10 p-5">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">{form.service.category} Terms &amp; Conditions</h2>
                <p className="mt-1 text-xs text-[#0F172A]/50">Version {selectedTerms.version}</p>
              </div>
              <button onClick={declineTerms} className="rounded-lg p-2 text-[#0F172A]/50 hover:bg-slate-50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-5">
              <p className="text-sm leading-6 text-[#0F172A]">{selectedTerms.content}</p>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={declineTerms}
                className="flex-1 rounded-2xl border border-[#0F172A]/15 px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-slate-50"
              >
                Decline
              </button>
              <button
                onClick={() => acceptTermsFor(form.service)}
                className="flex-1 rounded-2xl bg-[#2554F0] px-4 py-3 text-sm font-medium text-white hover:bg-[#1D45D1]"
              >
                I Agree &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Address */}
      {step === 2 && (
        <div className="space-y-4">
          <h1 className="text-lg font-bold text-[#0F172A]">Where should we come?</h1>

          {MOCK_ADDRESSES.length > 0 && (
            <div className="space-y-2">
              {MOCK_ADDRESSES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => update({ addressId: a.id, useNewAddress: false })}
                  className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
                    !form.useNewAddress && form.addressId === a.id ? 'border-[#2554F0] bg-[#F0F4FF]' : 'border-[#0F172A]/10 bg-white hover:border-[#0F172A]/20'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#0F172A]/40 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{a.label}</p>
                    <p className="text-xs text-[#0F172A]/50">{a.line}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => update({ useNewAddress: true })}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-colors ${
                  form.useNewAddress ? 'border-[#2554F0] bg-[#F0F4FF] text-[#2554F0]' : 'border-dashed border-[#0F172A]/20 text-[#0F172A]/60 hover:bg-slate-50'
                }`}
              >
                + Add a new address
              </button>
            </div>
          )}

          {form.useNewAddress && (
            <div className="space-y-3 p-4 bg-white border border-[#0F172A]/10 rounded-2xl">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Full name"
                  value={form.newAddress.name}
                  onChange={(e) => update({ newAddress: { ...form.newAddress, name: e.target.value } })}
                  className="px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
                />
                <input
                  placeholder="Phone number"
                  value={form.newAddress.phone}
                  onChange={(e) => update({ newAddress: { ...form.newAddress, phone: e.target.value.replace(/\D/g, '') } })}
                  className="px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
                />
              </div>
              <input
                placeholder="Alternate phone (optional)"
                value={form.newAddress.altPhone}
                onChange={(e) => update({ newAddress: { ...form.newAddress, altPhone: e.target.value.replace(/\D/g, '') } })}
                className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
              />
              <textarea
                placeholder="Full address"
                rows={2}
                value={form.newAddress.line}
                onChange={(e) => update({ newAddress: { ...form.newAddress, line: e.target.value } })}
                className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.newAddress.city}
                  onChange={(e) => update({ newAddress: { ...form.newAddress, city: e.target.value } })}
                  className="px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 bg-white"
                >
                  <option value="Bhilai">Bhilai</option>
                  <option value="Durg">Durg</option>
                </select>
                <input
                  placeholder="Landmark"
                  value={form.newAddress.landmark}
                  onChange={(e) => update({ newAddress: { ...form.newAddress, landmark: e.target.value } })}
                  className="px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-[#0F172A]/60">
                <input type="checkbox" checked={form.saveNewAddress} onChange={(e) => update({ saveNewAddress: e.target.checked })} className="rounded" />
                Save this address for next time
              </label>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-3 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={goNext}
              disabled={form.useNewAddress ? !form.newAddress.line || !form.newAddress.phone : !form.addressId}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Schedule */}
      {step === 3 && (
        <div className="space-y-4">
          <h1 className="text-lg font-bold text-[#0F172A]">When works for you?</h1>
          <div>
            <label className="block text-xs font-bold text-[#0F172A]/50 uppercase tracking-wider mb-2">Preferred Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/40" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => update({ date: e.target.value, emergency: false })}
                className="w-full pl-9 pr-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F172A]/50 uppercase tracking-wider mb-2">Preferred Time Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => update({ slot })}
                  className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    form.slot === slot ? 'bg-[#2554F0] border-[#2554F0] text-white' : 'border-[#0F172A]/15 text-[#0F172A]/70 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          {isToday && form.slot && (
            <label className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <input type="checkbox" checked={form.emergency} onChange={(e) => update({ emergency: e.target.checked })} className="mt-0.5 rounded" />
              This is an emergency — I need someone sooner (flags your request as urgent to the office; doesn&apos;t book outside the slot above)
            </label>
          )}
          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-3 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={goNext}
              disabled={!form.date || !form.slot}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Additional Info (skippable) */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#0F172A]">Anything we should know?</h1>
            <button onClick={goNext} className="text-xs font-medium text-[#0F172A]/40 hover:text-[#0F172A]/60 underline underline-offset-2">
              Skip — I&apos;ll describe over the phone
            </button>
          </div>
          <textarea
            placeholder="Describe the problem..."
            rows={4}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 resize-none"
          />
          <button className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed border-[#0F172A]/15 rounded-xl text-sm text-[#0F172A]/40 hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" /> Upload images (optional)
          </button>
          <textarea
            placeholder="Any special instructions for our team?"
            rows={2}
            value={form.instructions}
            onChange={(e) => update({ instructions: e.target.value })}
            className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 resize-none"
          />
          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-3 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={goNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1]">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 — Review */}
      {step === 5 && (
        <div className="space-y-4">
          <h1 className="text-lg font-bold text-[#0F172A]">Review your request</h1>
          <div className="bg-white border border-[#0F172A]/10 rounded-2xl divide-y divide-[#0F172A]/5">
            <ReviewRow label="Service" value={form.service?.name} onEdit={() => jumpTo(1)} />
            <ReviewRow label="Address" value={addressSummary} onEdit={() => jumpTo(2)} />
            <ReviewRow label="Schedule" value={form.date && form.slot ? `${form.date}, ${form.slot}${form.emergency ? ' (Urgent)' : ''}` : ''} onEdit={() => jumpTo(3)} />
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-[#0F172A]/50">Estimated</span>
              <span className="text-sm font-bold text-[#0F172A]">
                ₹{form.service?.priceFrom} – ₹{form.service ? form.service.priceFrom + 200 : 0}{' '}
                <span className="text-xs font-normal text-[#0F172A]/40">(final estimate after review)</span>
              </span>
            </div>
          </div>
          <label className="flex items-start gap-2 text-xs text-[#0F172A]/60">
            <input type="checkbox" checked={form.agree} onChange={(e) => update({ agree: e.target.checked })} className="mt-0.5 rounded" />
            I agree to the Terms &amp; Privacy Policy
          </label>
          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-3 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.agree}
              className="flex-1 py-3 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] disabled:opacity-40"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-[#0F172A]/50">{label}</p>
        <p className="text-sm font-medium text-[#0F172A] truncate">{value || '—'}</p>
      </div>
      <button onClick={onEdit} className="flex items-center gap-1 text-xs font-medium text-[#2554F0] shrink-0">
        <Pencil className="w-3 h-3" /> Edit
      </button>
    </div>
  );
}
