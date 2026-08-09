'use client';

// Wire this up to whatever OAuth flow you use (NextAuth, Firebase Auth, Clerk, etc).
// Example with NextAuth: onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
export default function GoogleButton({ onClick, label = 'Continue with Google' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 border border-[#0F172A]/15 rounded-lg py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F5F8FF] transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.87 2.69-6.62z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.95v2.33A9 9 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.97 10.71A5.4 5.4 0 0 1 3.69 9c0-.59.1-1.17.28-1.71V4.96H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.04l3.02-2.33z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.96l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"
        />
      </svg>
      {label}
    </button>
  );
}
