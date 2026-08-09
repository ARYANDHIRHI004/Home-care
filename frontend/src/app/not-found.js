'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  Phone,
  MessageSquare,
  Home,
  Wrench,
  Info,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  Bug,
  ChevronRight
} from 'lucide-react';

const QUICK_NAV = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Services', href: '/#services', icon: Wrench },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/#contact', icon: Mail },
];

const POPULAR_SERVICES = [
  { name: 'Deep Cleaning', icon: Sparkles, href: '/#services' },
  { name: 'Plumbing', icon: Droplets, href: '/#services' },
  { name: 'Electrical', icon: Zap, href: '/#services' },
  { name: 'Painting', icon: Paintbrush, href: '/#services' },
  { name: 'AC Repair', icon: Wind, href: '/#services' },
  { name: 'Pest Control', icon: Bug, href: '/#services' },
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased flex flex-col justify-between relative overflow-hidden selection:bg-[#2563EB] selection:text-white">
      
      {/* Background Soft Blue Glowing Elements */}
      <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- TOP BRAND HEADER --- */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-20 relative">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            HC
          </div>
          <div className="flex flex-col">
            <span className="font-['Poppins',sans-serif] font-bold text-lg leading-none text-[#111827] tracking-tight">
              HomeCare<span className="text-[#2563EB]">.</span>
            </span>
            <span className="text-[9px] font-semibold text-[#F97316] uppercase tracking-widest mt-0.5">
              Service Rescue
            </span>
          </div>
        </Link>

        <Link
          href="/#services"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200/60 transition-colors"
        >
          <span>Explore All Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* --- HERO RESCUE SECTION --- */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center py-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Content & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Page Rescue Active</span>
              </span>

              <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Oops! We Couldn't <br className="hidden sm:block" />
                <span className="text-[#2563EB]">Find This Page</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
                The page you're looking for may have been moved, but our team is always ready to help you find the right service.
              </p>
            </motion.div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-md mx-auto lg:mx-0"
            >
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-200/80 p-1.5 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all">
                <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search service e.g., 'AC Jet Clean'..."
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-[#111827] placeholder:text-gray-400 px-3 py-2"
                />
                <Link
                  href="/#services"
                  className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Find</span>
                </Link>
              </div>
            </motion.div>

            {/* Action Buttons & Quick Nav */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 pt-2"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/#book"
                  className="bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+919111466642"
                  className="bg-white hover:bg-gray-50 text-[#111827] font-semibold text-xs border border-gray-200 px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span>Call Office</span>
                </a>
              </div>

              {/* Quick Nav Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-md mx-auto lg:mx-0 pt-2">
                {QUICK_NAV.map((nav) => (
                  <Link
                    key={nav.name}
                    href={nav.href}
                    className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-blue-50/60 rounded-xl border border-gray-200/80 hover:border-blue-200 text-xs font-bold text-gray-700 hover:text-[#2563EB] transition-all shadow-xs"
                  >
                    <nav.icon className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{nav.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Huge Semi-Transparent 404 + Rescue Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[280px] sm:min-h-[360px]">
            {/* Huge Semi-Transparent 404 Watermark */}
            <span className="absolute text-[160px] sm:text-[220px] lg:text-[260px] font-extrabold font-['Poppins',sans-serif] text-blue-900/[0.04] select-none pointer-events-none leading-none tracking-tighter">
              404
            </span>

            {/* Premium Illustration Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-2xl max-w-sm w-full text-center space-y-4"
            >
              <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-50 to-orange-50 border border-blue-100 flex items-center justify-center">
                <img
                  src="https://ik.imagekit.io/bs0ovnamh/heroImage?updatedAt=1786291978934"
                  alt="HomeCare Service Professional"
                  fill
                  priority
                  className="object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                {/* Floating Status Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-white/40 shadow-lg flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-900 leading-none">HomeCare Dispatch</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">Technician Ready to Assist</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* --- POPULAR SERVICES SECTION --- */}
        <section className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Popular Home Services</span>
            <Link href="/#services" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {POPULAR_SERVICES.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-gray-200/80 hover:border-blue-200 transition-all flex items-center gap-2.5 shadow-xs"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0">
                  <service.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#2563EB] truncate">
                  {service.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* --- PREMIUM SUPPORT CARD --- */}
        <section className="mt-8">
          <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-blue-900/50">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/20">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Poppins',sans-serif] font-bold text-sm">Need Immediate Assistance?</h3>
                <p className="text-xs text-gray-300 font-light">Connect with our Bhilai-Durg office support team right away.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href="tel:++919111466640"
                className="flex-1 sm:flex-initial bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>

              <a
                href="https://wa.me/+919111466642"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER COPYRIGHT --- */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-400 border-t border-gray-100 z-10 relative">
        <p>© 2026 HomeCare Platform • Centralized Home Care Management</p>
      </footer>
    </div>
  );
}