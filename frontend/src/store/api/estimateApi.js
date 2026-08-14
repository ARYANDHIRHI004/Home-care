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
        getEstimateById: builder.query({
            query: (id) => `/api/estimates/${id}`,
            providesTags: (result, error, id) => [{ type: 'Estimate', id }],
        }),
        createEstimate: builder.mutation({
            query: (data) => ({ url: '/api/estimates', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Estimate', id: 'LIST' }],
        }),
        updateEstimate: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/estimates/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Estimate', id }, { type: 'Estimate', id: 'LIST' }],
        }),
        updateEstimateApproval: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/estimates/${id}/approval`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Estimate', id }, { type: 'Estimate', id: 'LIST' }],
        }),
        deleteEstimate: builder.mutation({
            query: (id) => ({ url: `/api/estimates/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Estimate', id }, { type: 'Estimate', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetEstimatesQuery,
    useGetEstimateByIdQuery,
    useCreateEstimateMutation,
    useUpdateEstimateMutation,
    useUpdateEstimateApprovalMutation,
    useDeleteEstimateMutation,
} = estimateApi;
