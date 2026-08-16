'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  PhoneCall,
  Menu,
  X,
  ArrowRight,
  User,
  Calendar,
  Sparkles,
} from 'lucide-react';
/* ─────────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────────── */
const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

/* ─────────────────────────────────────────────
   NAVBAR COMPONENT
───────────────────────────────────────────── */
export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isSearchOpen, setIsSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [menuOpen, setMenuOpen]             = useState(false);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const openMenu  = useCallback(() => setMenuOpen(true),  []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const runSearch = useCallback((query) => {
    const q = query.trim();
    if (!q) return;
    router.push(`/services?q=${encodeURIComponent(q)}`);
  }, [router]);

  /* ── JSX ── */
  return (
    <>
      {/* =============================================
          TOP NAVBAR BAR
      ============================================= */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-40 h-[72px]
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
            : 'bg-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/logo.png"
              alt="HomeCare Logo"
              className="w-14 h-14 rounded-lg shadow shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                HomeCare<span className="text-blue-600">.</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-amber-500 uppercase mt-0.5">
                Complete Home Solution
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* DESKTOP RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Expandable search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 210, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') runSearch(searchQuery); }}
                    placeholder="Search services…"
                    autoFocus
                    className="pl-3 pr-2 py-2 text-xs text-slate-800 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => { setIsSearchOpen((v) => !v); setSearchQuery(''); }}
                className="p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle search"
              >
                {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            <a
              href="tel:+919111466642"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 text-xs font-semibold transition-all duration-200"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              Call Us
            </a>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors px-2 py-2"
            >
              <User className="w-4 h-4" />
              Login
            </Link>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/customer/book')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition-all duration-200"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Service
            </motion.button>
          </div>

          {/* MOBILE HAMBURGER — only visible below lg */}
          <button
            type="button"
            onClick={openMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 transition-colors touch-manipulation"
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

        </div>
      </header>

      {/* =============================================
          MOBILE DRAWER  (state-controlled, no Tailwind
          breakpoint classes that could hide it)
      ============================================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            className="bg-black/40 backdrop-blur-sm"
          />
        )}

        {menuOpen && (
          <motion.div
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9999, width: '100%', maxWidth: '320px' }}
            className="bg-white shadow-2xl flex flex-col overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  HomeCare<span className="text-blue-600">.</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="px-5 pt-5 pb-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { closeMenu(); runSearch(mobileSearchQuery); } }}
                  placeholder="Search home services…"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col px-3 py-3 gap-0.5 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition-colors group"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="px-5 py-4 border-t border-slate-100 space-y-2.5 shrink-0">
              <a
                href="tel:+919111466642"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-blue-600" />
                Call Support: +91 91114 66642
              </a>
              <Link
                href="/login"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 active:bg-slate-300 transition-colors"
              >
                <User className="w-4 h-4" />
                Account Login
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  router.push('/customer/book');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book Service Now
              </button>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 shrink-0">
              <div className="flex items-center justify-center mb-3">
                <a
                  href="https://wa.me/919111466642"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
              <p className="text-[10px] text-center text-slate-400">
                © {new Date().getFullYear()} HomeCare Platform.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =============================================
          MOBILE STICKY BOTTOM CTA BAR
      ============================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-lg">
        <div className="flex items-center gap-2.5">
          <a
            href="tel:+18005550199"
            aria-label="Call us"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors shrink-0"
          >
            <PhoneCall className="w-5 h-5 text-blue-600" />
          </a>
          <button
            type="button"
            onClick={() => router.push('/customer/book')}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs uppercase tracking-wide py-3.5 rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book Service Now
          </button>
        </div>
      </div>
    </>
  );
}