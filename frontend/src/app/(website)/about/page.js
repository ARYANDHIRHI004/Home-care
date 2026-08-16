'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsShieldCheck } from 'react-icons/bs';
import {
  Target,
  Compass,
  HeartHandshake,
  Award,
  Users,
  Clock,
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileText,
  DollarSign,
  TrendingUp,
  Building,
  Quote,
  Zap,
  MapPin,
  Headphones
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONFIGURATIONS
// ==========================================

const CORE_VALUES = [
  {
    title: 'Uncompromised Safety',
    desc: 'Every technician undergoes mandatory Aadhaar verification and police background clearance before stepping into a home.',
    icon: BsShieldCheck,
  },
  {
    title: 'Absolute Transparency',
    desc: 'No hidden visit charges or surprise post-job add-ons. Digital, itemized PDF estimates before every single booking.',
    icon: DollarSign,
  },
  {
    title: 'Operational Excellence',
    desc: 'Standardized SOPs, industrial-grade equipment, and continuous training ensure uniform service delivery across every city.',
    icon: Award,
  },
  {
    title: 'Customer-First Empathy',
    desc: 'We treat every home with the same care and respect as our own, backed by a 7-day hassle-free service guarantee.',
    icon: HeartHandshake,
  },
];

const SERVICE_STANDARDS = [
  {
    step: '01',
    title: 'Standardized Toolkits',
    desc: 'Engineers carry certified, specialized tools & eco-friendly materials.',
  },
  {
    step: '02',
    title: 'SOP Compliance',
    desc: 'Strict 18-point hygiene and safety checklists followed for every job.',
  },
  {
    step: '03',
    title: 'Uniformed Protocol',
    desc: 'Professional dress code with digital ID badges for instant verification.',
  },
  {
    step: '04',
    title: 'Post-Job Audit',
    desc: 'Quality check and site clean-up before customer inspection & sign-off.',
  },
  {
    step: '05',
    title: 'Digital Invoice',
    desc: 'Automated GST-compliant PDF bill sent straight to email and WhatsApp.',
  },
];

const TRUST_CARDS = [
 
  {
    title: 'GST Compliant Invoicing',
    desc: 'Instant, transparent digital bills with full tax breakdowns for every job.',
    icon: FileText,
  },
  {
    title: 'Secure Online Payments',
    desc: '256-bit encrypted transactions through UPI, Cards, NetBanking, or Cash after service.',
    icon: Lock,
  },
  {
    title: '7-Day Service Guarantee',
    desc: 'Not satisfied? We provide a free re-service visit within 7 days, no questions asked.',
    icon: CheckCircle2,
  },
];

const COMPANY_JOURNEY = [
  {
    year: '2023',
    title: 'The Inception',
    desc: 'Identified the gap in unorganized home service reliability across Tier-2 Indian markets. Founded Shivnath Automation / HomeCare.',
  },
  {
    year: '2024',
    title: 'Bhilai-Durg Pilot Launch',
    desc: 'Launched our centralized office dispatch system in Bhilai and Durg, serving 1,000+ homes in the first 90 days.',
  },
  {
    year: '2025',
    title: 'Multi-City Expansion',
    desc: 'Expanded operational footprint across 5 regional hubs, onboarding over 50+ background-checked service partners.',
  },
  {
    year: '2026 & Beyond',
    title: 'Scale & Tech Automation',
    desc: 'Integrating AI-assisted dispatching and mobile worker tracking to deliver sub-15-minute response times to 50,000+ households.',
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-['Inter',sans-serif] selection:bg-[#2563EB] selection:text-white">
      {/* ==========================================
          HEADER / NAVIGATION
      ========================================== */}
      
      <main className="w-full pb-20">
        {/* ==========================================
            1. HERO SECTION
        ========================================== */}
        <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/60 text-[#2563EB] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Our Heritage & Promise
              </span>

              <h1 className="font-['Poppins',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
                Building Trust Through <br className="hidden sm:block" />
                <span className="text-[#2563EB]">Professional Home Services</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
                We are on a mission to transform how regional Indian households experience home care—bringing organization, background verification, and fixed pricing to every doorstep.
              </p>

              {/* Key Quick Stats Pills */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-gray-800">
                  
                  <span>10,000+ Homes Served</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-gray-800">
                
                  <span>100% Background Cleared</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-gray-800">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                  <span>Bhilai - Durg Regional Hubs</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==========================================
            2. OUR STORY SECTION
        ========================================== */}
        <section id="story" className="py-20 bg-white border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image Grid */}
              <div className="lg:col-span-6 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800"
                      alt="HomeCare Leadership Team"
                      className="w-full h-[420px] object-cover"
                    />
                  </div>
                  {/* Overlay Badge */}
                  <div className="absolute -bottom-6 -right-6 bg-[#2563EB] text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs">
                    <p className="font-['Poppins',sans-serif] font-bold text-2xl">100%</p>
                    <p className="text-xs font-medium text-blue-100 mt-0.5">
                      Centralized Office Dispatch & Operations Management
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Narrative */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                  Our Story
                </span>
                <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
                  Born Out of a Need for Reliability
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  In most Tier-2 and Tier-3 Indian cities, finding a trustworthy electrician, plumber, or deep cleaning crew has historically been a game of chance. Unreliable timings, opaque pricing, and unverified personnel created anxiety for families.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  We established **HomeCare** (under the Shivnath Automation ecosystem) to solve this exact problem. By combining a centralized office team that handles customer enquiries with strict worker onboarding protocols, we created an enterprise-grade home care platform designed specifically for regional India.
                </p>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-[#2563EB] pl-4">
                    <p className="font-['Poppins',sans-serif] font-bold text-lg text-[#111827]">15 Mins</p>
                    <p className="text-xs text-gray-500">Average Callback Time</p>
                  </div>
                  <div className="border-l-2 border-[#10B981] pl-4">
                    <p className="font-['Poppins',sans-serif] font-bold text-lg text-[#111827]">Zero</p>
                    <p className="text-xs text-gray-500">Hidden Charges</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey timeline */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPANY_JOURNEY.map((milestone) => (
                <div key={milestone.year} className="border-t-2 border-[#2563EB] pt-4">
                  <p className="font-['Poppins',sans-serif] font-bold text-sm text-[#2563EB] mb-1">{milestone.year}</p>
                  <h4 className="font-['Poppins',sans-serif] font-bold text-base text-[#111827] mb-2">{milestone.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            3. FOUNDER'S MESSAGE
        ========================================== */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[#E5E7EB] shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Portrait Placeholder */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#2563EB]/20 shadow-md">
                    <img
                      src="https://ik.imagekit.io/bs0ovnamh/homecare/homecare/WhatsApp%20Image%202026-08-09%20at%207.38.40%20PM.jpeg"
                      alt=" Founder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Message Content */}
                <div className="lg:col-span-8 space-y-4 text-left">
                  <div className="flex items-center gap-2 text-[#2563EB]">
                    <Quote className="w-8 h-8 opacity-40" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Founder's Message</span>
                  </div>

                  <h3 className="font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#111827]">
                    "Technology means nothing if it doesn't solve real, everyday human anxieties."
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal italic">
                    "When we started Shivnath Automation and HomeCare, our goal was simple: when a family requests a plumber or electrician, they should feel absolute peace of mind. We don't just dispatch workers; we take end-to-end accountability for every job, from estimate approval to post-service GST invoicing."
                  </p>

                  <div className="pt-2">
                    <h4 className="font-['Poppins',sans-serif] font-bold text-base text-[#111827]">Mahendra Kumar Sahu</h4>
                    <p className="text-xs text-[#2563EB] font-semibold">Founder, HomeCare Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            5. VISION & MISSION FEATURE CARDS
        ========================================== */}
        <section className="py-20 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-blue-50/60 to-white p-8 lg:p-10 rounded-3xl border border-blue-100 shadow-sm space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Our Vision</span>
                <h3 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#111827]">
                  Empowering 50+ Regional Cities With Enterprise Care
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  To become the most reliable, respected, and accessible home service brand across Tier-2 and Tier-3 India, setting the gold standard for worker dignity and customer safety.
                </p>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-orange-50/60 to-white p-8 lg:p-10 rounded-3xl border border-orange-100 shadow-sm space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F97316] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Our Mission</span>
                <h3 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#111827]">
                  Transparent, Fast & Accountable Service Lifecycle
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  To organize local service markets by combining technology, centralized office support, rigorous partner verification, and upfront digital estimates for every home.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==========================================
            6. CORE VALUES GRID
        ========================================== */}
        <section className="py-24 bg-[#F8FAFC] border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                Foundational Pillars
              </span>
              <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
                Our Core Values
              </h2>
              <p className="text-base text-gray-600">
                These principles guide every decision made by our office team and field service partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {CORE_VALUES.map((val, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                    <val.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Poppins',sans-serif] font-bold text-base text-[#111827]">
                    {val.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            7. SERVICE STANDARDS (HORIZONTAL TIMELINE)
        ========================================== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                Quality Assurance
              </span>
              <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
                Our On-Site Service Standards
              </h2>
              <p className="text-base text-gray-600">
                Every service partner adheres to strict operational benchmarks before completing a job.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {SERVICE_STANDARDS.map((std, idx) => (
                <div key={idx} className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E5E7EB] text-center space-y-2 relative">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-['Poppins',sans-serif] font-extrabold text-sm flex items-center justify-center mx-auto mb-3">
                    {std.step}
                  </div>
                  <h3 className="font-['Poppins',sans-serif] font-bold text-sm text-[#111827]">{std.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{std.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            8. WHY CUSTOMERS TRUST US
        ========================================== */}
        <section className="py-24 bg-[#F8FAFC] border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#10B981] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
                Unmatched Security
              </span>
              <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
                Why Households Trust HomeCare
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TRUST_CARDS.map((tc, idx) => (
                <div key={idx} className="p-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <tc.icon className="w-8 h-8 text-[#10B981] mb-2" />
                  <h3 className="font-['Poppins',sans-serif] font-bold text-base text-[#111827]">{tc.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">{tc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       

        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-10 lg:p-16 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3.5 py-1 rounded-full border border-white/20">
                Experience Reliable Care
              </span>
              <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-white">
                Ready to Book a Verified Professional Today?
              </h2>
              <p className="text-base text-blue-100 font-light">
                Request an instant callback in under 30 seconds. Review your estimate before confirming.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full lg:w-auto">
              <Link
                href="/#book"
                className="w-full sm:w-auto bg-[#F97316] hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all text-center"
              >
                Book Service Now
              </Link>
              <a
                href="tel:+919111466642"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Us Directly</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}