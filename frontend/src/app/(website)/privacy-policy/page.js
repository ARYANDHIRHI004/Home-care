'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Lock, ChevronRight, User, Phone, Mail, MapPin, Calendar, 
  Clock, CheckCircle2, MessageCircle, Info, Zap, Smartphone, CreditCard,
  Bell, FileText, Database, Shield, RefreshCcw, EyeOff, XCircle, Share2,
  Building, Globe, Settings, ArrowRight, Menu, X
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { BsShieldCheck, BsHeadset } from 'react-icons/bs';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- Content Sections ---
const SECTIONS = [
  { id: 'intro', title: '1. Introduction' },
  { id: 'collect', title: '2. Information We Collect' },
  { id: 'use', title: '3. How We Use Your Info' },
  { id: 'location', title: '4. Location Information' },
  { id: 'otp', title: '5. OTP Verification' },
  { id: 'payment', title: '6. Payment Information' },
  { id: 'comms', title: '7. WhatsApp & SMS' },
  { id: 'cookies', title: '8. Cookies & Analytics' },
  { id: 'sharing', title: '9. Data Sharing' },
  { id: 'security', title: '10. Data Security' },
  { id: 'rights', title: '11. Customer Rights' },
  { id: 'retention', title: '12. Data Retention' },
  { id: 'third-party', title: '13. Third Party Services' },
  { id: 'updates', title: '14. Policy Updates' },
  { id: 'contact', title: '15. Contact Us' }
];

