'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { motion, AnimatePresence } from 'framer-motion';
import { BsShieldCheck } from 'react-icons/bs';
import { FiClock, FiLock, FiHeadphones, FiFileText } from 'react-icons/fi';
import {
  Zap,
  Wrench,
  Paintbrush,
  Hammer,
  Wind,
  Tv,
  Bug,
  Droplets,
  ChevronDown,
  Phone,
  ArrowRight,
  UserCheck,
  DollarSign,
  Smile,
  ChevronRight,
  Smartphone,
  MapPin,
  Lock,
  Building,
  Heart,
  Eye,
  Check,
  X,
  SlidersHorizontal,
  Download,
  QrCode,
  MessageCircle,
  FileCheck,
  Receipt,
  Sparkles,
  Star,
  CheckCircle2
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONFIGURATION
// ==========================================

const SERVICE_CATEGORIES = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    price: '₹499',
    description: 'Deep bathroom, kitchen & full house sanitization by experts.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'electrical',
    name: 'Electrical Fixes',
    price: '₹99',
    description: 'Wiring, switchboards, fan fittings, and emergency repairs.',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'plumbing',
    name: 'Plumbing Solutions',
    price: '₹99',
    description: 'Pipe leaks, tap replacement, drainage & motor installations.',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'painting',
    name: 'House Painting',
    price: '₹9/sq.ft',
    description: 'Waterproofing, texture painting, and interior/exterior renewal.',
    icon: Paintbrush,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'carpentry',
    name: 'Carpentry Repairs',
    price: '₹149',
    description: 'Door lock repair, custom furniture assembly, and hinges fix.',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ac-service',
    name: 'AC Servicing & Jet Clean',
    price: '₹399',
    category: 'Cooling',
    description: 'Foam jet cleaning, gas check, and cooling repair.',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    price: '₹249',
    description: 'Washing machine, refrigerator, microwave & RO repair.',
    icon: Tv,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    price: '₹799',
    description: 'Odourless, eco-friendly cockroach, termite & bed bug removal.',
    icon: Bug,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'deep-cleaning',
    name: 'Full Home Deep Clean',
    price: '₹1,999',
    description: 'Complete floor scrubbing, cobweb removal, and balcony washing.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'water-tank',
    name: 'Water Tank Cleaning',
    price: '₹599',
    description: '4-stage mechanized cleaning for overhead and sump tanks.',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=600',
  },
];

const WHY_CHOOSE_US = [
  {
    title: 'Verified Professionals',
    description: 'Aadhaar and police-background verified staff trained in hospitality etiquette.',
    icon: UserCheck,
  },
  {
    title: 'Transparent Pricing',
    description: 'Fixed rate cards and digital estimates. No surprise costs or post-service hikes.',
    icon: DollarSign,
  },
  {
    title: 'Fast Response Guarantee',
    description: 'Get an executive callback in under 15 minutes with same-day slot allocation.',
    icon: FiClock,
  },
  {
    title: '100% Satisfaction or Re-Service',
    description: '7-day service warranty on all jobs with free re-service if you are unsatisfied.',
    icon: Smile,
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Request', desc: 'Pick a service & submit your requirement.', icon: FileCheck },
  { step: '02', title: 'We Call to Confirm', desc: 'Office team calls within 15 mins with a fixed estimate.', icon: FiHeadphones },
  { step: '03', title: 'Service Done', desc: 'Verified professional completes the job on schedule.', icon: UserCheck },
  { step: '04', title: 'Pay', desc: 'Pay via UPI/Cash & get a digital GST invoice.', icon: Receipt },
];

const QUICK_CATEGORIES = [
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'plumbing', name: 'Plumbing', icon: Wrench },
  { id: 'ac-service', name: 'AC Service', icon: Wind },
  { id: 'painting', name: 'Painting', icon: Paintbrush },
];

