'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ShieldCheck, Wallet, RefreshCcw, CreditCard, ChevronRight, 
  Info, CheckCircle2, XCircle, AlertCircle, Clock, 
  Phone, Mail, MapPin, Receipt, ArrowDown,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'overview', title: '1. Overview' },
  { id: 'payment-model', title: '2. Current Payment Model' },
  { id: 'eligible-cases', title: '3. Eligible Refund Cases' },
  { id: 'non-refundable', title: '4. Non-Refundable Cases' },
  { id: 'duplicate-payments', title: '5. Duplicate Payments' },
  { id: 'failed-transactions', title: '6. Failed Transactions' },
  { id: 'refund-timeline', title: '7. Refund Timeline' },
  { id: 'payment-methods', title: '8. Payment Methods' },
  { id: 'contact', title: '9. Contact Support' }
];

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Intersection Observer for highlighting sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileNavOpen(false);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-['Inter',sans-serif] selection:bg-[#2563EB] selection:text-white">
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#2563EB] z-50 origin-left"
        style={{ scaleX }}
      />
      
      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="relative pt-32 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold tracking-widest uppercase border border-blue-100">
                LEGAL
              </span>
              
              <h1 className="font-['Poppins',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Refund Policy
              </h1>
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg">
                Our goal is to provide fair, transparent and customer-friendly refund practices while maintaining high-quality professional home services.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Clock className="w-4 h-4" />
                <span>Last Updated: {currentDate}</span>
              </div>
            </div>

            {/* Premium Illustration */}
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-[400px] h-[400px]">
                {/* Center Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-orange-50 rounded-full blur-2xl opacity-60" />
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [-5, 5, -5] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 left-10 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB]">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Wallet</span>
                </motion.div>

                <motion.div 
                  animate={{ y: [5, -5, 5] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 right-10 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316]">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Digital Payment</span>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [-3, 3, -3] }} 
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 left-4 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center gap-2 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Trust Shield</span>
                </motion.div>

                {/* Main Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgb(37,99,235,0.1)] border border-blue-50 z-10">
                  <RefreshCcw className="w-20 h-20 text-[#2563EB]" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-1/4 shrink-0">
              {/* Mobile Accordion Nav */}
              <div className="lg:hidden mb-8">
                <button 
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm font-bold text-gray-900"
                >
                  <span>Quick Navigation</span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${isMobileNavOpen ? 'rotate-90' : ''}`} />
                </button>
                {isMobileNavOpen && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <ul className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                      {SECTIONS.map((section) => (
                        <li key={section.id}>
                          <button
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              activeSection === section.id ? 'bg-blue-50 text-[#2563EB]' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {section.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Desktop Sticky Nav */}
              <div className="hidden lg:block sticky top-32">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs px-2">Table of Contents</h3>
                  <ul className="space-y-1">
                    {SECTIONS.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeSection === section.id 
                              ? 'bg-blue-50 text-[#2563EB] translate-x-1 font-semibold' 
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="w-full lg:w-3/4 max-w-4xl bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 lg:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="space-y-16">
                
                {/* 1. Overview */}
                <section id="overview" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">1</span>
                    Overview
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base">
                    HomeCare believes in transparent business practices. Our refund policy explains when customers may be eligible for refunds and how refund requests are handled.
                  </p>
                </section>

                {/* 2. Current Payment Model */}
                <section id="payment-model" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">2</span>
                    Current Payment Model
                  </h2>
                  
                  <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#2563EB] shrink-0 shadow-sm border border-blue-100/30">
                        <Info className="w-6 h-6" />
                      </div>
                      <div className="space-y-3 pt-1 text-sm sm:text-base text-blue-900 leading-relaxed">
                        <p className="font-bold uppercase tracking-wider text-xs">Important Note</p>
                        <p>Currently, HomeCare primarily operates on an <strong>enquiry-based model</strong>.</p>
                        <p>Customers receive an official estimate before any service begins.</p>
                        <p>In most cases, payment is collected <strong>only after successful completion</strong> of the approved service.</p>
                        <div className="mt-4 bg-white/60 p-4 rounded-xl border border-blue-100/50 backdrop-blur-sm">
                          <p className="font-semibold text-blue-900">
                            Therefore, refunds are generally not applicable unless payment has already been received prior to or independent of service completion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Eligible Refund Cases */}
                <section id="eligible-cases" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">3</span>
                    Eligible Refund Cases
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base mb-6">
                    Possible refund situations include:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      'Duplicate payment',
                      'Incorrect payment amount',
                      'Payment collected but service not delivered',
                      'Payment made due to technical error',
                      'Approved refund by HomeCare support after investigation'
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Non-Refundable Cases */}
                <section id="non-refundable" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">4</span>
                    Non-Refundable Cases
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base mb-6">
                    Refunds may not be available when:
                  </p>

                  <div className="space-y-3">
                    {[
                      'Service has been successfully completed.',
                      'Customer approved additional work during the service.',
                      'Incorrect information was provided by the customer.',
                      'Cancellation is requested after work has already started.',
                      'Damage caused due to pre-existing property conditions.',
                      'Customer was unavailable during the scheduled service time.'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-red-50/30 px-4 py-3 rounded-xl border border-red-50">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Duplicate Payments */}
                <section id="duplicate-payments" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">5</span>
                    Duplicate Payments
                  </h2>
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 text-gray-700 leading-relaxed text-sm sm:text-base">
                    If a customer accidentally makes multiple payments for the same invoice, HomeCare will automatically verify the transaction and process the excess amount back to the original payment method.
                  </div>
                </section>

                {/* 6. Failed Transactions */}
                <section id="failed-transactions" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">6</span>
                    Failed Transactions
                  </h2>
                  <div className="flex items-start gap-4 bg-orange-50/80 p-6 rounded-2xl border border-orange-100">
                    <AlertCircle className="w-6 h-6 text-[#F97316] shrink-0 mt-0.5" />
                    <div className="space-y-3 text-orange-900 text-sm sm:text-base leading-relaxed">
                      <p>If payment is deducted from your account but confirmation is not received on our platform, customers should immediately contact HomeCare support.</p>
                      <p>The transaction will be thoroughly verified with our payment gateway before any refund or manual adjustment is initiated.</p>
                    </div>
                  </div>
                </section>

                {/* 7. Refund Timeline */}
                <section id="refund-timeline" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">7</span>
                    Refund Processing Time
                  </h2>
                  
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-blue-50 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left relative">
                      {/* Connecting Line Desktop */}
                      <div className="hidden sm:block absolute top-6 left-12 right-12 h-0.5 bg-blue-100" />
                      
                      {[
                        'Request Received',
                        'Verification',
                        'Approval',
                        'Refund Initiated',
                        'Amount Credited'
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 group">
                          <div className="w-12 h-12 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-400 font-bold text-sm shadow-sm mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300 group-hover:border-[#2563EB]">
                            {i + 1}
                          </div>
                          <span className="text-xs font-semibold text-gray-700 max-w-[80px] leading-tight group-hover:text-[#2563EB] transition-colors">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-3 bg-blue-50 text-[#2563EB] px-5 py-3 rounded-xl border border-blue-100">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-bold">Estimated processing time: 5–7 Business Days</p>
                      <p className="text-xs font-medium opacity-80">Depending on your bank or payment provider.</p>
                    </div>
                  </div>
                </section>

                {/* 8. Payment Methods */}
                <section id="payment-methods" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">8</span>
                    Refund Method
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                    Refunds will generally be processed through the same payment method originally used by the customer whenever technically possible.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['UPI', 'Bank Transfer', 'Card', 'Online Payment Gateway'].map((method, i) => (
                      <div key={i} className="flex flex-col items-center justify-center gap-2 bg-[#F8FAFC] p-4 rounded-xl border border-gray-100 text-center hover:border-blue-200 transition-colors">
                        <CreditCard className="w-5 h-5 text-[#2563EB]" />
                        <span className="text-xs font-semibold text-gray-700">{method}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 9. Contact */}
                <section id="contact" className="scroll-mt-32">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">9</span>
                    Need Help?
                  </h2>
                  
                  <div className="bg-gradient-to-br from-[#111827] to-[#1e293b] text-white p-6 sm:p-10 rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] rounded-full blur-[80px] opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="relative z-10">
                      <p className="font-bold mb-2 text-xl">Questions regarding refunds?</p>
                      <p className="text-blue-100/80 mb-8 max-w-sm">Our customer support team is happy to help resolve any payment or refund related issues.</p>
                      
                      <div className="grid sm:grid-cols-2 gap-6 mb-10">
                        <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-200 shrink-0">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Phone</p>
                            <p className="font-semibold text-white text-sm">+91 91114 66642</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-200 shrink-0">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Email</p>
                            <p className="font-semibold text-white text-sm">homecarre2405@gmail.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-200 shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Office Address</p>
                            <p className="font-semibold text-white text-sm">Raipur, Chhattisgarh, India</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-200 shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Support Hours</p>
                            <p className="font-semibold text-white text-sm">Mon-Sun, 9 AM - 8 PM</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <a href="tel:+919111466642" className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm flex items-center gap-2 border border-blue-500/50">
                          <Phone className="w-4 h-4" /> Call Support
                        </a>
                        <a href="https://wa.me/919111466642" className="px-6 py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center gap-2 border border-emerald-500/50">
                          <MessageCircle className="w-4 h-4" /> WhatsApp Support
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          BOTTOM TRUST SECTION
      ========================================== */}
      <section className="py-20 bg-gradient-to-br from-[#2563EB] to-blue-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold mb-10">
            Fair. Transparent. <br className="hidden sm:block" /> Customer First.
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              'Transparent Estimates',
              'Professional Support',
              'Secure Payments',
              'Digital Invoices',
              'Customer Satisfaction'
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <span className="font-medium text-sm tracking-wide text-white">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
