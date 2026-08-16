'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Loader2, Eye, EyeOff, Map as MapIcon } from 'lucide-react';
import GoogleButton from '@/components/auth/GoogleButton';
import { authClient } from '@/lib/auth';
import { useUpdateProfileMutation } from '@/store/api/customerAuthApi';
import { useAddMyAddressMutation } from '@/store/api/customerApi';
import LocationPicker from '@/components/common/LocationPicker';
import { reverseGeocode } from '@/lib/geocode';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillPhone = searchParams.get('phone') || '';
  const [updateProfile] = useUpdateProfileMutation();
  const [addMyAddress] = useAddMyAddressMutation();
  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: prefillPhone,
    email: '',
    password: '',
    confirmPassword: '',
    addressLine: '',
    landmark: '',
    city: 'Bhilai',
    pincode: '',
    lat: null,
    lng: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  // locationStatus drives what the little status line next to the button shows:
  // 'idle' | 'locating' | 'resolving' | 'done' | 'coords-only' | 'error'
  const [locationStatus, setLocationStatus] = useState('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
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
    // window.location.origin, not a hardcoded localhost URL — the login
    // page's Google flow already does this correctly (see lib/sign-in.js);
    // this was the one signup path still hardcoded to localhost, which
    // would have sent users to the wrong host in any real deployment.
    authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/customer/dashboard`,
    });
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.addressLine.trim() || !/^\d{6}$/.test(form.pincode)) {
      setError('Enter your address and a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        name: form.name.trim(),
        phoneNumber: `+91${form.phone}`,
      });
      if (signUpError) {
        throw new Error(
          signUpError.status === 422 || signUpError.code === 'USER_ALREADY_EXISTS'
            ? 'An account with this mobile number already exists — try logging in instead.'
            : signUpError.message || 'Could not create your account. Please try again.'
        );
      }

      // Best-effort — the account exists and is signed in either way. If this
      // fails, the onboarding modal on Dashboard will ask for the address again.
      updateProfile({
        address: {
          line: form.addressLine.trim(),
          city: form.city,
          landmark: form.landmark.trim(),
          lat: form.lat,
          lng: form.lng,
        },
      }).catch(() => {});

      // Also written to the canonical Customer.addresses[] (the store
      // checkout's saved-address picker reads from) — the Better Auth
      // `user.address` field above is a separate, older store used only for
      // the onboarding-completion check, and checkout was never wired to it.
      addMyAddress({
        label: 'Home',
        addressText: [form.addressLine.trim(), form.landmark.trim(), form.city].filter(Boolean).join(', '),
        lat: form.lat,
        lng: form.lng,
      }).catch(() => {});

      router.push('/customer/dashboard');
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
              className="flex-1 px-3 py-3 text-sm outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="priya@example.com"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3 py-3 pr-10 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F172A]/40 hover:text-[#0F172A]/70"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            placeholder="Re-enter password"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
          />
        </div>

        {/* Address section */}
        <div className="pt-2 border-t border-[#0F172A]/10">
          <div className="flex items-center justify-between mt-4 mb-3">
            <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide">
              Service address
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMapPickerOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#2554F0] hover:underline"
              >
                <MapIcon className="w-3.5 h-3.5" />
                Choose on map
              </button>
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
          </div>

          <LocationPicker
            isOpen={mapPickerOpen}
            onClose={() => setMapPickerOpen(false)}
            initialLat={form.lat}
            initialLng={form.lng}
            onConfirm={(loc) => {
              setForm((f) => ({
                ...f,
                addressLine: loc.addressLine || f.addressLine,
                city: loc.city || f.city,
                pincode: loc.pincode || f.pincode,
                lat: loc.lat,
                lng: loc.lng,
              }));
              setLocationStatus('done');
              setMapPickerOpen(false);
            }}
          />

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
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#2554F0] font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}