const STATS = [
  { label: 'Bookings Completed', value: 10000, suffix: '+' },
  { label: 'Average Rating', value: 4.9, suffix: '★', isDecimal: true },
  { label: 'Verified Professionals', value: 50, suffix: '+' },
  { label: 'Avg Response Time', value: 15, suffix: ' Mins' },
  { label: 'Customer Satisfaction', value: 98, suffix: '%' },
];

const BEFORE_AFTER_DATA = [
  {
    title: 'Kitchen Deep Cleaning',
    subtitle: 'Oil & grease stain removal with mechanized degreasing jet.',
    before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', // Visually represented in slider
  },
  {
    title: 'Bathroom Restoration',
    subtitle: 'Hard water scale scrubbing and grout whitening.',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Sofa Fabric Renewal',
    subtitle: 'Shampoo extraction cleaning for velvet & linen sofas.',
    before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Verma',
    city: 'Bhilai - Durg',
    rating: 5,
    review: 'The full house deep cleaning team was extremely polite and thorough. They spent 5 hours and made the tiles shine like new.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Vikramjit Singh',
    city: 'Bhilai',
    rating: 5,
    review: 'Plumber came with proper tools, identified the hidden pipe leakage, and fixed it without damaging the surrounding wall.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Ananya Deshmukh',
    city: 'Durg',
    rating: 5,
    review: 'Used their water tank cleaning service. Mechanized 4-step process made the sump tank completely silt-free. Highly recommended.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
];

const FAQS = [
  {
    q: 'How quickly will I receive a call after placing an enquiry?',
    a: 'Our customer support office team contacts you within 10–15 minutes of receiving your request to discuss scope and confirm the estimate.',
  },
  {
    q: 'Are your service partners background checked?',
    a: 'Yes, 100% of our professionals undergo mandatory Aadhaar verification, police background checks, and skill certifications before joining.',
  },
  {
    q: 'Are there any hidden visit charges?',
    a: 'No. All estimates and visit charges are shared upfront via a digital quotation. You only pay what you approve.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We support all major payment modes including Cash, UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and online payment via Razorpay.',
  },
  {
    q: 'Do I get an official GST invoice?',
    a: 'Yes! An automated PDF GST invoice is sent directly to your email and WhatsApp immediately upon service completion and payment.',
  },
  {
    q: 'What if I am not satisfied with the service provided?',
    a: 'We offer a 7-day hassle-free service guarantee. If you notice any defects or issues, we send a technician for a free re-service.',
  },
];

// ==========================================
// COMPONENT
// ==========================================

export default function HomeServiceLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);  
  const [activeFaq, setActiveFaq] = useState(null);
  const [sliderPos, setSliderPos] = useState({ 0: 50, 1: 50, 2: 50 });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rawServices = [], isLoading, isError } = useGetServicesQuery();

  const filteredServices = rawServices.filter((s) => 
    s.active && 
    (searchQuery 
      ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.categoryId?.name && s.categoryId.name.toLowerCase().includes(searchQuery.toLowerCase())) 
      : true)
  );

  const servicesByCategory = filteredServices.reduce((acc, s) => {
    const cat = s.categoryId?.name || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  // Handle sticky header scroll transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111827] font-['Inter',sans-serif] selection:bg-[#2563EB] selection:text-white">
      {/* ==========================================
          1. CONTENT
      ========================================== */}
      {/* ==========================================
          2. HERO SECTION
      ========================================== */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/60 text-[#2563EB] text-xs font-semibold">
                <BsShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Premier Home Service Management Platform</span>
              </div>

              <h1 className="font-['Poppins',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.12]">
                Professional Home Services <br className="hidden sm:block" />
                <span className="text-[#2563EB]">You Can Trust.</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Book verified professionals for cleaning, plumbing, electrical, painting, appliance repair and more. Fast response. Transparent pricing. Guaranteed quality.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <span>Book Service Now</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+919111466642"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#111827] font-semibold text-base px-8 py-4 rounded-xl border border-[#E5E7EB] shadow-sm transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us Directly</span>
                </a>
              </div>

              {/* Quick Category Picker — first interaction is "find my service" */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                {QUICK_CATEGORIES.map((cat) => (
                  <a
                    key={cat.id}
                    href="#services"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-blue-50 border border-[#E5E7EB] hover:border-blue-200 text-xs font-semibold text-gray-700 hover:text-[#2563EB] shadow-sm transition-colors"
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </a>
                ))}
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-left max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">4.9 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-medium text-gray-700">10,000+ Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-medium text-gray-700">GST Registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-medium text-gray-700">Verified Pros</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-medium text-gray-700">Invoice Provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-medium text-gray-700">No Hidden Charges</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual & Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 bg-white">
                  <img
                    src="https://ik.imagekit.io/bs0ovnamh/heroImage"
                    alt="Home Service Professional"
                    className="w-full h-[460px] object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-semibold bg-[#10B981] text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Active Dispatch
                    </span>
                    <h3 className="font-['Poppins',sans-serif] text-xl font-bold">Uniformed Service Crew</h3>
                    <p className="text-xs text-gray-200 font-light">Equipped with specialized mechanized tools & safety gear.</p>
                  </div>
                </div>

                {/* Floating Info Card 1: Booking Confirmed */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-xl hidden sm:flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Booking Confirmed</p>
                    <p className="text-[11px] text-gray-500">Ticket #HC-8821 Assigned</p>
                  </div>
                </motion.div>

                {/* Floating Info Card 2: Verified Professional */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/3 -right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-gray-200 shadow-xl hidden sm:flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Verified Expert</p>
                    <p className="text-[11px] text-gray-500">Aadhaar & Police Cleared</p>
                  </div>
                </motion.div>

                {/* Floating Info Card 3: Live Tracking */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-xl hidden sm:flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F97316] shrink-0">
                    <FiClock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Estimated Arrival</p>
                    <p className="text-[11px] font-semibold text-[#F97316]">15 Mins · Live Dispatch</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SERVICE CATEGORIES GRID
      ========================================== */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Our Service Offerings
            </span>
            <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
              Explore Premium Home Services
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Select a category to request an instant callback and transparent quotation.
            </p>
            <div className="relative max-w-md mx-auto mt-6">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <input
                 type="text"
                 placeholder="Search for a service..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none shadow-sm transition-all text-sm"
               />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Loading services...</div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500">Error loading services. Please try again later.</div>
          ) : Object.keys(servicesByCategory).length === 0 ? (
            <div className="py-20 text-center text-gray-500">No services found matching your search.</div>
          ) : (
            <div className="space-y-16">
              {Object.entries(servicesByCategory).map(([cat, services]) => (
                <div key={cat}>
                  <h3 className="font-['Poppins',sans-serif] text-xl font-bold text-[#111827] mb-6 border-b border-[#E5E7EB] pb-2 flex items-center gap-2">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {services.map((service) => (
                      <motion.div
                        key={service._id}
                        whileHover={{ y: -6 }}
                        className="group bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-36 w-full rounded-xl overflow-hidden mb-4 bg-gray-100 border border-gray-100">
                            {service.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={service.images[0]}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                                <Sparkles className="w-8 h-8 opacity-50" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-['Poppins',sans-serif] font-bold text-base text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                              {service.name}
                            </h3>
                          </div>

                          <p className="text-xs text-gray-500 font-medium mb-2">Starts at <span className="text-gray-900 font-bold">₹{service.basePrice}</span></p>

                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                            {service.description || 'Professional home care service by verified experts.'}
                          </p>
                        </div>

                        <Link
                          href="/customer/book"
                          className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#F97316] text-[#111827] hover:text-white font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5 group-hover:shadow-md"
                        >
                          <span>Book Now</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          4. HOW IT WORKS — condensed strip
      ========================================== */}
      <section id="how-it-works" className="py-14 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#111827]">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={step.step} className="relative flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Poppins',sans-serif] font-bold text-sm text-[#111827]">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-snug mt-0.5">{step.desc}</p>
                </div>
                {idx < PROCESS_STEPS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-5 -translate-y-1/2 w-4 h-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. TRUST BADGES
      ========================================== */}
      <section className="py-20 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mb-6">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-['Poppins',sans-serif] font-bold text-lg text-[#111827] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TESTIMONIALS & REVIEWS
      ========================================== */}
      <section className="py-24 bg-[#F8FAFC] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Customer Feedback
            </span>
            <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
              Loved by Homeowners in Bhilai-Durg
            </h2>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <span className="font-bold text-sm text-gray-900">Google Review Verified</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-600">4.9 / 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    "{review.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                  <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-['Poppins',sans-serif] font-bold text-xs text-[#111827]">{review.name}</h4>
                    <p className="text-[11px] text-gray-400">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. TRUST & SAFETY (LARGE SECTION)
      ========================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Safety First Policy
            </span>
            <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
              Complete Protection For Your Home
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Police Verified Staff', icon: BsShieldCheck, desc: 'Official background checks on all technicians.' },
              { title: 'Background Verification', icon: UserCheck, desc: 'Aadhaar & permanent address logged.' },
              { title: 'GST Registered', icon: FiFileText, desc: 'Compliant tax invoices for all orders.' },
              { title: 'Invoice Provided', icon: Download, desc: 'Automated WhatsApp & Email PDF bills.' },
              { title: 'Secure Online Payments', icon: FiLock, desc: '256-bit encrypted Razorpay checkout.' },
              
              { title: 'Uniformed Professionals', icon: UserCheck, desc: 'Standardized ID badges & carrying toolkits.' },
              { title: '24/7 Support Desk', icon: FiHeadphones, desc: 'Dedicated helpline for booking queries.' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] text-center space-y-2">
                <item.icon className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
                <h3 className="font-['Poppins',sans-serif] font-bold text-sm text-[#111827]">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. BEFORE & AFTER GALLERY — optional secondary content, below the fold
      ========================================== */}
      <section className="py-24 bg-[#F8FAFC] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Proven Results
            </span>
            <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
              Real Transformation Results
            </h2>
            <p className="text-base text-gray-600">
              Drag the comparison slider on our modern deep cleaning results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BEFORE_AFTER_DATA.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-64 w-full select-none overflow-hidden">
                  {/* Before Image (Base) */}
                  <img src={item.before} alt="Before" className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">BEFORE</span>

                  {/* After Image (Clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `polygon(0 0, ${sliderPos[idx] || 50}% 0, ${sliderPos[idx] || 50}% 100%, 0 100%)` }}
                  >
                    <img src={item.after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded">AFTER</span>
                  </div>

                  {/* Interactive Slider Bar */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos[idx] || 50}
                    onChange={(e) => setSliderPos({ ...sliderPos, [idx]: Number(e.target.value) })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20 pointer-events-none"
                    style={{ left: `${sliderPos[idx] || 50}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-['Poppins',sans-serif] font-bold text-base text-[#111827]">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FAQ (ACCORDION)
      ========================================== */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Got Questions?
            </span>
            <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold text-[#111827]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-['Poppins',sans-serif] font-bold text-base text-[#111827] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-[#2563EB]' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          10. FINAL CTA BANNER
      ========================================== */}
      <section id="book" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 lg:p-16 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3.5 py-1 rounded-full border border-white/20">
              Fast Dispatch
            </span>
            <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-white">
              Need Professional Home Service Today?
            </h2>
            <p className="text-base text-blue-100">
              Book in less than 60 seconds. Our office team will call you back to confirm your estimate.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full lg:w-auto">
            <Link
              href="/customer/book"
              className="w-full sm:w-auto bg-[#F97316] hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all text-center"
            >
              Book Service Now
            </Link>
            <a
              href="tel:+919111466642"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us Directly</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}