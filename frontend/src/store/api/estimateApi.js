import { apiSlice } from '../apiSlice';

export const estimateApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEstimates: builder.query({
            query: (queryStr = '') => `/api/estimates${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Estimate', id: _id })), { type: 'Estimate', id: 'LIST' }]
                    : [{ type: 'Estimate', id: 'LIST' }],
        }),
        getCustomerEstimates: builder.query({
            query: () => `/api/estimates/me`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Estimate', id: _id })), { type: 'Estimate', id: 'LIST' }]
                    : [{ type: 'Estimate', id: 'LIST' }],
        }),
        getEstimateById: builder.query({
            query: (id) => `/api/estimates/${id}`,
            providesTags: (result, error, id) => [{ type: 'Estimate', id }],
        }),
        getMyEstimateById: builder.query({
            query: (id) => `/api/estimates/me/${id}`,
            providesTags: (result, error, id) => [{ type: 'Estimate', id }],
        }),
        createEstimate: builder.mutation({
            query: (data) => ({ url: '/api/estimates', method: 'POST', body: data }),
            invalidatesTags: (result, error, data) => [
                { type: 'Estimate', id: 'LIST' },
                ...(data.enquiryId ? [{ type: 'Enquiry', id: data.enquiryId }] : []),
            ],
        }),
        updateEstimate: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/estimates/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Estimate', id }, { type: 'Estimate', id: 'LIST' }],
        }),
        respondToMyEstimate: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/estimates/me/${id}/approval`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Estimate', id },
                { type: 'Estimate', id: 'LIST' },
                { type: 'Booking', id: 'LIST' },
            ],
        }),
        updateEstimateApproval: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/estimates/${id}/approval`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Estimate', id },
                { type: 'Estimate', id: 'LIST' },
                { type: 'Booking', id: 'LIST' },
                { type: 'Dashboard', id: 'STATS' },
            ],
        }),
        convertEstimateToBooking: builder.mutation({
            query: (id) => ({ url: `/api/estimates/${id}/convert`, method: 'POST' }),
            // Conversion writes a Booking and flips the estimate to Converted, so
            // both lists plus the dashboard aggregate go stale at once.
            invalidatesTags: (result, error, id) => [
                { type: 'Estimate', id },
                { type: 'Estimate', id: 'LIST' },
                { type: 'Booking', id: 'LIST' },
                { type: 'Dashboard', id: 'STATS' },
            ],
        }),
        deleteEstimate: builder.mutation({
            query: (id) => ({ url: `/api/estimates/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Estimate', id }, { type: 'Estimate', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetEstimatesQuery,
    useGetCustomerEstimatesQuery,
    useGetEstimateByIdQuery,
    useGetMyEstimateByIdQuery,
    useCreateEstimateMutation,
    useUpdateEstimateMutation,
    useUpdateEstimateApprovalMutation,
    useRespondToMyEstimateMutation,
    useConvertEstimateToBookingMutation,
    useDeleteEstimateMutation,
} = estimateApi;
