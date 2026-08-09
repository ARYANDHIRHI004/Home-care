'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, HelpCircle, ChevronDown, CheckCircle2, Loader2, 
  ThumbsUp, ThumbsDown, Phone, Mail, Building, Upload,
  Calendar, CreditCard, XCircle, RefreshCcw, Wrench, 
  ArrowRight, User, Smartphone, MapPin, Tag, FileText
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

// --- FAQ Data ---
const FAQ_CATEGORIES = [
  { id: 'Booking', icon: Calendar },
  { id: 'Payment', icon: CreditCard },
  { id: 'Cancellation', icon: XCircle },
  { id: 'Refund', icon: RefreshCcw },
  { id: 'Services', icon: Wrench },
  { id: 'Technicians', icon: BsShieldCheck },
  { id: 'Pricing', icon: Tag },
  { id: 'Support', icon: BsHeadset }
];

const FAQS = {
  Booking: [
    { q: 'How do I book a service?', a: 'To book a service, you first submit an enquiry through our platform. Our support team will review it and call you within 15 minutes to confirm details and provide an estimate before finalizing the booking.' },
    { q: 'Can I modify my booking?', a: 'Yes, you can modify your booking requirements or time slot by contacting our support team at least 2 hours before the scheduled service time.' },
    { q: 'Can I cancel my enquiry?', a: 'Yes, you can request a cancellation at any time before the technician starts travelling to your location. Simply reach out to support.' },
    { q: 'How long does confirmation take?', a: 'Enquiries are typically reviewed and confirmed over a quick phone call within 15 minutes during standard business hours.' }
  ],
  Pricing: [
    { q: 'How is pricing calculated?', a: 'Pricing is based on the specific requirements of your task, materials needed, and standardized labor rates. You will always receive a clear estimate before work begins.' },
    { q: 'Are there any hidden charges?', a: 'No, we believe in 100% transparent pricing. You only pay the amount agreed upon in the final estimate unless you request additional scope during the service.' },
    { q: 'Will I receive an estimate first?', a: 'Yes, our consultation-first model ensures you always receive and approve a detailed estimate before a professional is assigned.' }
  ],
  Payment: [
    { q: 'Which payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and cash after service completion.' },
    { q: 'Can I pay after service completion?', a: 'Yes, for most services, you can choose to pay securely online or via cash once the professional has successfully completed the job.' },
    { q: 'Will I receive a GST invoice?', a: 'Absolutely. A detailed digital GST invoice will be automatically sent to your registered email and WhatsApp upon job completion.' }
  ],
  Technicians: [
    { q: 'Are professionals verified?', a: 'Yes, 100% of our service partners undergo strict background checks, including Aadhaar and police verification, along with rigorous technical skill assessments.' },
    { q: 'Can I request a different technician?', a: 'If you are unsatisfied with the assigned technician before the work starts, you can contact support to request a replacement.' },
    { q: 'Can I track the technician?', a: 'Yes, you will receive a tracking link via SMS/WhatsApp once the professional is dispatched to your location.' }
  ],
  Cancellation: [
    { q: 'How do I request cancellation?', a: 'You can request cancellation via the app, or by calling/WhatsApping our support team directly.' },
    { q: 'Will cancellation charges apply?', a: 'Cancellation is free if done before the professional starts travelling. Late cancellations may incur a nominal visit fee to compensate the partner.' },
    { q: 'Can I reschedule instead?', a: 'Yes! We highly recommend rescheduling your service to a more convenient time instead of completely cancelling.' }
  ],
  Refund: [
    { q: 'When will my refund be processed?', a: 'Eligible refunds are processed immediately upon cancellation approval by our support team.' },
    { q: 'How long does refund take?', a: 'Once processed from our end, refunds typically take 5-7 business days to reflect in your original payment method depending on your bank.' }
  ],
  Support: [
    { q: 'How can I contact support?', a: 'You can reach our dedicated support team via Phone, WhatsApp, or Email using the contact options at the bottom of this page.' },
    { q: 'What are support timings?', a: 'Our standard support operates Monday to Saturday from 9:00 AM to 8:00 PM. We provide emergency support on Sundays.' },
    { q: 'Can I contact through WhatsApp?', a: 'Yes, our WhatsApp support is the fastest way to get instant automated updates or chat with a live agent.' }
  ]
};

