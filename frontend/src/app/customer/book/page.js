'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, ChevronLeft, MapPin, Calendar, Check, Pencil, PartyPopper, X, Map as MapIcon,
} from 'lucide-react';
import { useCreateEnquiryMutation } from '@/store/api/enquiryApi';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { useGetTermsQuery } from '@/store/api/termsApi';
import { useGetServiceAreasQuery, useCheckServiceAreaMutation } from '@/store/api/serviceAreaApi';
import { useGetMyAddressesQuery, useAddMyAddressMutation } from '@/store/api/customerApi';
import ImageUploader from '@/components/common/ImageUploader';
import TermsModal from '@/components/common/TermsModal';
import LocationPicker from '@/components/common/LocationPicker';

const SECTOR_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

const STEP_LABELS = ['Service', 'Address', 'Schedule', 'Details', 'Review'];
const TIME_SLOTS = ['9 - 11', '11 - 1', '2 - 4', '4 - 6'];

export default function BookServicePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: rawServices = [], isLoading: servicesLoading, isError: servicesError } = useGetServicesQuery('active=true');
  const { data: rawTerms = [] } = useGetTermsQuery('active=true');
  const { data: rawServiceAreas = [] } = useGetServiceAreasQuery('active=true');
  const [createEnquiry, { isLoading: isSubmitting }] = useCreateEnquiryMutation();
  const [checkServiceArea, { isLoading: isCheckingArea }] = useCheckServiceAreaMutation();
  const [addMyAddress] = useAddMyAddressMutation();
  const [areaError, setAreaError] = useState('');
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const { data: rawAddresses = [], isLoading: addressesLoading } = useGetMyAddressesQuery();
  const addresses = rawAddresses.map((a) => ({
    id: a._id,
    label: a.label || 'Address',
    line: a.addressText,
    lat: a.lat,
    lng: a.lng,
  }));
  // "Sector Areas" is a pattern-match category (any "Sector N"), not one
  // literal locality — offered as its own dropdown option plus a sector
  // number picker, still a constrained selection rather than free text.
  const sectorArea = rawServiceAreas.find((a) => a.matchType === 'sector');
  const namedAreas = rawServiceAreas.filter((a) => a.matchType !== 'sector');
  const serviceCatalog = rawServices.map((service) => ({
    id: service._id,
    categoryId: service.categoryId?._id || service.categoryId,
    category: service.categoryId?.name || 'General',
    name: service.name,
    desc: service.description || 'Professional home care service',
    priceFrom: service.basePrice || 0,
    duration: service.duration || '1-2 hrs',
    image: service.images?.[0] || null,
    _raw: service,
  }));
  
  const servicesByCategory = serviceCatalog.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const termsByCategory = rawTerms.reduce((acc, term) => {
    const categoryId = term.categoryId?._id || term.categoryId;
    acc[categoryId] = term;
    return acc;
  }, {});

  // "Book Again" support — pre-fills service (and skips to address) or, if the
  // address is unchanged too, skips straight to Schedule. Matches the
  // blueprint's fix: Book Again has to actually save time, not just relabel
  // the same empty form.
  const prefillServiceName = params.get('service');
  const prefillAddressId = params.get('address');
  const prefillService = serviceCatalog.find((s) => s.name === prefillServiceName) || null;
  const prefillAddress = addresses.find((a) => a.id === prefillAddressId) || null;

  const initialStep = prefillService ? (prefillAddress ? 3 : 2) : 1;

  const [step, setStep] = useState(initialStep);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);

  const [form, setForm] = useState({
    category: prefillService?.category || '',
    service: prefillService || null,
    acceptedTerms: prefillService ? null : null,
    addressId: prefillAddress?.id || '',
    useNewAddress: false,
    newAddress: { name: '', phone: '', altPhone: '', line: '', city: 'Bhilai', landmark: '', locality: '', sectorNumber: '', lat: null, lng: null },
    saveNewAddress: true,
    date: '',
    slot: '',
    emergency: false,
    description: '',
    images: [],
    instructions: '',
    agree: false,
  });

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function acceptTermsFor(service) {
    const terms = termsByCategory[service?.categoryId];
    if (!terms) return;
    update({
      category: service.category,
      service,
      acceptedTerms: {
        categoryId: service.categoryId,
        version: terms.version,
        acceptedAt: new Date().toISOString(),
      },
    });
    setTermsOpen(false);
  }

  function selectService(service) {
    const terms = termsByCategory[service.categoryId];
    const hasAcceptedForCurrent = form.acceptedTerms
      && form.acceptedTerms.categoryId === service.categoryId
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

  async function goNext() {
    if (step === 2 && form.useNewAddress) {
      setAreaError('');
      try {
        const result = await checkServiceArea({ locality: computedLocality }).unwrap();
        if (!result.serviceable) {
          router.push(`/customer/unavailable?locality=${encodeURIComponent(computedLocality)}`);
          return;
        }
      } catch {
        // Fail-open here — the backend re-checks the same thing at final
        // submit and is the real gate; this is just faster UX feedback.
        setAreaError('Could not verify your area right now — you can still continue, we\'ll confirm at submission.');
      }
    }
    setStep((s) => Math.min(s + 1, 5));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }
  function jumpTo(s) {
    setStep(s);
  }

  const selectedAddress = form.useNewAddress ? null : addresses.find((a) => a.id === form.addressId);
  const addressSummary = form.useNewAddress
    ? [form.newAddress.line, form.newAddress.city].filter(Boolean).join(', ')
    : selectedAddress?.line || '';
  const computedLocality = form.newAddress.locality === sectorArea?.name
    ? (form.newAddress.sectorNumber ? `Sector ${form.newAddress.sectorNumber}` : '')
    : form.newAddress.locality;
  const selectedTerms = form.service ? termsByCategory[form.service.categoryId] : null;
  const termsAccepted = !!form.acceptedTerms
    && form.acceptedTerms.categoryId === form.service?.categoryId
    && form.acceptedTerms.version === selectedTerms?.version;

  // Same-day emergency toggle only shows if today's date is selected and a
  // slot is still open — per the clarification that emergency doesn't add a
  // fifth slot, it just flags urgency to the office within the four that exist.
  const isToday = form.date === new Date().toISOString().slice(0, 10);

  // rawServices loads asynchronously (RTK Query), so on a fresh navigation —
  // exactly what happens right after a login redirect — prefillService is
  // still null on the very first render. An empty dependency array here
  // would fire once against that null value and then never run again once
  // services actually arrive, silently dropping both the service pre-select
  // and the preAcceptedTerms sessionStorage read. Guard with a ref instead
  // of an empty array so this can re-fire once the data is actually in.
  // Same async-arrival problem as prefillService below — addresses load after
  // the initial render, so the default (saved cards vs. blank new-address
  // form) has to be decided once real data actually arrives, not baked into
  // useState's initial value.
  const appliedAddressDefaultRef = useRef(false);
  useEffect(() => {
    if (addressesLoading || appliedAddressDefaultRef.current || prefillAddress || form.addressId) return;
    appliedAddressDefaultRef.current = true;
    if (addresses.length > 0) {
      update({ addressId: addresses[0].id, useNewAddress: false });
    } else {
      update({ useNewAddress: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressesLoading, addresses.length]);

  const appliedPrefillRef = useRef(false);
  useEffect(() => {
    if (!prefillService || appliedPrefillRef.current) return;
    appliedPrefillRef.current = true;

    // Check if user already accepted terms on the landing page for this category
    const storedTermsJson = sessionStorage.getItem('preAcceptedTerms');
    let preAcceptedTerms = null;
    if (storedTermsJson) {
      try {
        const parsed = JSON.parse(storedTermsJson);
        if (parsed.categoryId === prefillService.categoryId) {
          preAcceptedTerms = parsed;
        }
      } catch (e) {
        console.error('Failed to parse preAcceptedTerms', e);
      }
      sessionStorage.removeItem('preAcceptedTerms');
    }

    if (preAcceptedTerms) {
      update({
        category: prefillService.category,
        service: prefillService,
        acceptedTerms: preAcceptedTerms,
      });
    } else {
      selectService(prefillService);
    }
    setStep(prefillAddress ? 3 : 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillService, prefillAddress]);

  async function handleSubmit() {
    const payload = {
      serviceId: form.service?.id,
      serviceName: form.service?.name,
      categoryId: form.service?.categoryId,
      serviceCategory: form.category || form.service?.category,
      preferredDate: form.date,
      preferredSlot: form.slot,
      address: addressSummary,
      locality: computedLocality,
      description: form.description,
      images: form.images,
      instructions: form.instructions,
      emergency: form.emergency,
      acceptedTerms: form.acceptedTerms,
      source: 'customer_portal',
    };
    try {
      const enquiry = await createEnquiry(payload).unwrap();

      // Best-effort — the enquiry already went through either way. Only for
      // a genuinely new address the customer typed in, not a saved one they
      // picked, and only if they actually checked the save box.
      if (form.useNewAddress && form.saveNewAddress) {
        addMyAddress({
          label: addresses.length === 0 ? 'Home' : 'Other',
          addressText: addressSummary,
          lat: form.newAddress.lat,
          lng: form.newAddress.lng,
        }).catch(() => {});
      }

      setRefNumber(enquiry.enquiryNumber || enquiry._id || 'Submitted');
      setSubmitted(true);
    } catch (err) {
      // Backstop for the Step 2 check — same rejection the server would send
      // if e.g. an area was deactivated between the check and this submit.
      if (err?.status === 422 && err?.data?.serviceable === false) {
        router.push(`/customer/unavailable?locality=${encodeURIComponent(computedLocality)}`);
        return;
      }
      throw err;
    }
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

  if (servicesLoading) return <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading services...</div>;
  if (servicesError) return <div className="py-12 text-center text-sm text-rose-600">Unable to load services.</div>;

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
        <div className="space-y-6">
          <h1 className="text-lg font-bold text-[#0F172A]">Choose a service</h1>
          
          <div className="space-y-6">
            {Object.entries(servicesByCategory).map(([cat, services]) => (
              <div key={cat} className="space-y-3">
                <h2 className="text-sm font-bold text-[#0F172A]/60 uppercase tracking-wider">{cat}</h2>
                <div className="space-y-2">
                  {services.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => selectService(s)}
                      className={`w-full text-left p-3 rounded-2xl border transition-colors flex items-center gap-4 ${
                        form.service?.name === s.name ? 'border-[#2554F0] bg-[#F0F4FF]' : 'border-[#0F172A]/10 bg-white hover:border-[#0F172A]/20'
                      }`}
                    >
                      {s.image ? (
                        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">No<br/>Image</span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                          <span className="text-sm font-bold text-[#0F172A] truncate">{s.name}</span>
                          <span className="text-xs font-bold text-[#2554F0] shrink-0">From ₹{s.priceFrom}</span>
                        </div>
                        <p className="text-xs text-[#0F172A]/50 line-clamp-2">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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

      <TermsModal
        isOpen={termsOpen && form.service && selectedTerms}
        categoryName={form.service?.category}
        terms={selectedTerms}
        onAccept={() => acceptTermsFor(form.service)}
        onDecline={declineTerms}
      />

      {/* STEP 2 — Address */}
      {step === 2 && (
        <div className="space-y-4">
          <h1 className="text-lg font-bold text-[#0F172A]">Where should we come?</h1>

          {addresses.length > 0 && (
            <div className="space-y-2">
              {addresses.map((a) => (
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#0F172A]/70">Full address</span>
                <button
                  type="button"
                  onClick={() => setMapPickerOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#2554F0] hover:underline"
                >
                  <MapIcon className="w-3.5 h-3.5" /> Choose on map
                </button>
              </div>
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

              {/* Area/Locality — a constrained selection from the real
                  serviceable list, not free text. Free text is exactly how
                  "Smruti Nagar" vs "Smriti Nagar" typo-mismatches happen. */}
              <div className={form.newAddress.locality === sectorArea?.name ? 'grid grid-cols-2 gap-3' : ''}>
                <div>
                  <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Area / Locality</label>
                  <select
                    value={form.newAddress.locality}
                    onChange={(e) => update({ newAddress: { ...form.newAddress, locality: e.target.value, sectorNumber: '' } })}
                    className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 bg-white"
                  >
                    <option value="">Select your area</option>
                    {namedAreas.map((a) => (
                      <option key={a._id} value={a.name}>{a.name}</option>
                    ))}
                    {sectorArea && <option value={sectorArea.name}>{sectorArea.name}</option>}
                  </select>
                </div>
                {form.newAddress.locality === sectorArea?.name && (
                  <div>
                    <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Sector number</label>
                    <select
                      value={form.newAddress.sectorNumber}
                      onChange={(e) => update({ newAddress: { ...form.newAddress, sectorNumber: e.target.value } })}
                      className="w-full px-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 bg-white"
                    >
                      <option value="">Select sector</option>
                      {SECTOR_NUMBERS.map((n) => (
                        <option key={n} value={n}>Sector {n}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-xs text-[#0F172A]/60">
                <input type="checkbox" checked={form.saveNewAddress} onChange={(e) => update({ saveNewAddress: e.target.checked })} className="rounded" />
                Save this address for next time
              </label>
            </div>
          )}

          <LocationPicker
            isOpen={mapPickerOpen}
            onClose={() => setMapPickerOpen(false)}
            initialLat={form.newAddress.lat}
            initialLng={form.newAddress.lng}
            onConfirm={(loc) => {
              update({
                newAddress: {
                  ...form.newAddress,
                  line: loc.addressLine || form.newAddress.line,
                  city: loc.city || form.newAddress.city,
                  lat: loc.lat,
                  lng: loc.lng,
                },
              });
              setMapPickerOpen(false);
            }}
          />

          {areaError && <p className="text-xs text-red-600">{areaError}</p>}

          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-3 bg-white border border-[#0F172A]/15 text-[#0F172A] rounded-xl text-sm font-medium hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={goNext}
              disabled={
                isCheckingArea ||
                (form.useNewAddress
                  ? !form.newAddress.line || !form.newAddress.phone || !computedLocality
                  : !form.addressId)
              }
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] disabled:opacity-40"
            >
              {isCheckingArea ? 'Checking area…' : 'Next'} <ChevronRight className="w-4 h-4" />
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
          <div>
            <label className="block text-xs font-bold text-[#0F172A]/50 uppercase tracking-wider mb-2">Photos (optional)</label>
            <ImageUploader
              value={form.images}
              onChange={(images) => update({ images })}
              folder="enquiries"
              maxFiles={4}
              label="Upload photos of the job"
              helpText="Helps our team size the job before calling — up to 4 photos, 5MB each."
            />
          </div>
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
              disabled={!form.agree || isSubmitting}
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
