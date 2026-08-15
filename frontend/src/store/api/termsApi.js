import { apiSlice } from '../apiSlice';

export const termsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTerms: builder.query({
            query: (queryStr = '') => `/api/terms-and-conditions${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Term', id: _id })), { type: 'Term', id: 'LIST' }]
                    : [{ type: 'Term', id: 'LIST' }],
        }),
        getTermsById: builder.query({
            query: (id) => `/api/terms-and-conditions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Term', id }],
        }),
        getActiveTermsByCategory: builder.query({
            query: (categoryId) => `/api/terms-and-conditions/category/${categoryId}/active`,
            providesTags: (result, error, categoryId) => [{ type: 'Term', id: `CAT_${categoryId}` }],
        }),
        createTerms: builder.mutation({
            query: (data) => ({ url: '/api/terms-and-conditions', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Term', id: 'LIST' }],
        }),
        updateTerms: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/terms-and-conditions/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Term', id }, { type: 'Term', id: 'LIST' }],
        }),
        activateTerms: builder.mutation({
            query: (id) => ({ url: `/api/terms-and-conditions/${id}/activate`, method: 'PATCH', body: {} }),
            invalidatesTags: [{ type: 'Term', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTermsQuery,
    useGetTermsByIdQuery,
    useGetActiveTermsByCategoryQuery,
    useCreateTermsMutation,
    useUpdateTermsMutation,
    useActivateTermsMutation,
} = termsApi;
