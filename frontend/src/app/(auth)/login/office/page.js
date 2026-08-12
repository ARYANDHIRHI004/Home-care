'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function OfficeLoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated, dismissError } = useAuth();

  // If already logged in, bounce straight to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/office/dashboard');
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    dismissError();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const result = await login(email, password);
    console.log(result);

    // loginOfficeUser is a thunk — check if it fulfilled
    if (result.meta?.requestStatus === 'fulfilled') {
      router.push('/office/dashboard');
    }
    // On rejection, the error is already in Redux state → rendered below
  }

  return (
    <div>
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
        {/* Work email */}
        <div>
          <label className="block text-xs font-medium text-[#0F172A]/70 mb-1.5">
            Work email
          </label>
          <input
            id="office-email"
            name="email"
            type="email"
            placeholder="name@homecare.in"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#0F172A]/70">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-[#2554F0] font-medium hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="office-password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-3 text-sm border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/30 transition-shadow"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Error message from Redux state */}
        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          id="office-login-btn"
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
