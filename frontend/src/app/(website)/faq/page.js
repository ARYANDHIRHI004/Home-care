'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, HelpCircle, ChevronDown, CheckCircle2, Loader2,
  ThumbsUp, ThumbsDown, Phone, Mail, Building,
  Calendar, CreditCard, XCircle, RefreshCcw, Wrench,
  ArrowRight, User, Smartphone, MapPin, Tag, FileText
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { BsShieldCheck, BsHeadset } from 'react-icons/bs';
import Link from 'next/link';
import { useCreateEnquiryMutation } from '@/store/api/enquiryApi';
import { useGetFaqsQuery, useSuggestFaqMutation } from '@/store/api/faqApi';

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

// FAQS are now fetched dynamically from backend

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

function PopularTopics({ setActiveCategory, dynamicCategories }) {
  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center lg:text-left">Popular Topics</h3>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          {dynamicCategories.length > 0 ? dynamicCategories.map((cat, i) => (
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
          )) : (
             <div className="text-slate-500 italic text-sm">No topics available</div>
          )}
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

// Distinct from the "Didn't Find Your Answer?" support form on the right —
// that creates an Enquiry for staff to call the customer back; this instead
// suggests a new question for the FAQ list itself. Goes to Faq.status
// 'pending' and only appears here once an office admin answers and
// publishes it from /office/faqs — never shown publicly before that.
function SuggestQuestionForm() {
  const [suggestFaq, { isLoading }] = useSuggestFaqMutation();
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await suggestFaq({ question: question.trim(), name: name.trim() || undefined, email: email.trim() || undefined }).unwrap();
      setSubmitted(true);
      setQuestion('');
      setName('');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.data?.message || err.message || 'Failed to submit your question. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-3 mb-10">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Thanks — your question has been submitted for review.</p>
          <p className="text-xs text-emerald-700 mt-1">Our team will answer it and add it to this list soon.</p>
          <button onClick={() => setSubmitted(false)} className="text-xs font-semibold text-emerald-700 underline underline-offset-2 mt-2">Ask another question</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10">
      <h4 className="text-sm font-bold text-slate-900 mb-1">Don&apos;t see your question here?</h4>
      <p className="text-xs text-slate-500 mb-4">Suggest it and our team will add an answer for everyone.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          required
          rows={2}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question…"
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        {errorMsg && <p className="text-xs text-rose-600">{errorMsg}</p>}
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isLoading ? 'Submitting…' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
}

