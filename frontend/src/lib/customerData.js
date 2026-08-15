// Single mock data source for the whole customer portal — every page below
// reads from this instead of defining its own disconnected array, so a
// booking looks identical no matter which page you land on it from
// (Dashboard, My Services, Estimates, Invoices all point at the same records).
// Swap this file for real API calls once the backend is wired up; every page
// only imports the named exports below, not this array directly, to keep
// that swap contained to one file.

export const TIMELINE_STEPS = [
  'Enquiry Submitted',
  'Estimate Sent',
  'Estimate Approved',
  'Booking Confirmed',
  'Partner Assigned',
  'Technician On Route',
  'Work Started',
  'Completed',
];

export const MOCK_BOOKINGS = [
  {
    id: 'BK-8492',
    service: 'Deep Home Cleaning',
    category: 'Cleaning',
    icon: '🧹',
    status: 'active', // active | upcoming | completed | cancelled
    timelineStep: 5, // index into TIMELINE_STEPS — "Technician On Route"
    date: 'Oct 25, 2026',
    time: '10:00 AM',
    amount: 3500,
    address: 'B-204, Shanti Apartments, Sector 6, Bhilai',
    partner: { name: 'Amit Kumar', rating: 4.8, experience: '5 yrs' },
    estimate: { id: 'EST-4091', amount: 3500, status: 'Approved' },
    invoice: null,
  },
  {
    id: 'BK-8491',
    service: 'AC Repair & Service',
    category: 'AC & Appliance',
    icon: '❄️',
    status: 'upcoming',
    timelineStep: 3,
    date: 'Oct 26, 2026',
    time: '2:00 PM',
    amount: 1800,
    address: 'B-204, Shanti Apartments, Sector 6, Bhilai',
    partner: null,
    estimate: { id: 'EST-4092', amount: 1800, status: 'Approved' },
    invoice: null,
  },
  {
    id: 'BK-8490',
    service: 'Office Deep Cleaning',
    category: 'Cleaning',
    icon: '🧹',
    status: 'upcoming',
    timelineStep: 1,
    date: 'Oct 28, 2026',
    time: '9:00 AM',
    amount: 15000,
    address: 'Suite 4B, Nehru Nagar, Durg',
    partner: null,
    estimate: { id: 'EST-4093', amount: 15000, status: 'Pending', expiresIn: '2 days' },
    invoice: null,
  },
  {
    id: 'BK-8488',
    service: 'Plumbing Repair',
    category: 'Plumbing',
    icon: '🔧',
    status: 'completed',
    timelineStep: 7,
    date: 'Oct 15, 2026',
    time: '11:00 AM',
    amount: 1200,
    address: 'B-204, Shanti Apartments, Sector 6, Bhilai',
    partner: { name: 'Vikram Singh', rating: 4.6, experience: '3 yrs' },
    estimate: { id: 'EST-4085', amount: 1200, status: 'Approved' },
    invoice: { id: 'INV-2026-0068', amount: 1200, status: 'Paid', gst: 183 },
  },
  {
    id: 'BK-8487',
    service: 'AC Deep Cleaning',
    category: 'AC & Appliance',
    icon: '❄️',
    status: 'completed',
    timelineStep: 7,
    date: 'Oct 10, 2026',
    time: '3:00 PM',
    amount: 2499,
    address: 'B-204, Shanti Apartments, Sector 6, Bhilai',
    partner: { name: 'Amit Kumar', rating: 4.8, experience: '5 yrs' },
    estimate: { id: 'EST-4079', amount: 2499, status: 'Approved' },
    invoice: { id: 'INV-2026-0071', amount: 2499, status: 'Unpaid', gst: 381 },
  },
  {
    id: 'BK-8483',
    service: 'Pest Control',
    category: 'Pest Control',
    icon: '🐜',
    status: 'cancelled',
    timelineStep: 3,
    date: 'Oct 5, 2026',
    time: '10:00 AM',
    amount: 799,
    address: 'B-204, Shanti Apartments, Sector 6, Bhilai',
    partner: null,
    estimate: { id: 'EST-4071', amount: 799, status: 'Approved' },
    invoice: null,
    cancelReason: 'Rescheduled to a later date by customer',
  },
];

