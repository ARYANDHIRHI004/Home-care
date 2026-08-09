'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from '@/components/auth/GoogleButton';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error('Could not send OTP. Please try again.');
      router.push(`/login/otp?phone=${phone}`);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    // TODO: wire up to your OAuth provider, e.g. signIn('google', { callbackUrl: '/login/register' })
    window.location.href = '/api/auth/google';
  }

  return (
    <div>
      {/* Customer / Office toggle */}
      <div className="flex mb-6 rounded-lg bg-[#F0F4FF] p-1">
        <span className="flex-1 text-center py-2 rounded-md bg-white text-sm font-medium text-[#0F172A] shadow-sm">
          Customer
        </span>
        <a
          href="/login/office"
          className="flex-1 text-center py-2 rounded-md text-sm font-medium text-[#0F172A]/60 hover:text-[#2554F0] transition-colors"
        >
          Office login
        </a>
      </div>

      <h1
        className="text-2xl font-bold text-[#0F172A] mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Welcome back
      </h1>
      <p className="text-sm text-[#0F172A]/70 mb-6">
        Log in to track requests and manage bookings.
      </p>

      <GoogleButton onClick={handleGoogleLogin} />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#0F172A]/10" />
        <span className="text-xs text-[#0F172A]/40">or use your phone number</span>
        <div className="flex-1 h-px bg-[#0F172A]/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">
            Mobile number
          </label>
          <div className="flex items-center border border-[#0F172A]/15 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2554F0]/30 transition-shadow">
            <span className="px-3 py-3 bg-[#F0F4FF] text-sm text-[#0F172A] border-r border-[#0F172A]/15">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="98765 43210"
              className="flex-1 px-3 py-3 text-sm outline-none"
              required
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2554F0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Sending OTP…' : 'Send OTP'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        New here?{' '}
        <a href="/login/register" className="text-[#2554F0] font-medium hover:underline">
          Create an account
        </a>
      </p>
    </div>
  );
}
