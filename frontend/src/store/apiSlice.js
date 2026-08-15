import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Define our single API slice object
export const apiSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with BASE_URL
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        // Since the backend uses HTTP-only cookies for auth, we must include credentials
        credentials: 'include',
    }),
    // Define tag types for caching and invalidation
    tagTypes: [
        'Customer', 'Enquiry', 'Ticket', 'WorkOrder', 'Estimate', 'Invoice', 
        'Payment', 'Category', 'Service', 'Partner', 'Employee', 
        'Conversation', 'Feedback', 'Notification', 'Setting', 'Term'
    ],
    // The "endpoints" represent operations and requests for this server
    // We will inject endpoints from other files to avoid circular dependencies
    endpoints: () => ({}),
});
