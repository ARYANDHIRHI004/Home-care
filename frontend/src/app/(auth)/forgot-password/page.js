'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Could not send reset link. Please try again.');
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-[#2554F0]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6L12 13L20 6" stroke="#2554F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#2554F0" strokeWidth="2" />
          </svg>
        </div>
        <h1
          className="text-xl font-bold text-[#0F172A] mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Check your inbox
        </h1>
        <p className="text-sm text-[#0F172A]/70 mb-6">
          If an account exists for <span className="font-medium text-[#0F172A]">{email}</span>, we&apos;ve sent a link
          to reset your password.
        </p>
        <Link href="/login/office" className="text-sm text-[#2554F0] font-medium hover:underline">
          Back to office login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[#0F172A] mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Forgot password
      </h1>
      <p className="text-sm text-[#0F172A]/70 mb-6">
        Enter your work email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Work email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@homecare.in"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2554F0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Sending link…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        <a href="/login/office" className="text-[#2554F0] font-medium hover:underline">
          Back to office login
        </a>
      </p>
    </div>
  );
}
