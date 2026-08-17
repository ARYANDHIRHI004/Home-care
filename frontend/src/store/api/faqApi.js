import { apiSlice } from '../apiSlice';

export const faqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query({
            query: (queryStr = '') => `/api/faqs${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Faq', id: _id })), { type: 'Faq', id: 'LIST' }]
                    : [{ type: 'Faq', id: 'LIST' }],
        }),
        getFaqById: builder.query({
            query: (id) => `/api/faqs/${id}`,
            providesTags: (result, error, id) => [{ type: 'Faq', id }],
        }),
        createFaq: builder.mutation({
            query: (data) => ({ url: '/api/faqs', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
        }),
        // Public — a website visitor suggesting a question. Enters the
        // review queue as 'pending', invisible on the public site until an
        // admin answers and publishes it via updateFaq.
        suggestFaq: builder.mutation({
            query: (data) => ({ url: '/api/faqs/suggest', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
        }),
        updateFaq: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/faqs/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Faq', id }, { type: 'Faq', id: 'LIST' }],
        }),
        toggleFaq: builder.mutation({
            query: (id) => ({ url: `/api/faqs/${id}/toggle`, method: 'PATCH', body: {} }),
            invalidatesTags: (result, error, id) => [{ type: 'Faq', id }, { type: 'Faq', id: 'LIST' }],
        }),
        deleteFaq: builder.mutation({
            query: (id) => ({ url: `/api/faqs/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Faq', id }, { type: 'Faq', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetFaqsQuery,
    useGetFaqByIdQuery,
    useCreateFaqMutation,
    useSuggestFaqMutation,
    useUpdateFaqMutation,
    useToggleFaqMutation,
    useDeleteFaqMutation,
} = faqApi;