// --- Sub-components ---

function HeroSection({ searchQuery, setSearchQuery }) {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-hidden border-b border-slate-100">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-6 border border-blue-200/50">
            <HelpCircle className="w-4 h-4" /> Help Center
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Frequently Asked Questions
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Find quick answers to common questions about bookings, payments, refunds, and support. If you can't find what you need, submit your concern below.
          </motion.p>

          <motion.div variants={fadeUp} className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search your question..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 hover:bg-white border-2 border-slate-100 focus:border-blue-600 rounded-full text-lg shadow-sm focus:shadow-xl focus:shadow-blue-600/10 transition-all outline-none"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-slate-500 font-medium">Popular:</span>
            {['Booking', 'Payment', 'Cancellation', 'Refund', 'Cleaning'].map((term) => (
              <button key={term} onClick={() => setSearchQuery(term)} className="px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-full font-medium transition-colors">
                {term}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PopularTopics({ setActiveCategory }) {
  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center lg:text-left">Popular Topics</h3>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          {FAQ_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              onClick={() => {
                setActiveCategory(cat.id);
                document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-semibold transition-all group"
            >
              <cat.icon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              {cat.id}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group"
      >
        <span className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-50 mt-2 pt-4">
              <p className="text-slate-600 leading-relaxed mb-6">{a}</p>
              
              {/* Helpful Feedback */}
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-700">Was this helpful?</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setFeedback('yes')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${feedback === 'yes' ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Yes
                    </button>
                    <button 
                      onClick={() => setFeedback('no')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${feedback === 'no' ? 'bg-orange-100 text-orange-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                      <ThumbsDown className="w-4 h-4" /> No
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {feedback === 'no' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 font-medium">Still need help?</span>
                      <button 
                        onClick={() => document.getElementById('support-form').scrollIntoView({ behavior: 'smooth' })}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4"
                      >
                        Contact Support
                      </button>
                    </motion.div>
                  )}
                  {feedback === 'yes' && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Thank you for your feedback!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainContent({ searchQuery, activeCategory }) {
  const [formState, setFormState] = useState('idle'); // idle, loading, success

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  // Filter logic for FAQs
  const getFilteredFAQs = () => {
    if (searchQuery.trim() !== '') {
      const results = [];
      const query = searchQuery.toLowerCase();
      Object.entries(FAQS).forEach(([cat, questions]) => {
        questions.forEach(q => {
          if (q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query) || cat.toLowerCase().includes(query)) {
            results.push({ ...q, category: cat });
          }
        });
      });
      return results;
    }
    return null;
  };

  const searchResults = getFilteredFAQs();

  return (
    <section id="faq-section" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT: FAQ List */}
          <div className="w-full lg:w-1/2 xl:w-7/12">
            {searchResults !== null ? (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Search Results ({searchResults.length})</h3>
                {searchResults.length > 0 ? (
                  searchResults.map((faq, i) => (
                    <AccordionItem key={`search-${i}`} q={faq.q} a={faq.a} />
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg text-slate-600 font-medium">No results found for "{searchQuery}"</p>
                    <p className="text-slate-500 mt-2">Try checking the categories or submit a concern below.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-8">{activeCategory} FAQs</h3>
                {FAQS[activeCategory] ? (
                  FAQS[activeCategory].map((faq, i) => (
                    <AccordionItem key={`${activeCategory}-${i}`} q={faq.q} a={faq.a} />
                  ))
                ) : (
                  Object.entries(FAQS).map(([cat, questions]) => (
                    <div key={cat} className="mb-10">
                      <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        {FAQ_CATEGORIES.find(c => c.id === cat)?.icon && React.createElement(FAQ_CATEGORIES.find(c => c.id === cat).icon, { className: 'w-5 h-5 text-blue-600' })}
                        {cat}
                      </h4>
                      {questions.map((faq, i) => (
                        <AccordionItem key={`${cat}-${i}`} q={faq.q} a={faq.a} />
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Support Form (Sticky on Desktop) */}
          <div id="support-form" className="w-full lg:w-1/2 xl:w-5/12 lg:sticky lg:top-32">
            
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-green-200 p-8 rounded-[2rem] shadow-xl text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-600 mb-6">Your concern has been submitted successfully. Our Customer Support team will contact you shortly.</p>
                  <div className="bg-slate-50 py-3 rounded-xl mb-8 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Reference ID</p>
                    <p className="font-mono font-bold text-slate-900">HC-2026-000123</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setFormState('idle')} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                      Back to Home
                    </button>
                    <button className="w-full py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors">
                      View Contact Details
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Didn't Find Your Answer?</h3>
                    <p className="text-slate-600">Submit your concern and our Customer Support team will contact you as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSupportSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Full Name</label>
                        <div className="relative mt-1">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Mobile Number</label>
                        <div className="relative mt-1">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email <span className="text-slate-400 lowercase font-normal">(Optional)</span></label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">City</label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                            <option value="">Select City</option>
                            <option value="delhi">New Delhi</option>
                            <option value="mumbai">Mumbai</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Concern Category</label>
                      <div className="relative mt-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                          <option value="">Select Category</option>
                          <option value="Booking">Booking</option>
                          <option value="Payment">Payment</option>
                          <option value="Cancellation">Cancellation</option>
                          <option value="Refund">Refund</option>
                          <option value="Service Quality">Service Quality</option>
                          <option value="Technician">Technician</option>
                          <option value="Complaint">Complaint</option>
                          <option value="Suggestion">Suggestion</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Subject</label>
                      <div className="relative mt-1">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Message</label>
                      <textarea required rows="3" className="mt-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none text-sm"></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contact Method</label>
                        <select required className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                          <option value="Phone Call">Phone Call</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Email">Email</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Preferred Time</label>
                        <select required className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Evening">Evening</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Attach Screenshot <span className="text-slate-400 lowercase font-normal">(Optional)</span></label>
                      <div className="mt-1 relative flex items-center justify-center w-full px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group">
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                          <Upload className="w-5 h-5" />
                          <span className="text-sm font-medium">Choose File</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input type="checkbox" id="consent" required className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="consent" className="text-xs text-slate-600">
                        I agree to be contacted regarding my support request and accept the Privacy Policy.
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formState === 'loading'}
                      className={`w-full py-4 mt-2 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
                        ${formState === 'idle' ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'bg-blue-400 cursor-not-allowed'}
                      `}
                    >
                      {formState === 'idle' ? 'Submit Concern' : <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}

function QuickContact() {
  const contacts = [
    { title: 'Call Support', icon: Phone, detail: '+91 98765 43210', color: 'blue' },
    { title: 'WhatsApp Support', icon: FaWhatsapp, detail: 'Chat with us', color: 'green' },
    { title: 'Email Support', icon: Mail, detail: 'support@homecare.in', color: 'orange' },
    { title: 'Visit Office', icon: Building, detail: '123 HomeCare Tower', color: 'purple' },
  ];

  const colorStyles = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Other ways to reach us</h2>
        <p className="text-lg text-slate-600 mb-12">We are always here to help you via multiple channels.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact, i) => (
            <motion.a 
              href="#"
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center p-8 bg-[#F8FAFC] border border-slate-200 rounded-3xl hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colorStyles[contact.color]}`}>
                <contact.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{contact.title}</h4>
              <p className="text-slate-600 font-medium">{contact.detail}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <PopularTopics setActiveCategory={setActiveCategory} />
      <MainContent searchQuery={searchQuery} activeCategory={activeCategory === 'All' ? 'Booking' : activeCategory} />
      <QuickContact />
      
      {/* Sticky Mobile Contact Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden z-50 flex gap-4 pb-safe">
        <a href="tel:+919876543210" className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <Phone className="w-5 h-5" /> Call
        </a>
        <a href="#" className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <FaWhatsapp className="w-5 h-5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