export const MOCK_ESTIMATES = [
  {
    id: 'EST-4091',
    bookingId: 'BK-8492',
    service: 'Deep Home Cleaning',
    status: 'Approved',
    amount: 3500,
    expiresIn: null,
    visitCharge: 250,
    discount: 150,
    lineItems: [
      { name: 'Deep Home Cleaning', qty: 1, price: 2500 },
      { name: 'Consumables', qty: 1, price: 750 },
    ],
  },
  {
    id: 'EST-4092',
    bookingId: 'BK-8491',
    service: 'AC Repair & Service',
    status: 'Approved',
    amount: 1800,
    expiresIn: null,
    visitCharge: 0,
    discount: 0,
    lineItems: [
      { name: 'Inspection and Diagnosis', qty: 1, price: 600 },
      { name: 'Repair Labour', qty: 1, price: 1200 },
    ],
  },
  {
    id: 'EST-4093',
    bookingId: 'BK-8490',
    service: 'Office Deep Cleaning',
    status: 'Pending',
    amount: 15000,
    expiresIn: '2 days',
    visitCharge: 500,
    discount: 0,
    lineItems: [
      { name: 'Office Deep Cleaning', qty: 1, price: 14500 },
    ],
  },
];

export const MOCK_INVOICES = MOCK_BOOKINGS.filter((b) => b.invoice).map((b) => ({
  ...b.invoice,
  bookingId: b.id,
  service: b.service,
  date: b.date,
}));

export const MOCK_PAYMENTS = [
  { id: 'PAY-9001', invoiceId: 'INV-2026-0068', amount: 1200, method: 'UPI', date: 'Oct 16, 2026', status: 'Verified' },
];

export const MOCK_ADDRESSES = [
  { id: 'ADDR-1', label: 'Home', line: 'B-204, Shanti Apartments, Sector 6, Bhilai', isDefault: true },
  { id: 'ADDR-2', label: 'Office', line: 'Suite 4B, Nehru Nagar, Durg', isDefault: false },
];

export const MOCK_PROFILE = {
  name: 'Priya Sharma',
  phone: '+91 98765 43210',
  email: 'priya.sharma@example.com',
  phoneVerified: true,
};

export const TIME_SLOTS = ['9 – 11', '11 – 1', '2 – 4', '4 – 6'];

export const SERVICE_CATALOG = [
  { category: 'Cleaning', name: 'Deep Home Cleaning', desc: 'Full-home deep sanitation, all rooms', priceFrom: 2499, duration: '4-6 hrs' },
  { category: 'Cleaning', name: 'Bathroom Deep Clean', desc: 'Stain and scale removal, disinfection', priceFrom: 449, duration: '45-60 min' },
  { category: 'AC & Appliance', name: 'AC Deep Cleaning', desc: 'Jet cleaning, indoor and outdoor unit', priceFrom: 499, duration: '60-90 min' },
  { category: 'AC & Appliance', name: 'AC Repair & Service', desc: 'Diagnosis, gas check, repair', priceFrom: 299, duration: '45-60 min' },
  { category: 'Plumbing', name: 'Pipe Leakage Repair', desc: 'Leak diagnosis and fix', priceFrom: 199, duration: '45 min' },
  { category: 'Electrical', name: 'Switchboard Installation', desc: 'Modular switch and socket fitting', priceFrom: 149, duration: '30 min' },
  { category: 'Pest Control', name: 'Cockroach & Pest Control', desc: 'Gel treatment, 90-day warranty', priceFrom: 799, duration: '45 min' },
];

export const MOCK_TERMS = {
  Cleaning: {
    version: 'v1.0',
    content:
      'Cleaning services may require access to water, electricity, and unobstructed work areas. Fragile or valuable items should be stored safely before the visit. Final scope, surface condition, and add-ons may affect execution time and pricing.',
  },
  'AC & Appliance': {
    version: 'v1.0',
    content:
      'AC and appliance services may require the unit to be reachable, powered off, and ready for inspection. Any replacement parts, gas refills, or additional repairs identified during the visit may change the final scope and cost.',
  },
  Plumbing: {
    version: 'v1.0',
    content:
      'Plumbing services depend on access to the affected fixture, pipeline, or drainage point. Hidden leakage, wall damage, or parts replacement may require a revised estimate after inspection and before work continues.',
  },
  Electrical: {
    version: 'v1.0',
    content:
      'Electrical services require a safe working environment and may involve power isolation before work begins. If wiring faults, load issues, or material replacement are discovered, the scope may be updated after diagnosis.',
  },
  'Pest Control': {
    version: 'v1.0',
    content:
      'Pest control services require the affected areas to be accessible and may include temporary movement of furniture or stored items. Treatment instructions, re-entry timing, and follow-up requirements depend on the selected category and infestation level.',
  },
};

export function findBooking(id) {
  return MOCK_BOOKINGS.find((b) => b.id === id) || null;
}

export function findEstimateById(id) {
  const estimate = MOCK_ESTIMATES.find((e) => e.id === id) || null;
  if (!estimate) return null;
  const booking = findBooking(estimate.bookingId);
  return booking ? { ...estimate, booking } : estimate;
}
