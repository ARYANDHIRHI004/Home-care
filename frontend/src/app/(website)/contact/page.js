'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, Building, 
  CheckCircle2, AlertCircle, Loader2, ChevronDown, 
  Calendar, Zap, ArrowRight, User, Hash, Tag, 
  FileText, Smartphone, Car, Navigation, HelpCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { BsShieldCheck, BsHeadset } from 'react-icons/bs';
import { useCreateEnquiryMutation } from '@/store/api/enquiryApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-6 border border-blue-200/50">
              <BsHeadset className="w-4 h-4" /> Contact HomeCare
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
              We're Here to <br className="hidden lg:block"/> Help You
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Have questions, need assistance, or want to book a service? Our team is ready to help you with quick responses and professional support.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/services" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Book a Service <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+919111466642" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" /> Call Now
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1000" 
                alt="Customer Support" 
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/90 backdrop-blur-md p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">24/7 Support Available</p>
                  <p className="text-sm text-slate-600">Average response time: 5 mins</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactCards() {
  const cards = [
    {
      title: 'Call Us',
      icon: Phone,
      color: 'blue',
      detail: '+91 91114 66642',
      subtext: 'Available: 9 AM - 8 PM',
      action: 'Call Now',
      href: 'tel:+919111466642'
    },
    {
      title: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'green',
      detail: 'Instant Support',
      subtext: 'Usually replies within 5 mins',
      action: 'Chat Now',
      href: 'https://wa.me/919111466642'
    },
    {
      title: 'Email',
      icon: Mail,
      color: 'orange',
      detail: 'homecarre2405@gmail.com',
      subtext: 'Response within 24 Hours',
      action: 'Send Email',
      href: 'mailto:homecarre2405@gmail.com'
    },
    {
      title: 'Office',
      icon: Building,
      color: 'purple',
      detail: 'Krishna Talkies Road, Risali',
      subtext: 'Bhilai, Durg, Chhattisgarh 490006',
      action: 'View on Maps',
      href: '#map'
    }
  ];

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
  };

  return (
    <section className="py-20 bg-white relative -mt-8 rounded-t-[3rem] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
        >
          {cards.map((card, idx) => (
            <motion.a
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              key={idx}
              variants={fadeUp}
              className="group flex flex-col p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorStyles[card.color]}`}>
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-900 font-medium mb-1">{card.detail}</p>
              <p className="text-sm text-slate-500 mb-6">{card.subtext}</p>
              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                {card.action} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [createEnquiry] = useCreateEnquiryMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [formState, setFormState] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMsg('');

    try {
      await createEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        source: 'website',
        serviceCategory: serviceCategory || 'General',
        description: subject ? `${subject} - ${message}` : message,
        preferredDate: preferredDate || undefined,
        city: city || undefined,
      }).unwrap();

      setFormState('success');
      setName('');
      setPhone('');
      setEmail('');
      setCity('');
      setServiceCategory('');
      setPreferredDate('');
      setSubject('');
      setMessage('');
      setTimeout(() => setFormState('idle'), 5000);
    } catch (err) {
      setFormState('error');
      setErrorMsg(err.data?.message || err.message || 'Failed to submit enquiry. Please try again.');
      setTimeout(() => setFormState('idle'), 5000);
    }
  };

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="w-full lg:w-5/12 sticky top-32">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
            <p className="text-lg text-slate-600 mb-8">
              Fill out the form and our customer support team will get back to you within 24 hours. For faster resolution, please provide as much detail as possible.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <BsShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Data Privacy</h4>
                  <p className="text-sm text-slate-600">Your information is secure and never shared with third parties.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Fast Response</h4>
                  <p className="text-sm text-slate-600">We prioritize urgent queries and service bookings.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-xl border border-slate-200/50 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        required 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 91114 66642" 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="john@example.com" 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>
                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        required 
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none text-slate-700"
                      >
                        <option value="">Select City</option>
                        <option value="bhilai">Bhilai</option>
                        <option value="durg">Durg</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Service Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        required 
                        value={serviceCategory}
                        onChange={e => setServiceCategory(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none text-slate-700"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                        {categories.length === 0 && (
                          <>
                            <option value="Deep Cleaning">Deep Cleaning</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="AC & Appliances">AC & Appliances</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700" 
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="How can we help?" 
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your requirement in detail..." 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" required className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="consent" className="text-sm text-slate-600">
                    I agree to be contacted regarding my enquiry. I have read and agree to the Privacy Policy and Terms of Service.
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={formState === 'loading' || formState === 'success'}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                    ${formState === 'idle' ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20' : ''}
                    ${formState === 'loading' ? 'bg-blue-400 cursor-not-allowed' : ''}
                    ${formState === 'success' ? 'bg-green-500' : ''}
                    ${formState === 'error' ? 'bg-rose-500' : ''}
                  `}
                >
                  {formState === 'idle' && 'Send Enquiry'}
                  {formState === 'loading' && <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>}
                  {formState === 'success' && <><CheckCircle2 className="w-5 h-5" /> Message Sent Successfully!</>}
                  {formState === 'error' && 'Failed to send. Try again.'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Visit Our Office</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">We're centrally located and always happy to meet our customers in person.</p>
        </div>
        
        <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm bg-white mb-10 h-[400px] lg:h-[500px]">
          <iframe
            src="https://www.google.com/maps?q=Krishna+Talkies+Road,+Risali,+Bhilai,+Durg,+Chhattisgarh+490006&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-[#F8FAFC] rounded-3xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Office Address</h4>
            <p className="text-sm text-slate-600">Design Consultant, Krishna Talkies Road,<br/>Risali, Bhilai, Durg, Chhattisgarh 490006</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-[#F8FAFC] rounded-3xl">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <Car className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Parking & Access</h4>
            <p className="text-sm text-slate-600">Free visitor parking available.<br/>Near Risali, Bhilai</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-[#F8FAFC] rounded-3xl justify-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Krishna+Talkies+Road,+Risali,+Bhilai,+Durg,+Chhattisgarh+490006"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
            >
              <Navigation className="w-5 h-5" /> Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessHours() {
  const schedule = [
    { day: 'Monday', time: '9:00 AM – 8:00 PM' },
    { day: 'Tuesday', time: '9:00 AM – 8:00 PM' },
    { day: 'Wednesday', time: '9:00 AM – 8:00 PM' },
    { day: 'Thursday', time: '9:00 AM – 8:00 PM' },
    { day: 'Friday', time: '9:00 AM – 8:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 8:00 PM' },
    { day: 'Sunday', time: 'Emergency Support Only', isWeekend: true },
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Hours</h2>
          <p className="text-lg text-slate-600">We are open 6 days a week to serve you better.</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-100">
            {schedule.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <span className="font-medium text-slate-700">{item.day}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${item.isWeekend ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyContactUs() {
  const reasons = [
    { title: 'Quick Response', desc: 'Average response time of 5 minutes during business hours.', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100' },
    { title: 'Verified Support Team', desc: 'Speak to trained professionals, not bots.', icon: BsShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Professional Guidance', desc: 'Expert advice on which service best suits your needs.', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Transparent Communication', desc: 'No hidden costs, clear explanations always.', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Reach Out to Us?</h2>
          <p className="text-lg text-slate-600">We believe in making home maintenance hassle-free.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${r.bg} ${r.color}`}>
                <r.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{r.title}</h3>
              <p className="text-slate-600">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFAQs() {
  const faqs = [
    { q: 'How quickly will I receive a callback?', a: 'During business hours, our team aims to call back within 15 minutes of your enquiry submission.' },
    { q: 'Can I book through WhatsApp?', a: 'Yes! Simply click the WhatsApp button and chat with our automated bot or live agent to book a service.' },
    { q: 'How can I modify my booking?', a: 'You can call our support line or email us at least 2 hours prior to the scheduled service to modify your booking without any charges.' },
    { q: 'Do you provide emergency services?', a: 'Yes, we provide emergency support on Sundays and off-hours for critical plumbing and electrical issues subject to availability.' },
    { q: 'How do I track my booking?', a: 'Once booked, you will receive an SMS and WhatsApp message with tracking details and professional assignment.' },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Find quick answers to common queries.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-slate-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-slate-600">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Need Immediate Assistance?</h2>
            <p className="text-blue-100 text-lg mb-10">
              Book a trusted professional today or speak directly with our support team to get your home back in order.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/services" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Book Service Online
              </Link>
              <a href="tel:+919111466642" className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white border border-blue-500 font-bold rounded-2xl transition-all">
                Call Support Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function ContactPage() {
  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      <HeroSection />
      <ContactCards />
      <ContactForm />
      <MapSection />
      <BusinessHours />
      <WhyContactUs />
      <ContactFAQs />
      <FinalCTA />
      
      {/* Sticky Mobile Buttons (visible only on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden z-50 flex gap-4 pb-safe">
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
