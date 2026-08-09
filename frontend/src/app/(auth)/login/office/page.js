'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OfficeLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/employee-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Incorrect email or password');
      // TODO: store session/token from response, then redirect by role
      router.push('/office/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex mb-6 rounded-lg bg-[#F0F4FF] p-1">
        <a
          href="/login"
          className="flex-1 text-center py-2 rounded-md text-sm font-medium text-[#0F172A]/60 hover:text-[#2554F0] transition-colors"
        >
          Customer
        </a>
        <span className="flex-1 text-center py-2 rounded-md bg-white text-sm font-medium text-[#0F172A] shadow-sm">
          Office login
        </span>
      </div>

      <h1
        className="text-2xl font-bold text-[#0F172A] mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Office sign in
      </h1>
      <p className="text-sm text-[#0F172A]/70 mb-6">
        For ops, support, billing and marketing team members.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">Work email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="name@homecare.in"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#0F172A]/70">Password</label>
            <a href="/forgot-password" className="text-xs text-[#2554F0] font-medium hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow pr-16"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#0F172A]/50 hover:text-[#0F172A]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0F172A] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2554F0] transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-xs text-[#0F172A]/70 mt-6">
        Need office access? Ask your admin to add you from Settings → Employees.
      </p>
    </div>
  );
}
