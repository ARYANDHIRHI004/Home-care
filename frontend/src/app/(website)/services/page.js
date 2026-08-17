'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useGetServicesQuery } from '@/store/api/serviceApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { useGetTermsQuery } from '@/store/api/termsApi';
import { authClient } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';

// Import New Modular Components
import TermsModal from '@/components/common/TermsModal';
import ServiceSearch from './components/ServiceSearch';
import CategoryTabs from './components/CategoryTabs';
import ServiceFilters from './components/ServiceFilters';
import ServiceCard from './components/ServiceCard';
import ServiceGrid from './components/ServiceGrid';
import EmptyState from './components/EmptyState';
import ServiceSection from './components/ServiceSection';


export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Seeded from ?q= — the site nav's search box hands off here instead of
  // duplicating its own filtering logic.
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [filters, setFilters] = useState({
    minRating: 0,
    availability: 'all',
    sort: 'popular' // 'popular', 'price_asc', 'price_desc', 'rating'
  });
  
  const [termsOpen, setTermsOpen] = useState(false);
  const [pendingBookingService, setPendingBookingService] = useState(null);

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: rawTerms = [] } = useGetTermsQuery('active=true');

  const { data: liveServices = [], isLoading: servicesLoading, isError: servicesError } = useGetServicesQuery();
  const { data: liveCategories = [] } = useGetCategoriesQuery();

  const termsByCategory = useMemo(() => {
    return rawTerms.reduce((acc, term) => {
      const categoryId = term.categoryId?._id || term.categoryId;
      acc[categoryId] = term;
      return acc;
    }, {});
  }, [rawTerms]);

  // Categories Mapping
  const allCategories = useMemo(() => {
    const mapped = (liveCategories || []).map(c => ({
      id: c._id || c.name.toLowerCase(),
      name: c.name,
      icon: Sparkles, // Can be dynamic based on category later
    }));
    return [{ id: 'all', name: 'All Services', icon: Sparkles }, ...mapped];
  }, [liveCategories]);

  const allServices = useMemo(() => {
    return liveServices.map(s => ({
      id: s._id,
      name: s.name,
      title: s.name,
      category: s.categoryId?.name || 'General',
      categoryId: s.categoryId?._id || s.categoryId || 'all',
      price: s.basePrice || 499,
      description: s.description || 'Professional home care service with quality guarantee.',
      image: (s.images && s.images[0]) || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      popular: true,
      inclusions: ['Expert service delivery', 'Transparent pricing', 'Verified professional'],
      exclusions: ['Extra spare parts / consumables']
    }));
  }, [liveServices]);

  // Filter & Search Logic
  const filteredServices = useMemo(() => {
    let result = allServices.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory || service.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.category.toLowerCase().includes(searchQuery.toLowerCase());
      // No rating field on the real Service model — don't let an absent
      // rating silently exclude every real service from a minRating filter.
      const matchesRating = !filters.minRating || (service.rating ?? 0) >= filters.minRating;
      const matchesAvailability = filters.availability === 'all' || (service.availability && service.availability.toLowerCase().includes(filters.availability));
      
      return matchesCategory && matchesSearch && matchesRating && matchesAvailability;
    });

    // Sort Logic
    if (filters.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'popular') {
      // Assuming 'popular' property or review count
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviewCount - a.reviewCount);
    }

    return result;
  }, [allServices, selectedCategory, searchQuery, filters]);

  const popularServices = useMemo(() => {
    return allServices.filter((s) => s.popular).slice(0, 6); // Limit to top 6
  }, [allServices]);

  const handleConfirmAndBook = (service) => {
    const hasTerms = termsByCategory[service.categoryId];
    setPendingBookingService(service);
    if (hasTerms) {
      setTermsOpen(true);
      setSelectedServiceModal(null);
    } else {
      // If no terms exist for this category, proceed directly
      proceedToBooking(service);
      setSelectedServiceModal(null);
    }
  };

  const proceedToBooking = (service) => {
    const returnUrl = `/customer/book?service=${encodeURIComponent(service.name)}`;
    if (session) {
      router.push(returnUrl);
    } else {
      router.push(`/login?from=${encodeURIComponent(returnUrl)}`);
    }
    setPendingBookingService(null);
  };

  const handleAcceptTerms = () => {
    const terms = termsByCategory[pendingBookingService?.categoryId];
    if (terms) {
      sessionStorage.setItem('preAcceptedTerms', JSON.stringify({
        categoryId: pendingBookingService.categoryId,
        version: terms.version,
        acceptedAt: new Date().toISOString(),
      }));
    }
    setTermsOpen(false);
    proceedToBooking(pendingBookingService);
  };

  const handleDeclineTerms = () => {
    setTermsOpen(false);
    // Return to the service modal
    setSelectedServiceModal(pendingBookingService);
    setPendingBookingService(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#2563EB] selection:text-white pb-20">
      
      {/* 1. HERO & SEARCH */}
      <section className="relative bg-white pt-16 pb-12 border-b border-slate-200 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Book Professional <br className="hidden sm:block" />
            <span className="text-[#2563EB]">Home Services</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Choose from verified professionals across multiple home service categories. Transparent pricing, instant booking.
          </p>
          <ServiceSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            suggestions={allServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)}
            onSuggestionClick={(name) => {
              setSearchQuery(name);
              setShowSuggestions(false);
            }}
          />
        </div>
      </section>

      {/* 2. CATEGORY NAVIGATION */}
      <CategoryTabs 
        categories={allCategories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3. MOST BOOKED SERVICES (Only show if no search/filter is heavily applied) */}
        {!searchQuery && selectedCategory === 'all' && !servicesLoading && !servicesError && popularServices.length > 0 && (
          <ServiceSection title="Most Booked Services">
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x">
              {popularServices.map((service) => (
                <div key={service.id} className="min-w-[300px] max-w-[300px] sm:min-w-[320px] snap-start">
                  <ServiceCard 
                    service={service} 
                    onViewDetails={setSelectedServiceModal} 
                    onBookNow={setSelectedServiceModal} 
                  />
                </div>
              ))}
            </div>
          </ServiceSection>
        )}

        {/* 4. MAIN SERVICE LISTING */}
        <ServiceSection 
          title={selectedCategory === 'all' && !searchQuery ? 'Explore All Services' : 'Search Results'} 
          subtitle={filteredServices.length > 0 ? `${filteredServices.length} services available` : ''}
        >
          <ServiceFilters filters={filters} setFilters={setFilters} />

          {servicesLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
              <p className="text-sm font-medium">Loading services…</p>
            </div>
          ) : servicesError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <p className="text-sm font-medium text-slate-600">Couldn&apos;t load services right now — please try again shortly.</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <EmptyState onReset={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilters({ minRating: 0, availability: 'all', sort: 'popular' });
            }} />
          ) : (
            <ServiceGrid>
              <AnimatePresence>
                {filteredServices.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onViewDetails={setSelectedServiceModal} 
                    onBookNow={setSelectedServiceModal} 
                  />
                ))}
              </AnimatePresence>
            </ServiceGrid>
          )}
        </ServiceSection>

      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selectedServiceModal && (
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
              <div className="relative h-48 w-full shrink-0">
                <Image src={selectedServiceModal.image} alt={selectedServiceModal.name} fill className="object-cover" />
                <button
                  onClick={() => setSelectedServiceModal(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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

              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => handleConfirmAndBook(selectedServiceModal)}
                  className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
                >
                  Confirm & Book Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TermsModal
        isOpen={termsOpen && pendingBookingService}
        categoryName={pendingBookingService?.category}
        terms={termsByCategory[pendingBookingService?.categoryId]}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />

    </div>
  );
}