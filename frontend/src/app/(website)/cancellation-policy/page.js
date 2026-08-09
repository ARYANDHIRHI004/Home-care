'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Phone, MessageCircle, FileText, 
  UserCheck, CheckCircle2, AlertCircle, Calendar, XCircle, RefreshCcw, 
  Zap, Check, PhoneCall, Mail, HelpCircle, Wallet, ThumbsUp, CreditCard, 
  User, HeartHandshake, ArrowDown
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { BsShieldCheck, BsHeadset } from 'react-icons/bs';
import { ShieldAlert } from 'lucide-react';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- Sub-components ---

function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 text-orange-700 text-sm font-semibold tracking-wide uppercase mb-6 border border-orange-200/50">
            <ShieldAlert className="w-4 h-4" /> Cancellation Policy
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Simple, Transparent & <br className="hidden md:block"/> Customer-Friendly
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            At HomeCare, we operate on an enquiry-first model rather than instant booking. Every service request is personally reviewed by our support team before assigning a professional. If you wish to cancel your request, our team will first understand your concern and try to provide the best possible solution before finalizing the cancellation.
          </motion.p>
          
          <motion.p variants={fadeUp} className="text-sm font-medium text-slate-500">
            Last Updated: August 9, 2026
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function ImportantNotice() {
  const points = [
    'Resolve misunderstandings',
    'Offer better alternatives',
    'Reschedule appointments',
    'Update service requirements',
    'Ensure complete customer satisfaction'
  ];

  return (
    <section className="py-16 bg-white relative -mt-8 rounded-t-[3rem] z-20 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
          className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 md:p-12 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">How Our Cancellation Process Works</h2>
          </div>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>
              Unlike traditional instant-booking platforms, HomeCare follows a <strong>consultation-based service process</strong>. 
              Customers initially submit an enquiry instead of directly booking a service.
            </p>
            <p>
              Our support executive contacts the customer, understands the requirement, prepares an estimate, and confirms all service details.
            </p>
            <p>
              Because every enquiry involves manual coordination, every cancellation request is reviewed by our Customer Support team before it is finalized. This process allows us to:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {points.map((pt, i) => (
                <li key={i} className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-blue-100/50 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="font-medium">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceFlow() {
  const steps = [
    { title: 'Enquiry Submitted', icon: FileText },
    { title: 'Support Calls', icon: Phone },
    { title: 'Requirement Discussion', icon: MessageCircle },
    { title: 'Estimate Shared', icon: Wallet },
    { title: 'Customer Approval', icon: ThumbsUp },
    { title: 'Professional Assigned', icon: UserCheck },
    { title: 'Service Completed', icon: CheckCircle2 }
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Standard Service Flow</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Understanding how our service operates helps clarify why we use a consultation-based cancellation process.</p>
        </div>

        {/* Horizontal Timeline (Desktop) & Vertical (Mobile) */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-blue-100 -translate-y-1/2" />
          <div className="lg:hidden absolute left-8 top-10 bottom-10 w-1 bg-blue-100" />
          
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex lg:flex-col items-center gap-6 lg:gap-4 flex-1"
              >
                <div className="w-16 h-16 bg-white border-4 border-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative z-10 group hover:border-blue-100 hover:scale-110 transition-all duration-300">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-left lg:text-center">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">Step {i+1}</span>
                  <h4 className="font-semibold text-slate-900">{step.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CancellationFlow() {
  const flow = [
    { text: 'Customer Requests Cancellation', icon: User, color: 'text-orange-600', bg: 'bg-orange-100' },
    { text: 'Select Cancellation Reason', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { text: 'Support Team Reviews Request', icon: BsShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { text: 'Customer Receives Call', icon: PhoneCall, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Cancellation Request Flow</h2>
          <p className="text-lg text-slate-600">What happens when you decide to cancel an enquiry.</p>
        </div>

        <div className="relative border-l-4 border-blue-100 pl-8 ml-4 md:ml-12 space-y-12">
          {flow.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className={`absolute -left-[54px] w-12 h-12 rounded-full border-4 border-white ${step.bg} ${step.color} flex items-center justify-center shadow-sm`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-slate-900">{step.text}</h4>
              </div>
            </motion.div>
          ))}

          {/* Decision Node */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="absolute -left-[54px] w-12 h-12 rounded-full border-4 border-white bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">Issue Resolved?</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white border border-green-200 p-4 rounded-xl text-center shadow-sm">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-xs mb-3">YES</span>
                  <p className="font-semibold text-slate-900">Continue Service</p>
                </div>
                <div className="flex items-center justify-center text-slate-400 font-bold text-sm">OR</div>
                <div className="flex-1 bg-white border border-red-200 p-4 rounded-xl text-center shadow-sm">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs mb-3">NO</span>
                  <p className="font-semibold text-slate-900">Cancellation Approved</p>
                  <p className="text-xs text-slate-500 mt-2 flex justify-center items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600"/> Confirmation via WhatsApp/SMS</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EligibilityCards() {
  const eligibilities = [
    { title: 'Before estimate approval', desc: 'Customers may request cancellation anytime without any questions asked.', status: 'Allowed', color: 'bg-green-100 text-green-700', border: 'border-green-200' },
    { title: 'After estimate approval', desc: 'Cancellation request can still be submitted and will be reviewed promptly.', status: 'Allowed', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
    { title: 'Before technician travels', desc: 'Support team will review and process the request immediately.', status: 'Allowed', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
    { title: 'After technician travels', desc: 'Cancellation may be subject to operational or visit charges where applicable.', status: 'Conditional', color: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
    { title: 'After service starts', desc: 'Cancellation is generally not possible. Customers may raise a service complaint instead.', status: 'Not Allowed', color: 'bg-red-100 text-red-700', border: 'border-red-200' },
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">When Can You Request Cancellation?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Different stages of the service flow have different cancellation policies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eligibilities.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow ${item.border}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-700" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.color}`}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CancellationReasons() {
  const reasons = [
    'Changed my mind',
    'Service no longer required',
    'Price higher than expected',
    'Need service at another time',
    'Booked by mistake',
    'Found another provider',
    'Technician delay',
    'Other reason'
  ];

  const [selected, setSelected] = useState(0);

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Cancellation Reasons</h2>
        <p className="text-lg text-slate-600 mb-12">Select the reason that best describes your situation when requesting a cancellation.</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {reasons.map((reason, i) => (
            <motion.button
              key={i}
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors border shadow-sm
                ${selected === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}
              `}
            >
              {reason}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Alternatives() {
  const alternatives = [
    { title: 'Reschedule Service', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Modify Requirements', icon: RefreshCcw, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Request New Estimate', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Change Date/Time', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Choose Another Pro', icon: UserCheck, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Alternatives Before Cancellation</h2>
            <p className="text-lg text-slate-600 mb-8">
              We want to ensure your home maintenance needs are met. Before deciding to cancel completely, our team can help you with these flexible alternatives.
            </p>
            <button className="px-8 py-4 bg-white border border-slate-200 text-blue-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mx-auto lg:mx-0">
              Speak to an Expert <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternatives.map((alt, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alt.bg} ${alt.color} group-hover:scale-110 transition-transform`}>
                  <alt.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900">{alt.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RefundInfo() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Refund Information</h2>
            <div className="space-y-6 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              <p>
                If advance payment has been collected, eligible refunds will be processed according to our standard payment and refund policy.
              </p>
              <p>
                If no payment has been made, completing the cancellation will simply close the enquiry with no charges applied.
              </p>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 mt-8 flex items-center gap-4 text-left">
                <Clock className="w-8 h-8 text-blue-400 shrink-0" />
                <p className="text-sm">Refund timelines typically take <strong className="text-white">5-7 business days</strong> to reflect in your account, depending on your bank or payment method.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CommitmentSection() {
  const commitments = [
    { title: 'Transparent Communication', icon: MessageCircle },
    // { title: 'No Hidden Process', icon: Shield },
    // { title: 'Dedicated Support', icon: BsHeadset },
    { title: 'Fair Cancellation Review', icon: FileText },
    { title: 'Quick Response', icon: Zap },
    { title: 'Customer First Approach', icon: HeartHandshake }
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Commitment to You</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {commitments.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900">{item.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Need help with a cancellation?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Our Customer Support team is always available to help you process your request or find a better solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+919876543210" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Phone className="w-5 h-5" /> Call Support
              </a>
              <a href="#" className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5" /> WhatsApp Support
              </a>
              <a href="mailto:support@homecare.in" className="px-8 py-4 bg-blue-700 border border-blue-500 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Mail className="w-5 h-5" /> Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      <HeroSection />
      <ImportantNotice />
      <ServiceFlow />
      <CancellationFlow />
      <EligibilityCards />
      <CancellationReasons />
      <Alternatives />
      <RefundInfo />
      <CommitmentSection />
      <FinalCTA />
    </div>
  );
}
