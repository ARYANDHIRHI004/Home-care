'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ShieldCheck, FileText, CheckCircle2, ChevronRight, 
  MapPin, Phone, Mail, Clock, Shield, Briefcase, 
  Smartphone, FileCheck, Receipt, UserCheck, Check,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'services', title: '2. Our Services' },
  { id: 'booking', title: '3. Booking Process' },
  { id: 'estimates', title: '4. Estimates & Pricing' },
  { id: 'customer-responsibilities', title: '5. Customer Responsibilities' },
  { id: 'professional-responsibilities', title: '6. Service Professional Responsibilities' },
  { id: 'payments', title: '7. Payments & Invoices' },
  { id: 'cancellation', title: '8. Cancellation & Rescheduling' },
  { id: 'warranty', title: '9. Warranty & Support' },
  { id: 'liability', title: '10. Limitation of Liability' },
  { id: 'intellectual-property', title: '11. Intellectual Property' },
  { id: 'privacy', title: '12. Privacy' },
  { id: 'policy-updates', title: '13. Policy Updates' },
  { id: 'governing-law', title: '14. Governing Law' },
  { id: 'contact', title: '15. Contact Information' }
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('acceptance');
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
                Terms & <br className="hidden sm:block" /> Conditions
              </h1>
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg">
                Please read these Terms & Conditions carefully before using HomeCare services. By accessing our website or requesting any service, you agree to comply with these terms.
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
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Professional Trust</span>
                </motion.div>

                <motion.div 
                  animate={{ y: [5, -5, 5] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 right-10 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Digital Agreement</span>
                </motion.div>

                {/* Main Document Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgb(37,99,235,0.1)] border border-blue-50 z-10">
                  <FileCheck className="w-20 h-20 text-[#2563EB]" strokeWidth={1.5} />
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
                
                {/* 1. Acceptance of Terms */}
                <section id="acceptance" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">1</span>
                    Acceptance of Terms
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base">
                    By using HomeCare, you acknowledge that you have read, understood and agreed to these Terms & Conditions. If you do not agree with any part of these terms, you must not use our services.
                  </p>
                </section>

                {/* 2. Our Services */}
                <section id="services" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">2</span>
                    Our Services
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base mb-6">
                    HomeCare is a technology-enabled home service platform connecting customers with verified service professionals. Our core offerings include:
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {['Cleaning', 'Electrical', 'Plumbing', 'Painting', 'Appliance Repair', 'Carpentry', 'Home Maintenance', 'Other Services'].map((service, i) => (
                      <div key={i} className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-2.5 rounded-xl border border-gray-100 transition-colors hover:border-blue-200">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 italic flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Note: Availability of specific services may vary by location.
                  </p>
                </section>

                {/* 3. Booking Process */}
                <section id="booking" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">3</span>
                    Booking Process
                  </h2>
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-blue-50">
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { title: 'Customer submits enquiry', icon: Smartphone },
                        { title: 'HomeCare contacts customer', icon: Phone },
                        { title: 'Requirement discussion', icon: MessageCircle },
                        { title: 'Official estimate shared', icon: FileText },
                        { title: 'Customer approval', icon: CheckCircle2 },
                        { title: 'Professional assigned', icon: UserCheck },
                        { title: 'Service completed', icon: Briefcase },
                        { title: 'Digital invoice generated', icon: Receipt },
                      ].map((step, i, arr) => (
                        <div key={i} className="flex flex-col relative group">
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-[0_2px_10px_rgba(37,99,235,0.06)] group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                              <step.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-800 text-sm sm:text-base group-hover:text-[#2563EB] transition-colors">{step.title}</span>
                          </div>
                          {i !== arr.length - 1 && (
                            <div className="w-0.5 h-6 bg-blue-100 ml-5 my-1" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 bg-orange-50 border border-orange-100/80 rounded-xl p-4 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-900 font-medium leading-relaxed">
                        <strong className="text-[#F97316]">Highlight:</strong> No service begins without prior customer approval of the official estimate.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 4. Estimates & Pricing */}
                <section id="estimates" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">4</span>
                    Estimates & Pricing
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      'Transparent estimates provided upfront.',
                      'No hidden charges or surprise fees.',
                      'Additional work requires explicit customer approval.',
                      'Final price may vary only if the scope changes after approval.',
                      'GST is applied where applicable by law.'
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Customer Responsibilities */}
                <section id="customer-responsibilities" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">5</span>
                    Customer Responsibilities
                  </h2>
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                    <ul className="space-y-4">
                      {[
                        'Provide accurate and complete information during booking.',
                        'Ensure safe and unhindered access to the property.',
                        'Be available or have a representative present during the service.',
                        'Inform professionals about any special requirements, hazards, or fragile items.',
                        'Treat service professionals respectfully and professionally.'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0" />
                          <span className="leading-relaxed text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* 6. Professional Responsibilities */}
                <section id="professional-responsibilities" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">6</span>
                    Service Professional Responsibilities
                  </h2>
                  <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100/50">
                    <p className="text-[#2563EB] font-bold mb-5 text-sm uppercase tracking-wider">Professionals are expected to:</p>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        'Arrive on time as scheduled.',
                        'Wear HomeCare uniform (if applicable).',
                        'Maintain professional behavior.',
                        'Use proper and safe tools.',
                        'Respect customer privacy.',
                        'Complete approved work only.'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100/30">
                          <Check className="w-4 h-4 text-[#2563EB] shrink-0" strokeWidth={3} />
                          <span className="text-sm text-gray-800 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 7. Payments */}
                <section id="payments" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">7</span>
                    Payments & Digital Invoice
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                    <p className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2.5 shrink-0" />
                      Payments can be made through our supported payment methods (Cash, UPI, Cards).
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2.5 shrink-0" />
                      Digital GST invoices will be provided directly to your email or WhatsApp whenever applicable.
                    </p>
                    <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-semibold text-gray-900 text-sm">
                        Outstanding payments must be cleared immediately upon completion of the service unless otherwise agreed.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 8. Cancellation */}
                <section id="cancellation" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">8</span>
                    Cancellation & Rescheduling
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                    <p>Customers may request cancellation or rescheduling before the service begins.</p>
                    <p>Cancellation requests should preferably be made through our official support channels.</p>
                  </div>
                  <Link href="/cancellation-policy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#111827] font-semibold rounded-xl border border-gray-200 transition-colors text-sm shadow-sm">
                    View Cancellation Policy <ChevronRight className="w-4 h-4" />
                  </Link>
                </section>

                {/* 9. Warranty */}
                <section id="warranty" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">9</span>
                    Warranty & Customer Support
                  </h2>
                  <ul className="grid sm:grid-cols-1 gap-3">
                    {[
                      'Certain services may include a limited workmanship warranty.',
                      'Warranty duration varies by service category.',
                      'Customers should report issues within the applicable warranty period to claim a free re-service.'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                        <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0" />
                        <span className="text-sm font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 10. Liability */}
                <section id="liability" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">10</span>
                    Limitation of Liability
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                    HomeCare is responsible for coordinating services. We are not liable for:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {['Pre-existing damage', 'Undisclosed site conditions', 'Delays caused by weather, traffic, natural disasters or events beyond reasonable control', 'Indirect or consequential losses'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-red-50/40 text-gray-700 p-4 rounded-xl text-sm border border-red-50">
                        <div className="w-2 h-2 bg-red-400 rounded-full shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 11. IP */}
                <section id="intellectual-property" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">11</span>
                    Intellectual Property
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                    All website content including Logo, Brand Name, Design, Images, Icons, Content, and Software remain the property of HomeCare.
                  </p>
                  <div className="bg-orange-50/80 px-4 py-3 rounded-xl border border-orange-100 inline-block">
                    <p className="text-[#F97316] font-semibold text-sm">
                      Unauthorized use, reproduction or distribution is strictly prohibited.
                    </p>
                  </div>
                </section>

                {/* 12. Privacy */}
                <section id="privacy" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">12</span>
                    Privacy
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                    Customer information is collected and processed according to our Privacy Policy.
                  </p>
                  <Link href="/privacy-policy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#111827] font-semibold rounded-xl border border-gray-200 transition-colors text-sm shadow-sm">
                    Read Privacy Policy <ChevronRight className="w-4 h-4" />
                  </Link>
                </section>

                {/* 13. Policy Updates */}
                <section id="policy-updates" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">13</span>
                    Policy Updates
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    HomeCare reserves the right to update these Terms & Conditions. Changes become effective once published on the website.
                  </p>
                </section>

                {/* 14. Governing Law */}
                <section id="governing-law" className="scroll-mt-32 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">14</span>
                    Governing Law
                  </h2>
                  <div className="bg-[#F8FAFC] p-5 sm:p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed text-sm sm:text-base">
                    These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts where HomeCare operates.
                  </div>
                </section>

                {/* 15. Contact */}
                <section id="contact" className="scroll-mt-32">
                  <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center text-sm">15</span>
                    Contact Information
                  </h2>
                  
                  <div className="bg-gradient-to-br from-blue-50/50 to-white border border-blue-100 p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgb(37,99,235,0.05)]">
                    <p className="text-gray-900 font-bold mb-6 text-lg">Need clarification?</p>
                    
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                          <p className="font-semibold text-gray-900 text-sm">+91 80000 80000</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Email</p>
                          <p className="font-semibold text-gray-900 text-sm">legal@homecare.in</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Office Address</p>
                          <p className="font-semibold text-gray-900 text-sm">Raipur, Chhattisgarh, India</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Support Hours</p>
                          <p className="font-semibold text-gray-900 text-sm">Mon-Sun, 9 AM - 8 PM</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-blue-50">
                      <a href="tel:+918000080000" className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Call Now
                      </a>
                      <Link href="/contact" className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm transition-all text-sm">
                        Contact Support
                      </Link>
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
      <section className="py-20 bg-gradient-to-br from-[#111827] to-[#1e293b] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316] rounded-full blur-[120px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold mb-10">
            Built on Transparency, <br className="hidden sm:block" /> Professionalism & Trust
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              'Verified Professionals',
              'Transparent Estimates',
              'Digital Documentation',
              'Customer Support',
              'Professional Service Standards'
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#F97316]" />
                <span className="font-medium text-sm tracking-wide text-gray-200">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
