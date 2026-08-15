'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, FileCheck, Receipt, User, Bell, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
  { label: 'My Services', href: '/customer/services', icon: Wrench },
  { label: 'Estimates', href: '/customer/estimates', icon: FileCheck },
  { label: 'Invoices', href: '/customer/invoices', icon: Receipt },
  { label: 'Profile', href: '/customer/profile', icon: User },
];

// Same four WhatsApp-triggered events called out in the blueprint — mirrored
// here so a customer already in the app sees them without switching to
// WhatsApp. Mock data; swap for a real notifications API.
const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Amit Kumar is on the way for your Deep Home Cleaning', time: '10 min ago', unread: true },
  { id: 2, text: 'Partner assigned for BK-8491 — AC Repair & Service', time: '2 hrs ago', unread: true },
  { id: 3, text: 'Estimate EST-4093 sent — ₹15,000, expires in 2 days', time: 'Yesterday', unread: false },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full text-[#0F172A]/60 hover:bg-[#F0F4FF] hover:text-[#2554F0] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2554F0] rounded-full border-2 border-white" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white border border-[#0F172A]/10 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#0F172A]/10">
            <p className="text-sm font-bold text-[#0F172A]">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`px-4 py-3 border-b border-[#0F172A]/5 last:border-0 ${n.unread ? 'bg-[#F0F4FF]/50' : ''}`}>
                <p className="text-xs text-[#0F172A] leading-relaxed">{n.text}</p>
                <p className="text-[11px] text-[#0F172A]/40 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerNav({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FBFCFF]">
      {/* Desktop top nav */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#0F172A]/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/customer/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2554F0] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              HomeCare
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-[#F0F4FF] text-[#2554F0]' : 'text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-[#F0F4FF] text-[#2554F0] flex items-center justify-center text-xs font-bold">
              P
            </div>
          </div>
        </div>
      </header>

      {/* Mobile top bar — just brand + bell, nav lives in the bottom bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#0F172A]/10">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2554F0] text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              HomeCare
            </span>
          </Link>
          <NotificationBell />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-10">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#0F172A]/10 flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${
                active ? 'text-[#2554F0]' : 'text-[#0F172A]/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label === 'My Services' ? 'Services' : item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