function MainContent({ searchQuery, activeCategory, faqsByCategory, rawFaqs, isLoading }) {
  const [createEnquiry] = useCreateEnquiryMutation();
  const [formState, setFormState] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('Phone Call');
  const [preferredTime, setPreferredTime] = useState('Morning');

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMsg('');
    try {
      await createEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        source: 'website',
        serviceCategory: category || 'Support',
        description: `[${category || 'Support'}] ${subject} — ${message} (Preferred contact: ${contactMethod}, ${preferredTime})`,
        city: city || undefined,
      }).unwrap();
      setFormState('success');
    } catch (err) {
      setFormState('error');
      setErrorMsg(err.data?.message || err.message || 'Failed to submit. Please try again.');
      setTimeout(() => setFormState('idle'), 5000);
    }
  };

  // Filter logic for FAQs
  const getFilteredFAQs = () => {
    if (searchQuery.trim() !== '') {
      const results = [];
      const query = searchQuery.toLowerCase();
      rawFaqs.forEach(faq => {
        if (faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query) || faq.category.toLowerCase().includes(query)) {
          results.push({ ...faq, category: faq.category });
        }
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
            {isLoading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
               </div>
            ) : searchResults !== null ? (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Search Results ({searchResults.length})</h3>
                {searchResults.length > 0 ? (
                  searchResults.map((faq, i) => (
                    <AccordionItem key={`search-${faq._id || i}`} q={faq.question} a={faq.answer} />
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
                {faqsByCategory[activeCategory] ? (
                  faqsByCategory[activeCategory].map((faq, i) => (
                    <AccordionItem key={`${activeCategory}-${faq._id || i}`} q={faq.question} a={faq.answer} />
                  ))
                ) : (
                  Object.keys(faqsByCategory).length > 0 ? (
                    Object.entries(faqsByCategory).map(([cat, questions]) => (
                      <div key={cat} className="mb-10">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                          {FAQ_CATEGORIES.find(c => c.id.toLowerCase() === cat.toLowerCase())?.icon && React.createElement(FAQ_CATEGORIES.find(c => c.id.toLowerCase() === cat.toLowerCase()).icon, { className: 'w-5 h-5 text-blue-600' })}
                          {cat}
                        </h4>
                        {questions.map((faq, i) => (
                          <AccordionItem key={`${cat}-${faq._id || i}`} q={faq.question} a={faq.answer} />
                        ))}
                      </div>
                    ))
                  ) : (
                     <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                       <p className="text-lg text-slate-600 font-medium">No FAQs available yet.</p>
                       <p className="text-slate-500 mt-2">Check back later or submit a concern below.</p>
                     </div>
                  )
                )}
              </div>
            )}

            {!isLoading && <SuggestQuestionForm />}
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
                  <p className="text-slate-600 mb-8">Your concern has been submitted successfully. Our Customer Support team will contact you shortly.</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setFormState('idle')} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                      Submit Another
                    </button>
                    <Link href="/contact" className="w-full py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors block">
                      View Contact Details
                    </Link>
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
                          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Mobile Number</label>
                        <div className="relative mt-1">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email <span className="text-slate-400 lowercase font-normal">(Optional)</span></label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">City</label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select required value={city} onChange={e => setCity(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                            <option value="">Select City</option>
                            <option value="bhilai">Bhilai</option>
                            <option value="durg">Durg</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Concern Category</label>
                      <div className="relative mt-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
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
                        <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Message</label>
                      <textarea required rows="3" value={message} onChange={e => setMessage(e.target.value)} className="mt-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none text-sm"></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contact Method</label>
                        <select required value={contactMethod} onChange={e => setContactMethod(e.target.value)} className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                          <option value="Phone Call">Phone Call</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Email">Email</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Preferred Time</label>
                        <select required value={preferredTime} onChange={e => setPreferredTime(e.target.value)} className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none text-sm text-slate-700">
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Evening">Evening</option>
                        </select>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                        {errorMsg}
                      </div>
                    )}

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
    { title: 'Call Support', icon: Phone, detail: '+91 91114 66642', color: 'blue', href: 'tel:+919111466642' },
    { title: 'WhatsApp Support', icon: FaWhatsapp, detail: 'Chat with us', color: 'green', href: 'https://wa.me/919111466642' },
    { title: 'Email Support', icon: Mail, detail: 'homecarre2405@gmail.com', color: 'orange', href: 'mailto:homecarre2405@gmail.com' },
    { title: 'Visit Office', icon: Building, detail: 'Risali, Bhilai, Durg', color: 'purple', href: '/contact#map' },
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
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
  
  const { data: faqs = [], isLoading } = useGetFaqsQuery('active=true');

  const faqsByCategory = React.useMemo(() => {
    const grouped = {};
    faqs.forEach(faq => {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [faqs]);

  const dynamicCategories = React.useMemo(() => {
    return Object.keys(faqsByCategory).map(catName => {
      const existing = FAQ_CATEGORIES.find(c => c.id.toLowerCase() === catName.toLowerCase());
      return {
        id: catName,
        icon: existing ? existing.icon : HelpCircle
      };
    });
  }, [faqsByCategory]);

  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <PopularTopics setActiveCategory={setActiveCategory} dynamicCategories={dynamicCategories} />
      <MainContent 
        searchQuery={searchQuery} 
        activeCategory={activeCategory === 'All' && dynamicCategories.length > 0 ? dynamicCategories[0].id : activeCategory} 
        faqsByCategory={faqsByCategory}
        rawFaqs={faqs}
        isLoading={isLoading}
      />
      <QuickContact />
      
      {/* Sticky Mobile Contact Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden z-50 flex gap-4 pb-safe">
        <a href="tel:+919111466642" className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <Phone className="w-5 h-5" /> Call
        </a>
        <a href="https://wa.me/919111466642" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <FaWhatsapp className="w-5 h-5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
