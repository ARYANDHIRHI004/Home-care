'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Loader2 } from 'lucide-react';
import GoogleButton from '@/components/auth/GoogleButton';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillPhone = searchParams.get('phone') || '';

  const [form, setForm] = useState({
    name: '',
    phone: prefillPhone,
    email: '',
    addressLine: '',
    landmark: '',
    city: 'Bhilai',
    pincode: '',
    lat: null,
    lng: null,
  });

  // locationStatus drives what the little status line next to the button shows:
  // 'idle' | 'locating' | 'resolving' | 'done' | 'coords-only' | 'error'
  const [locationStatus, setLocationStatus] = useState('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Turns lat/lng into a street address using Nominatim (OpenStreetMap) — free, no API key.
  // Has a hard timeout so a slow/blocked request can't leave the UI stuck on "resolving".
  async function reverseGeocode(lat, lng) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' }, signal: controller.signal }
      );
      if (!res.ok) throw new Error(`Nominatim returned ${res.status}`);
      const data = await res.json();
      const a = data.address || {};

      const addressLine =
        [a.house_number, a.road || a.neighbourhood || a.suburb].filter(Boolean).join(', ') ||
        data.display_name?.split(',')[0] ||
        '';

      const rawCity = a.city || a.town || a.village || a.county || '';
      const city = /bhilai/i.test(rawCity) ? 'Bhilai' : /durg/i.test(rawCity) ? 'Durg' : null;
      const pincode = a.postcode || '';

      return { addressLine, city, pincode };
    } finally {
      clearTimeout(timeout);
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError('Location is not supported on this device — enter your address manually.');
      return;
    }

    setError('');
    setLocationStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Update immediately — this is the "real-time" part. The user sees coordinates
        // captured and the status change to "resolving" the instant GPS returns,
        // instead of staring at nothing while the network request runs in the background.
        setForm((f) => ({ ...f, lat: latitude, lng: longitude }));
        setLocationStatus('resolving');

        reverseGeocode(latitude, longitude)
          .then(({ addressLine, city, pincode }) => {
            setForm((f) => ({
              ...f,
              addressLine: addressLine || f.addressLine,
              city: city || f.city,
              pincode: pincode || f.pincode,
            }));
            setLocationStatus(addressLine ? 'done' : 'coords-only');
          })
          .catch((err) => {
            console.error('Reverse geocoding failed:', err);
            // Coordinates are still saved even though the address text lookup failed —
            // the user can fill the fields manually, and lat/lng still go to the backend.
            setLocationStatus('coords-only');
            setError('Got your location, but couldn\u2019t look up the address automatically — please fill it in below.');
          });
      },
      (err) => {
        console.error('Geolocation failed:', err);
        setLocationStatus('error');
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied — enable it in your browser settings, or enter your address manually.'
            : 'Could not get your location — enter your address manually.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleGoogleSignup() {
    // TODO: wire up to your OAuth provider — this should still land back here to collect address
    window.location.href = '/api/auth/google?next=/login/register';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Enter your full name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (!form.addressLine.trim() || !/^\d{6}$/.test(form.pincode)) {
      setError('Enter your address and a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Could not create your account. Please try again.');

      if (!prefillPhone) {
        router.push(`/login/otp?phone=${form.phone}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const statusText = {
    idle: null,
    locating: 'Getting your location…',
    resolving: 'Found your location — looking up the address…',
    done: '✓ Address filled from your location',
    'coords-only': '✓ Location saved — please check the address fields below',
    error: null,
  }[locationStatus];

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[#0F172A] mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Create your account
      </h1>
      <p className="text-sm text-[#0F172A]/70 mb-6">
        A few details so we can match the right professional to your home.
      </p>

      <GoogleButton onClick={handleGoogleSignup} label="Sign up with Google" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#0F172A]/10" />
        <span className="text-xs text-[#0F172A]/40">or fill in your details</span>
        <div className="flex-1 h-px bg-[#0F172A]/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Priya Sharma"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Mobile number</label>
          <div className="flex items-center border border-[#0F172A]/15 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2554F0]/30 transition-shadow">
            <span className="px-3 py-3 bg-[#F0F4FF] text-sm text-[#0F172A] border-r border-[#0F172A]/15">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="98765 43210"
              className="flex-1 px-3 py-3 text-sm outline-none disabled:bg-[#F0F4FF]/60"
              disabled={!!prefillPhone}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">
            Email <span className="text-[#0F172A]/40">(optional)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@email.com"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
          />
        </div>

        {/* Address section */}
        <div className="pt-2 border-t border-[#0F172A]/10">
          <div className="flex items-center justify-between mt-4 mb-3">
            <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide">
              Service address
            </span>
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locationStatus === 'locating' || locationStatus === 'resolving'}
              className="flex items-center gap-1.5 text-xs font-medium text-[#2554F0] hover:underline disabled:opacity-60"
            >
              {(locationStatus === 'locating' || locationStatus === 'resolving') && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {locationStatus === 'idle' || locationStatus === 'error' ? (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  Use current location
                </>
              ) : locationStatus === 'locating' ? (
                'Getting location…'
              ) : locationStatus === 'resolving' ? (
                'Looking up address…'
              ) : (
                'Update location'
              )}
            </button>
          </div>

          {statusText && (
            <p
              className={`mb-3 text-xs font-medium ${
                locationStatus === 'done' || locationStatus === 'coords-only'
                  ? 'text-emerald-600'
                  : 'text-[#0F172A]/50'
              }`}
            >
              {statusText}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">
                House / flat / street
              </label>
              <input
                type="text"
                value={form.addressLine}
                onChange={(e) => update('addressLine', e.target.value)}
                placeholder="B-204, Shanti Apartments, Nehru Nagar"
                className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow text-[#0F172A]/70"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">
                Landmark <span className="text-[#0F172A]/40">(optional)</span>
              </label>
              <input
                type="text"
                value={form.landmark}
                onChange={(e) => update('landmark', e.target.value)}
                placeholder="Near City Hospital"
                className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">City</label>
                <select
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow text-[#0F172A]"
                >
                  <option value="Bhilai">Bhilai</option>
                  <option value="Durg">Durg</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Pincode</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => update('pincode', e.target.value.replace(/\D/g, ''))}
                  placeholder="490001"
                  className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow  text-[#0F172A]/70"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2554F0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account…' : prefillPhone ? 'Finish setting up' : 'Continue'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-[#2554F0] font-medium hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}