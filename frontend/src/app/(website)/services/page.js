'use client';

import React, { useState, useMemo } from 'react';
import { BsShieldCheck } from 'react-icons/bs';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  HelpCircle,
  SlidersHorizontal,
  ArrowRight,
  Tag,
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  Sparkle,
  Bug,
  Hammer
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONFIGURATION
// ==========================================

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: Sparkles },
  { id: 'cleaning', name: 'Deep Cleaning', icon: Sparkle },
  { id: 'ac', name: 'AC & Appliances', icon: Wind },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'painting', name: 'Painting', icon: Paintbrush },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer },
  { id: 'pest', name: 'Pest Control', icon: Bug },
];

const SERVICES_DATA = [
  {
    id: 'ac-jet-clean',
    name: 'AC Deep Foam & Jet Cleaning',
    category: 'AC & Appliances',
    categoryId: 'ac',
    rating: 4.88,
    reviewCount: 1420,
    price: 499,
    duration: '60 - 90 mins',
    description: '2x deeper cooling with high-pressure water jet cleaning for indoor and outdoor units.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    popular: true,
    inclusions: ['Indoor coil jet washing', 'Outdoor unit jet cleaning', 'Gas level check', 'Filter deep cleaning'],
    exclusions: ['Gas refilling charges', 'Spare parts replacement']
  },
  {
    id: 'full-home-clean',
    name: 'Full Home Deep Cleaning',
    category: 'Deep Cleaning',
    categoryId: 'cleaning',
    rating: 4.92,
    reviewCount: 2100,
    price: 2499,
    duration: '4 - 6 hours',
    description: 'Intensive deep sanitation for bedrooms, living room, balcony, kitchen, and washrooms.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    popular: true,
    inclusions: ['Floor mechanized scrubbing', 'Bathroom stain removal', 'Kitchen degreasing', 'Cobweb & window cleaning'],
    exclusions: ['Sofa/Mattress shampooing', 'Wall paint restoration']
  },
  {
    id: 'bathroom-clean',
    name: 'Bathroom Stain & Scale Removal',
    category: 'Deep Cleaning',
    categoryId: 'cleaning',
    rating: 4.81,
    reviewCount: 890,
    price: 449,
    duration: '45 - 60 mins',
    description: 'Hard water scale removal, tile scrubbing, mirror polishing, and disinfected fittings.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    popular: false,
    inclusions: ['Tile grout scrubbing', 'Tap & shower descaling', 'WC disinfection', 'Mirror polishing'],
    exclusions: ['Tile replacement', 'Major plumbing leak repair']
  },
  {
    id: 'switch-socket',
    name: 'Switchboard & Socket Installation',
    category: 'Electrical',
    categoryId: 'electrical',
    rating: 4.79,
    reviewCount: 650,
    price: 149,
    duration: '30 mins',
    description: 'Safe installation or replacement of modular switches, sockets, and MCB breakers.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
    popular: false,
    inclusions: ['Wiring safety check', 'Socket fitting', 'Post-installation test'],
    exclusions: ['Cost of new switchboards/materials']
  },
  {
    id: 'leak-fix',
    name: 'Pipe Leakage & Tap Repair',
    category: 'Plumbing',
    categoryId: 'plumbing',
    rating: 4.85,
    reviewCount: 940,
    price: 199,
    duration: '45 mins',
    description: 'Fixing dripping taps, concealed pipe leaks, flush tank faults, and drain blockages.',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800',
    popular: true,
    inclusions: ['Diagnosis of leak', 'Gasket & washer change', 'Flow pressure test'],
    exclusions: ['Major wall breaking/tiling', 'New sanitaryware cost']
  },
  {
    id: 'sofa-shampoo',
    name: 'Sofa & Fabric Upholstery Cleaning',
    category: 'Deep Cleaning',
    categoryId: 'cleaning',
    rating: 4.90,
    reviewCount: 1120,
    price: 899,
    duration: '2 hours',
    description: 'Mechanized vacuuming, foam shampooing, and extraction for stain-free hygienic seating.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    popular: true,
    inclusions: ['Dry vacuuming', 'Shampoo chemical spray', 'Moisture extraction', 'Deodorization'],
    exclusions: ['Torn fabric stitching', 'Permanent ink/acid burns']
  },
  {
    id: 'pest-cockroach',
    name: 'Advanced Cockroach & Pest Control',
    category: 'Pest Control',
    categoryId: 'pest',
    rating: 4.84,
    reviewCount: 780,
    price: 799,
    duration: '45 mins',
    description: 'Odorless gel baiting and spray treatment for kitchens and drains with 90-day warranty.',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800',
    popular: false,
    inclusions: ['Herbal gel application', 'Drainage spray', '90-day protection guarantee'],
    exclusions: ['Termite treatment', 'Rodent trapping']
  },
  {
    id: 'carpentry-furniture',
    name: 'Furniture Assembly & Repair',
    category: 'Carpentry',
    categoryId: 'carpentry',
    rating: 4.76,
    reviewCount: 510,
    price: 299,
    duration: '1 - 2 hours',
    description: 'Hinge adjustment, door lock fixing, bed assembly, and custom cabinet alignment.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    popular: false,
    inclusions: ['Precision drilling & fitting', 'Alignment check', 'Hardware installation'],
    exclusions: ['Raw wood material cost', 'Polishing/Varnishing']
  }
];

