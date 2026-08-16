import {
  Sparkles,
  Sparkle,
  Wind,
  Droplets,
  Zap,
  Paintbrush,
  Hammer,
  Bug
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: Sparkles },
  { id: 'cleaning', name: 'Deep Cleaning', icon: Sparkle },
  { id: 'ac', name: 'AC & Appliances', icon: Wind },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'painting', name: 'Painting', icon: Paintbrush },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer },
  { id: 'pest', name: 'Pest Control', icon: Bug },
];

export const SERVICES_DATA = [
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

export const FAQS = [
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
