// Mock data for Revenue Report
export const monthlyRevenueData = [
    { month: 'Jan', revenue: 120000, expenses: 72000, collections: 98000 },
    { month: 'Feb', revenue: 145000, expenses: 81000, collections: 115000 },
    { month: 'Mar', revenue: 138000, expenses: 78000, collections: 122000 },
    { month: 'Apr', revenue: 162000, expenses: 91000, collections: 148000 },
    { month: 'May', revenue: 171000, expenses: 95000, collections: 155000 },
    { month: 'Jun', revenue: 155000, expenses: 88000, collections: 140000 },
    { month: 'Jul', revenue: 188000, expenses: 102000, collections: 168000 },
    { month: 'Aug', revenue: 205000, expenses: 110000, collections: 189000 },
    { month: 'Sep', revenue: 192000, expenses: 98000, collections: 178000 },
    { month: 'Oct', revenue: 220000, expenses: 115000, collections: 201000 },
    { month: 'Nov', revenue: 198000, expenses: 105000, collections: 180000 },
    { month: 'Dec', revenue: 235000, expenses: 118000, collections: 218000 },
];

export const categoryRevenueData = [
    { name: 'Deep Cleaning', value: 425000, color: '#2563EB' },
    { name: 'Pest Control', value: 310000, color: '#0891b2' },
    { name: 'Sofa Cleaning', value: 228000, color: '#6366f1' },
    { name: 'Painting', value: 185000, color: '#8b5cf6' },
    { name: 'Plumbing', value: 142000, color: '#a855f7' },
    { name: 'Electrical', value: 98000, color: '#d946ef' },
];

export const paymentMethodData = [
    { name: 'UPI', value: 52, color: '#2563EB' },
    { name: 'Cash', value: 22, color: '#10b981' },
    { name: 'Bank Transfer', value: 16, color: '#f59e0b' },
    { name: 'Card', value: 10, color: '#6366f1' },
];

export const topServices = [
    { service: '3BHK Deep Cleaning', bookings: 248, revenue: 425000, avgTicket: 1713 },
    { service: 'Pest Control (Full Home)', bookings: 186, revenue: 310000, avgTicket: 1667 },
    { service: 'Sofa & Carpet Cleaning', bookings: 152, revenue: 228000, avgTicket: 1500 },
    { service: 'Interior Painting', bookings: 74, revenue: 185000, avgTicket: 2500 },
    { service: 'Plumbing Service', bookings: 118, revenue: 142000, avgTicket: 1203 },
];

export const topCustomers = [
    { customer: 'Rahul Sharma', email: 'rahul@gmail.com', bookings: 18, revenue: 48500, outstanding: 0 },
    { customer: 'Sneha Patel', email: 'sneha@gmail.com', bookings: 14, revenue: 38900, outstanding: 2800 },
    { customer: 'Amit Verma', email: 'amit@gmail.com', bookings: 12, revenue: 32100, outstanding: 0 },
    { customer: 'Pooja Desai', email: 'pooja@gmail.com', bookings: 10, revenue: 28000, outstanding: 12000 },
    { customer: 'Vikram Singh', email: 'vikram@gmail.com', bookings: 9, revenue: 24500, outstanding: 0 },
];

export const recentPayments = [
    { invoice: 'INV-2023-001', customer: 'Rahul Sharma', amount: 2500, method: 'UPI', status: 'Paid', date: '24 Oct 2023' },
    { invoice: 'INV-2023-002', customer: 'Sneha Patel', amount: 4800, method: 'Cash', status: 'Partial', date: '24 Oct 2023' },
    { invoice: 'INV-2023-003', customer: 'Vikram Singh', amount: 1500, method: '-', status: 'Pending', date: '23 Oct 2023' },
    { invoice: 'INV-2023-004', customer: 'Pooja Desai', amount: 12000, method: 'Card', status: 'Failed', date: '22 Oct 2023' },
    { invoice: 'INV-2023-005', customer: 'Amit Verma', amount: 3200, method: 'Bank', status: 'Paid', date: '22 Oct 2023' },
];

export const summaryStats = {
    totalRevenue: 2129000,
    collectedAmount: 1948000,
    outstandingAmount: 181000,
    avgBookingValue: 1850,
    todayRevenue: 45200,
    monthlyGrowth: 11.4,
    netProfit: 1014000,
};

export const insights = {
    highestRevenueMonth: 'December',
    bestSellingService: '3BHK Deep Cleaning',
    highestPayingCustomer: 'Rahul Sharma',
    outstandingCollections: 181000,
    avgInvoiceValue: 1920,
};
