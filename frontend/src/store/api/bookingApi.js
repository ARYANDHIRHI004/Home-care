import { apiSlice } from '../apiSlice';

export const bookingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query({
            query: (queryStr = '') => `/api/bookings${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Booking', id: _id })), { type: 'Booking', id: 'LIST' }]
                    : [{ type: 'Booking', id: 'LIST' }],
        }),
        getCustomerBookings: builder.query({
            query: () => `/api/bookings/me`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Booking', id: _id })), { type: 'Booking', id: 'LIST' }]
                    : [{ type: 'Booking', id: 'LIST' }],
        }),
        getCustomerBookingById: builder.query({
            query: (id) => `/api/bookings/me/${id}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
        getBookingById: builder.query({
            query: (id) => `/api/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
        createBooking: builder.mutation({
            query: (data) => ({ url: '/api/bookings', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Booking', id: 'LIST' }, { type: 'Dashboard', id: 'STATS' }],
        }),
        updateBooking: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/bookings/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' },
                { type: 'Dashboard', id: 'STATS' },
            ],
        }),
        updateBookingStatus: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/bookings/${id}/status`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' },
                { type: 'Dashboard', id: 'STATS' },
            ],
        }),
        deleteBooking: builder.mutation({
            query: (id) => ({ url: `/api/bookings/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' },
                { type: 'Dashboard', id: 'STATS' },
            ],
        }),
    }),
});

export const {
    useGetBookingsQuery,
    useGetCustomerBookingsQuery,
    useGetCustomerBookingByIdQuery,
    useGetBookingByIdQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useUpdateBookingStatusMutation,
    useDeleteBookingMutation,
} = bookingApi;
