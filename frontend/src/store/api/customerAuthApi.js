import { apiSlice } from '../apiSlice';

export const customerAuthApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // PATCH /api/auth/customer/profile — session-derived on the backend,
        // so no user id is ever sent from here. Returns the updated
        // session-shaped user object so callers can update local state
        // without a full getSession() round-trip.
        updateProfile: builder.mutation({
            query: (data) => ({ url: '/api/auth/customer/profile', method: 'PATCH', body: data }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const { useUpdateProfileMutation } = customerAuthApi;