function HeroSection() {
  const [date, setDate] = useState('');
  useEffect(() => {
    const d = new Date();
    setDate(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-hidden border-b border-slate-100">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full lg:w-3/5 text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-6 border border-blue-200/50">
              <BsShieldCheck className="w-4 h-4" /> Legal
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Privacy Policy
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl font-medium text-slate-900 mb-4">
              Your privacy matters to us.
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              HomeCare is committed to protecting your personal information and maintaining complete transparency regarding how your data is collected, used, stored, and protected.
            </motion.p>
            <motion.div variants={fadeUp} className="inline-block bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <span className="text-sm font-semibold text-slate-500">Last Updated:</span>
              <span className="text-sm font-bold text-slate-800 ml-2">{date || 'Loading...'}</span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full lg:w-2/5 flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50" />
              <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-50">
                <div className="relative">
                  <BsShieldCheck className="w-32 h-32 text-blue-600" />
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 p-3 rounded-full shadow-lg border-4 border-white">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Main Content Components ---

export default function PrivacyPolicyPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Intersection Observer for highlighting TOC
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-blue-600 selection:text-white relative">
      {/* Reading Progress Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 transform origin-left z-50" style={{ scaleX }} />
      
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Mobile TOC Toggle */}
          <div className="lg:hidden sticky top-4 z-40 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-4 flex justify-between items-center">
            <span className="font-bold text-slate-900">Table of Contents</span>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-slate-100 rounded-lg text-slate-700">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <aside className={`w-full lg:w-1/4 shrink-0 lg:block ${mobileMenuOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} lg:static lg:bg-transparent lg:p-0 lg:overflow-visible`}>
            {mobileMenuOpen && (
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="text-xl font-bold text-slate-900">Navigation</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-lg text-slate-700"><X className="w-5 h-5"/></button>
              </div>
            )}
            <div className="lg:sticky lg:top-24 space-y-1">
              <h3 className="hidden lg:block text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pl-3">Quick Navigation</h3>
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group
                    ${activeSection === section.id ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  {section.title}
                  {activeSection === section.id && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4 bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-12 space-y-24">
            
            {/* 1. INTRODUCTION */}
            <section id="intro" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">1</span> Introduction</h2>
              <div className="prose prose-lg text-slate-600 max-w-none">
                <p>HomeCare respects your privacy and is committed to protecting your personal information.</p>
                <p>By using our website or submitting a service enquiry, you agree to the collection and use of your information as described in this Privacy Policy.</p>
                <p>We collect only the information necessary to provide professional home services, improve customer experience, and fulfill legal obligations.</p>
              </div>
            </section>

            {/* 2. INFO WE COLLECT */}
            <section id="collect" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">2</span> Information We Collect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold text-lg"><User className="text-blue-600" /> Personal Information</div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Full Name</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Mobile Number</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Email Address</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> City & Service Address</li>
                  </ul>
                </div>
                <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold text-lg"><Calendar className="text-orange-500" /> Booking Information</div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Requested Service</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Preferred Date & Time</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Booking Status</li>
                  </ul>
                </div>
                <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold text-lg"><MessageCircle className="text-purple-500" /> Communication</div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Customer Support Conversations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> WhatsApp & Emails</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Service Feedback</li>
                  </ul>
                </div>
                <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold text-lg"><Smartphone className="text-slate-700" /> Technical Info</div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Browser & Device Type</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> IP Address</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Cookies & Sessions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. HOW WE USE YOUR INFO */}
            <section id="use" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">3</span> How We Use Your Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Create/manage enquiries', 'Contact regarding requests', 'Prepare estimates', 'Assign professionals', 'Generate invoices', 'Improve customer support', 'Send booking updates', 'Enhance platform security', 'Improve service quality'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. LOCATION */}
            <section id="location" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">4</span> Location Information</h2>
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-orange-900 text-lg">Important Notice</h3>
                </div>
                <p className="text-orange-800 font-medium">HomeCare does not continuously track customer locations.</p>
                <p className="text-orange-700 mt-2">Location information is used only for providing the requested service and navigating the assigned professional to your exact address.</p>
              </div>
              <ul className="space-y-2 text-slate-600 list-disc list-inside ml-2">
                <li>Service Address validation</li>
                <li>Google Maps Location pins for accurate routing</li>
                <li>Navigation Assistance for technicians</li>
              </ul>
            </section>

            {/* 5. OTP */}
            <section id="otp" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">5</span> OTP Verification</h2>
              <p className="text-slate-600 mb-4">We use One-Time Passwords (OTP) to ensure your account security. OTP may be used for:</p>
              <div className="flex flex-wrap gap-3">
                {['Mobile Verification', 'Secure Login', 'Account Recovery', 'Booking Verification', 'Future Service Verification'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">{tag}</span>
                ))}
              </div>
            </section>

            {/* 6. PAYMENT */}
            <section id="payment" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">6</span> Payment Information</h2>
              <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <CreditCard className="w-10 h-10 text-blue-200 mb-6" />
                <p className="text-lg font-medium mb-6">Payments are processed through secure third-party payment gateways. HomeCare <strong className="text-white underline underline-offset-4">never stores</strong>:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                  <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-blue-300" /> <span className="text-sm font-medium">Debit Cards</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-blue-300" /> <span className="text-sm font-medium">Credit Cards</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-blue-300" /> <span className="text-sm font-medium">CVV</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-blue-300" /> <span className="text-sm font-medium">UPI PIN</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-blue-300" /> <span className="text-sm font-medium">Bank Passwords</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-blue-300" /> <span className="text-sm font-medium text-blue-200 leading-tight">Banking Credentials</span></div>
                </div>
              </div>
            </section>

            {/* 7. WHATSAPP & SMS */}
            <section id="comms" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">7</span> WhatsApp, SMS & Email</h2>
              <p className="text-slate-600 mb-6">To keep you informed, customers may receive automated transactional notifications regarding:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['Booking Confirmation', 'Estimate Updates', 'Worker Assignment', 'Service Updates', 'Invoices', 'Cancellation Updates', 'Support Messages'].map((n, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center text-sm font-semibold text-slate-700">
                    {n}
                  </div>
                ))}
              </div>
              <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-start gap-3 border border-green-100">
                <Info className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
                <span className="text-sm">Promotional messages will only be sent with explicit customer consent where required by law.</span>
              </div>
            </section>

            {/* 8. COOKIES */}
            <section id="cookies" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">8</span> Cookies & Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4">Cookies help us:</h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Improve Website Performance</li>
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Remember User Sessions</li>
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Analyze Website Traffic</li>
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Enhance User Experience</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center text-center">
                  <Settings className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Customers can manage or disable cookies through their local browser settings at any time.</p>
                </div>
              </div>
            </section>

            {/* 9. DATA SHARING */}
            <section id="sharing" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">9</span> Data Sharing</h2>
              <p className="text-slate-600 mb-6">We may share strictly limited, necessary information with:</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Assigned Service Professional', 'Payment Gateways', 'Government Authorities (if legally required)', 'Technology Service Providers'].map((entity, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl font-medium text-sm text-slate-700">
                    <Share2 className="w-4 h-4 text-slate-400" /> {entity}
                  </div>
                ))}
              </div>
              <div className="bg-green-600 text-white p-6 rounded-2xl font-bold text-lg flex items-center gap-4 shadow-lg shadow-green-600/20">
                <BsShieldCheck className="w-8 h-8 shrink-0" />
                We NEVER sell customer data to third parties.
              </div>
            </section>

            {/* 10. DATA SECURITY */}
            <section id="security" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">10</span> Data Security</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Encrypted Communication', icon: Lock },
                  { title: 'Secure Servers', icon: Database },
                  { title: 'Restricted Employee Access', icon: EyeOff },
                  { title: 'Regular Monitoring', icon: ActivityIcon },
                  { title: 'Data Protection Practices', icon: Shield }
                ].map((item, i) => (
                  <div key={i} className="p-5 border border-slate-200 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <item.icon className="w-8 h-8 text-blue-600 mb-3" />
                    <span className="font-semibold text-slate-800 text-sm">{item.title}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. YOUR RIGHTS */}
            <section id="rights" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">11</span> Your Rights</h2>
              <p className="text-slate-600 mb-6">As a customer, you maintain full control over your personal data. You may:</p>
              <div className="flex flex-wrap gap-4">
                {['Access Personal Information', 'Update Personal Information', 'Request Corrections', 'Request Account Deletion', 'Withdraw Consent', 'Contact Privacy Support'].map((right, i) => (
                  <div key={i} className="px-5 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default">
                    {right}
                  </div>
                ))}
              </div>
            </section>

            {/* 12. DATA RETENTION */}
            <section id="retention" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">12</span> Data Retention</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>Booking records are retained only as long as necessary for business operations, legal compliance, accounting, customer support, and dispute resolution.</p>
                <p>Expired information is securely deleted or anonymized where appropriate to prevent identification.</p>
              </div>
            </section>

            {/* 13. THIRD-PARTY */}
            <section id="third-party" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">13</span> Third-Party Services</h2>
              <div className="space-y-4">
                {[
                  { name: 'Google Maps', desc: 'Used for address validation and technician navigation.' },
                  { name: 'WhatsApp Business', desc: 'Used for automated booking and support notifications.' },
                  { name: 'Meta Platforms', desc: 'Used for occasional marketing targeting (subject to consent).' },
                  { name: 'SMS Gateway', desc: 'Used for OTP and critical transactional alerts.' },
                  { name: 'Payment Gateways', desc: 'Used for secure transaction processing (e.g., Stripe, Razorpay).' },
                  { name: 'Analytics Tools', desc: 'Used to monitor website performance and fix bugs.' }
                ].map((service, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 border border-slate-100 bg-[#F8FAFC] rounded-xl">
                    <span className="font-bold text-slate-900 min-w-[180px]">{service.name}</span>
                    <span className="text-slate-600 text-sm">{service.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 14. POLICY UPDATES */}
            <section id="updates" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">14</span> Policy Updates</h2>
              <p className="text-slate-600 mb-4">This Privacy Policy may be updated periodically to reflect changes in our legal obligations or operational practices. Customers should review this page occasionally.</p>
              <p className="text-slate-600 font-medium">The "Last Updated" date at the top of this page will always reflect the latest revision.</p>
            </section>

            {/* 15. CONTACT US */}
            <section id="contact" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">15</span> Contact Us</h2>
              <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Questions regarding this Policy?</h3>
                    <p className="text-slate-400 mb-6">Contact our dedicated Privacy Team.</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-slate-300"><Phone className="w-5 h-5 text-blue-400" /> +91 98765 43210</li>
                      <li className="flex items-center gap-3 text-slate-300"><Mail className="w-5 h-5 text-blue-400" /> privacy@homecare.in</li>
                      <li className="flex items-center gap-3 text-slate-300"><Building className="w-5 h-5 text-blue-400" /> 123 HomeCare Tower, New Delhi</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg">Contact Support</button>
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">Email Us</button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Trust Section CTA */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[3rem] p-12 text-center text-white shadow-xl shadow-blue-900/20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-10">Your Privacy is Our Responsibility.</h2>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
              {[
                { title: 'Secure Platform', icon: Lock },
                { title: 'Encrypted Data', icon: Database },
                { title: 'Verified Company', icon: BsShieldCheck },
                { title: 'Transparent Practices', icon: EyeOff },
                { title: 'Professional Support', icon: BsHeadset }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <t.icon className="w-6 h-6 text-blue-200" />
                  </div>
                  <span className="font-semibold text-sm">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Dummy component for missing lucide icon
function ActivityIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
