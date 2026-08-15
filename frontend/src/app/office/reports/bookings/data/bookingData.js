// Mock data for Booking Report

export const dailyBookingData = [
    { day: 'Mon', bookings: 42, completed: 38, cancelled: 4 },
    { day: 'Tue', bookings: 56, completed: 51, cancelled: 5 },
    { day: 'Wed', bookings: 48, completed: 44, cancelled: 4 },
    { day: 'Thu', bookings: 62, completed: 57, cancelled: 5 },
    { day: 'Fri', bookings: 71, completed: 65, cancelled: 6 },
    { day: 'Sat', bookings: 88, completed: 79, cancelled: 9 },
    { day: 'Sun', bookings: 35, completed: 32, cancelled: 3 },
];

export const bookingByCategoryData = [
    { name: 'Deep Cleaning', value: 312, color: '#2563EB' },
    { name: 'Pest Control', value: 228, color: '#0891b2' },
    { name: 'Sofa Cleaning', value: 176, color: '#6366f1' },
    { name: 'Painting', value: 98, color: '#8b5cf6' },
    { name: 'Plumbing', value: 134, color: '#a855f7' },
    { name: 'Electrical', value: 86, color: '#d946ef' },
];

export const bookingStatusData = [
    { name: 'Completed', value: 68, color: '#10b981' },
    { name: 'In Progress', value: 12, color: '#2563EB' },
    { name: 'Pending', value: 10, color: '#f59e0b' },
    { name: 'Cancelled', value: 10, color: '#f87171' },
];

export const bookingBySourceData = [
    { source: 'Website', bookings: 412, color: '#2563EB' },
    { source: 'WhatsApp', bookings: 318, color: '#10b981' },
    { source: 'Phone', bookings: 204, color: '#f59e0b' },
    { source: 'Referral', bookings: 100, color: '#6366f1' },
];

export const partnerWorkloadData = [
    { partner: 'Suresh K.', assigned: 48, completed: 44 },
    { partner: 'Ravi S.', assigned: 42, completed: 39 },
    { partner: 'Priya T.', assigned: 36, completed: 35 },
    { partner: 'Mohan D.', assigned: 31, completed: 28 },
    { partner: 'Anjali R.', assigned: 28, completed: 27 },
];

export const recentBookings = [
    { id: 'BKG-2401', customer: 'Rahul Sharma', service: '3BHK Deep Cleaning', partner: 'Suresh Kumar', status: 'Completed', amount: 2500, date: '24 Oct 2023' },
    { id: 'BKG-2402', customer: 'Sneha Patel', service: 'Pest Control', partner: 'Ravi Sharma', status: 'In Progress', amount: 1800, date: '24 Oct 2023' },
    { id: 'BKG-2403', customer: 'Vikram Singh', service: 'Sofa Cleaning', partner: 'Unassigned', status: 'Pending', amount: 1200, date: '23 Oct 2023' },
    { id: 'BKG-2404', customer: 'Pooja Desai', service: 'Interior Painting', partner: 'Mohan Das', status: 'Cancelled', amount: 8000, date: '22 Oct 2023' },
    { id: 'BKG-2405', customer: 'Amit Verma', service: 'Plumbing', partner: 'Priya Tiwari', status: 'Completed', amount: 900, date: '22 Oct 2023' },
    { id: 'BKG-2406', customer: 'Kavita Joshi', service: 'Electrical Work', partner: 'Suresh Kumar', status: 'Completed', amount: 1100, date: '21 Oct 2023' },
];

export const topServices = [
    { service: '3BHK Deep Cleaning', bookings: 312, completionRate: 94, revenue: 425000 },
    { service: 'Pest Control (Full Home)', bookings: 228, completionRate: 91, revenue: 310000 },
    { service: 'Sofa & Carpet Cleaning', bookings: 176, completionRate: 96, revenue: 228000 },
    { service: 'Interior Painting', bookings: 98, completionRate: 88, revenue: 185000 },
    { service: 'Plumbing Service', bookings: 134, completionRate: 93, revenue: 142000 },
];

export const topPartners = [
    { partner: 'Suresh Kumar', completedJobs: 248, rating: 4.9, acceptanceRate: 97 },
    { partner: 'Ravi Sharma', completedJobs: 198, rating: 4.8, acceptanceRate: 94 },
    { partner: 'Priya Tiwari', completedJobs: 175, rating: 4.9, acceptanceRate: 98 },
    { partner: 'Mohan Das', completedJobs: 142, rating: 4.6, acceptanceRate: 89 },
    { partner: 'Anjali Raje', completedJobs: 128, rating: 4.7, acceptanceRate: 92 },
];

export const summaryStats = {
    totalBookings: 1034,
    completedJobs: 712,
    pendingJobs: 104,
    cancelledBookings: 98,
    completionRate: 92.4,
    avgCompletionTime: '2.4 hrs',
    repeatCustomers: 38,
};

export const insights = {
    mostBookedService: '3BHK Deep Cleaning',
    peakBookingDay: 'Saturday',
    fastestPartner: 'Priya Tiwari',
    highestCancellationCategory: 'Interior Painting',
    repeatCustomerPercentage: 38,
};
