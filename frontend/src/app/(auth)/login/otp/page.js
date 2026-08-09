'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  function handleChange(index, value) {
    const val = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    if (val && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits(pasted.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH));
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      if (!res.ok) throw new Error('Incorrect code. Please try again.');
      const data = await res.json();
      // TODO: store session/token from `data`, then route accordingly
      router.push(data.isNewCustomer ? '/login/register' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (secondsLeft > 0) return;
    setError('');
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      setSecondsLeft(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } catch {
      setError('Could not resend code. Please try again.');
    }
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[#0F172A] mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Verify your number
      </h1>
      <p className="text-sm text-[#0F172A]/70 mb-6">
        Enter the 6-digit code sent to <span className="font-medium text-[#0F172A]">+91 {phone}</span>
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-12 text-center text-lg font-semibold border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2554F0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Verifying…' : 'Verify & continue'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        Didn&apos;t get a code?{' '}
        {secondsLeft > 0 ? (
          <span className="text-[#0F172A]/40">Resend in {secondsLeft}s</span>
        ) : (
          <button onClick={handleResend} className="text-[#2554F0] font-medium hover:underline">
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}
