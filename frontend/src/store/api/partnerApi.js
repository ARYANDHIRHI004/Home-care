import { apiSlice } from '../apiSlice';

export const partnerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPartners: builder.query({
            query: (queryStr = '') => `/api/service-partners${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Partner', id: _id })), { type: 'Partner', id: 'LIST' }]
                    : [{ type: 'Partner', id: 'LIST' }],
        }),
        getPartnerById: builder.query({
            query: (id) => `/api/service-partners/${id}`,
            providesTags: (result, error, id) => [{ type: 'Partner', id }],
        }),
        createPartner: builder.mutation({
            query: (data) => ({ url: '/api/service-partners', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Partner', id: 'LIST' }],
        }),
        updatePartner: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/service-partners/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Partner', id }, { type: 'Partner', id: 'LIST' }],
        }),
        togglePartner: builder.mutation({
            query: (id) => ({ url: `/api/service-partners/${id}/toggle`, method: 'PATCH', body: {} }),
            invalidatesTags: (result, error, id) => [{ type: 'Partner', id }, { type: 'Partner', id: 'LIST' }],
        }),
        deletePartner: builder.mutation({
            query: (id) => ({ url: `/api/service-partners/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Partner', id }, { type: 'Partner', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetPartnersQuery,
    useGetPartnerByIdQuery,
    useCreatePartnerMutation,
    useUpdatePartnerMutation,
    useTogglePartnerMutation,
    useDeletePartnerMutation,
} = partnerApi;