const SEARCH_SUGGESTIONS = [
  'AC Deep Jet Cleaning',
  'Full Home Deep Cleaning',
  'Bathroom Scale Removal',
  'Pipe Leakage Repair',
  'Sofa Shampooing',
  'Switchboard Fitting',
  'Pest Control Gel'
];

const FAQS = [
  {
    q: 'How does the 15-minute callback guarantee work?',
    a: 'Once you submit an enquiry, our centralized office operations team contacts you within 15 minutes to confirm scope, pricing, and dispatch time.'
  },
  {
    q: 'Are your service professionals background verified?',
    a: 'Yes! 100% of our service partners undergo mandatory Aadhaar background verification, police verification, and technical skill assessments.'
  },
  {
    q: 'Can I reschedule or cancel my booking?',
    a: 'You can reschedule or cancel your service request free of cost up to 2 hours before the scheduled time slot.'
  },
  {
    q: 'How do I receive the official GST invoice?',
    a: 'An itemized digital PDF invoice is automatically generated and sent to your registered email and WhatsApp as soon as the job is completed.'
  }
];

// ==========================================
// MAIN SERVICES PAGE COMPONENT (JSX)
// ==========================================

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchSuggestion] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const { data: liveServices = [] } = useGetServicesQuery();
  const { data: liveCategories = [] } = useGetCategoriesQuery();

  const allCategories = useMemo(() => {
    if (!liveCategories || liveCategories.length === 0) return CATEGORIES;
    const mapped = liveCategories.map(c => ({
      id: c._id || c.name.toLowerCase(),
      name: c.name,
      icon: Sparkle,
    }));
    return [{ id: 'all', name: 'All Services', icon: Sparkles }, ...mapped];
  }, [liveCategories]);

  const allServices = useMemo(() => {
    if (!liveServices || liveServices.length === 0) return SERVICES_DATA;
    return liveServices.map(s => ({
      id: s._id,
      name: s.name,
      category: s.categoryId?.name || 'General',
      categoryId: s.categoryId?._id || s.categoryId || 'all',
      rating: 4.9,
      reviewCount: 120,
      price: s.basePrice || 499,
      duration: '45 - 90 mins',
      description: s.description || 'Professional home care service with quality guarantee.',
      image: (s.images && s.images[0]) || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      popular: true,
      inclusions: ['Expert service delivery', 'Transparent pricing', 'Verified professional'],
      exclusions: ['Extra spare parts / consumables']
    }));
  }, [liveServices]);

  // Filtered Services Logic
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory || service.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allServices, selectedCategory, searchQuery]);

  const popularServices = useMemo(() => {
    return allServices.filter((s) => s.popular);
  }, [allServices]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#2563EB] selection:text-white">
      
      {/* ==========================================
          2. HERO SEARCH SECTION
      ========================================== */}
      <section className="relative bg-white pt-12 pb-16 border-b border-slate-200 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-7 rounded-full bg-blue-50 border border-blue-200/60 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> On-Demand Home Care
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4 leading-tight">
            Find & Book Professional <br className="hidden sm:block" />
            <span className="text-[#2563EB]">Home Services Instantly</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Verified specialists for AC repair, deep cleaning, plumbing, electrical, and painting. Transparent quotes with zero advance payment.
          </p>

          {/* Search Bar with Autocomplete Suggestions */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-slate-200 p-2 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all">
              <div className="flex items-center px-3 py-2 gap-2 text-slate-700 text-xs font-bold border-r border-slate-200 shrink-0">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <span>Bhilai - Durg</span>
              </div>

              <div className="flex-grow flex items-center px-3 gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchSuggestion(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search 'AC Repair', 'Sofa Clean', 'Leaking Tap'..."
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-[#0F172A] placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchSuggestion('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shrink-0">
                Search
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 text-left overflow-hidden"
                >
                  <div className="p-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 block">Suggested Searches</span>
                    {SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchSuggestion(item);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Filter Tag Pills */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-[11px] font-bold uppercase text-slate-400">Popular:</span>
            {['AC Jet Clean', 'Full House Clean', 'Bathroom Scale Fix', 'Pipe Leaks'].map((tag, i) => (
              <button
                key={i}
                onClick={() => setSearchSuggestion(tag)}
                className="bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-slate-600 px-3 py-1 rounded-full transition-colors border border-slate-200/60"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. STICKY CATEGORY FILTER BAR
      ========================================== */}
      <div className="sticky top-[61px] z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Scrollable Horizontal Pill List */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#2563EB]'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ==========================================
            4. POPULAR SERVICES CAROUSEL
        ========================================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Most Requested</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Popular Services in Bhilai-Durg</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const container = document.getElementById('popular-scroll');
                  if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-[#2563EB] text-slate-600 flex items-center justify-center shadow-sm transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const container = document.getElementById('popular-scroll');
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-[#2563EB] text-slate-600 flex items-center justify-center shadow-sm transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div id="popular-scroll" className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4">
            {popularServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -4 }}
                className="min-w-[280px] max-w-[280px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all shrink-0 flex flex-col justify-between"
              >
                <div className="relative h-36 w-full">
                  <Image src={service.image} alt={service.name} fill className="object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                    Popular
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-white backdrop-blur-md text-[11px] font-bold px-2 py-0.5 rounded border border-white/20">
                    ₹{service.price}
                  </span>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                      <span className="text-[10px] text-slate-400">({service.reviewCount})</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0F172A] line-clamp-1">{service.name}</h3>
                  </div>

                  <button
                    onClick={() => setSelectedServiceModal(service)}
                    className="w-full py-2 bg-blue-50 hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-bold rounded-xl text-xs transition border border-blue-200/60"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ==========================================
            5. MAIN SERVICES LAYOUT (SIDEBAR + GRID)
        ========================================== */}
        {/* MAIN SERVICE GRID */}
          <div className="space-y-6">
            
            {/* Grid Header Info */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing <strong>{filteredServices.length}</strong> service options</span>
              {selectedCategory !== 'all' && (
                <span className="bg-blue-50 text-[#2563EB] font-bold px-2.5 py-1 rounded-md border border-blue-200/60">
                  Filtered: {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>

            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-base text-[#0F172A]">No Services Matched Your Filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your budget slider or clearing search queries to explore all available services.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchSuggestion('');
                  }}
                  className="mt-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {CATEGORIES.filter(c => c.id !== 'all').map(category => {
                  const catServices = filteredServices.filter(s => s.categoryId === category.id);
                  if (catServices.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                          <category.icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-[#0F172A]">{category.name}</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {catServices.map((service) => (
                          <motion.div
                            key={service.id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -6 }}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                          >
                            <div>
                              {/* Image Container */}
                              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                                <Image src={service.image} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#0F172A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
                                  {service.category}
                                </span>

                                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md border border-white/20">
                                  ₹{service.price}
                                </span>
                              </div>

                              {/* Content Container */}
                              <div className="p-5 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="font-bold text-slate-800">{service.rating}</span>
                                    <span className="text-[10px] text-slate-400">({service.reviewCount})</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-slate-500 text-[11px] font-semibold">
                                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                                    <span>{service.duration}</span>
                                  </div>
                                </div>

                                <h3 className="font-bold text-base text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
                                  {service.name}
                                </h3>

                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                                  {service.description}
                                </p>
                              </div>
                            </div>

                            {/* Button Group */}
                            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setSelectedServiceModal(service)}
                                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition border border-slate-200/80 text-center"
                              >
                                Learn More
                              </button>
                              <button
                                onClick={() => setSelectedServiceModal(service)}
                                className="py-2.5 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition shadow-sm text-center"
                              >
                                Book Service
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* ==========================================
            6. WHY CHOOSE HOMECARE
        ========================================== */}
        <section className="mt-24 bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Guaranteed Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Why Homeowners Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                <BsShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">100% Background Verified</h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Mandatory Aadhaar and police verification for every service partner entering your home.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">Upfront Digital Estimates</h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Review and approve itemized PDF estimates before work starts. Zero hidden charges.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">7-Day Re-Service Warranty</h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Not completely satisfied? Our team will re-visit and rectify the issue free of charge.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            7. CUSTOMER SUPPORT CTA BANNER
        ========================================== */}
        <section className="mt-12 bg-gradient-to-br from-[#0F172A] via-[#1B3352] to-[#2563EB] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Need Assistance?</span>
            <h2 className="text-2xl sm:text-3xl font-bold">Unsure Which Service You Need?</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-md">
              Speak to our local Bhilai-Durg office team. We will help diagnose the issue and send the right specialist.
            </p>
          </div>

          <a
            href="tel:+919876543210"
            className="bg-white text-[#0F172A] hover:bg-slate-100 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-[#2563EB]" />
            <span>Call Office Customer Support</span>
          </a>
        </section>

        {/* ==========================================
            8. FREQUENTLY ASKED QUESTIONS
        ========================================== */}
        <section className="mt-24 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Got Questions?</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-[#0F172A] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-[#2563EB]' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ==========================================
          10. LEARN MORE / QUICK VIEW MODAL
      ========================================== */}
      <AnimatePresence>
        {selectedServiceModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedServiceModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col"
              >
                {/* Modal Header Image */}
                <div className="relative h-48 w-full shrink-0">
                  <Image src={selectedServiceModal.image} alt={selectedServiceModal.name} fill className="object-cover" />
                  <button
                    onClick={() => setSelectedServiceModal(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#2563EB] px-2.5 py-1 rounded-md border border-blue-200/60">
                      {selectedServiceModal.category}
                    </span>
                    <span className="text-sm font-extrabold text-[#0F172A]">₹{selectedServiceModal.price}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedServiceModal.name}</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{selectedServiceModal.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800">What is Included:</h4>
                    <div className="space-y-1.5">
                      {selectedServiceModal.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800">What is Excluded:</h4>
                    <div className="space-y-1.5">
                      {selectedServiceModal.exclusions.map((exc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{exc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer CTA */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                  <button
                    onClick={() => {
                      alert(`Enquiry created for ${selectedServiceModal.name}. Office team will call back!`);
                      setSelectedServiceModal(null);
                    }}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    Request Instant Callback
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          11. PREMIUM FOOTER
      ========================================== */}
      <footer className="w-full border-t border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 px-6 md:px-10 py-12 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold flex items-center justify-center text-sm">
                HC
              </div>
              <span className="text-lg font-bold text-[#0F172A]">HomeCare</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs font-light">
              © 2026 HomeCare Platform. Centralized Home Care Management for Bhilai, Durg, Risali & Charoda.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <a href="#" className="hover:text-[#2563EB] transition-colors">About Us</a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">Partner With Us</a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">Help & Support</a>
          </nav>
        </div>
      </footer>

    </div>
  );
}