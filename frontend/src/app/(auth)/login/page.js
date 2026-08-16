'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import GoogleButton from '@/components/auth/GoogleButton';
import { loginWithGoogle } from '@/lib/sign-in';
import { authClient } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setError('Enter your password');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.phoneNumber({
        phoneNumber: `+91${phone}`,
        password,
      });
      if (signInError) throw new Error(signInError.message || 'Incorrect phone number or password.');
      const from = searchParams.get('from');
      // Only honor same-app customer paths — never redirect off this app based
      // on a query param (open-redirect guard), and never send them into /office.
      router.push(from && from.startsWith('/customer') ? from : '/customer/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const from = searchParams.get('from');
    const redirectUrl = from && from.startsWith('/customer') ? from : '/customer/dashboard';
    loginWithGoogle(window.location.origin + redirectUrl);
  }

  return (
    <div>
      {/* Customer / Office toggle */}
      

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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#0F172A]/70">Password</label>
            {/* Not /forgot-password — that flow is email-based for office
                accounts, and customers authenticate by phone number with no
                OTP-reset path built (deliberately, per the phoneNumber
                plugin config). Real support contact instead of a dead-fit
                link into the wrong reset flow. */}
            <a
              href={`https://wa.me/919111466642?text=${encodeURIComponent("Hi, I've forgotten my HomeCare account password.")}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#2554F0] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2554F0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        New here?{' '}
        <Link href="/login/register" className="text-[#2554F0] font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
