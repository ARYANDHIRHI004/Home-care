import { apiSlice } from '../apiSlice';

export const paymentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query({
            query: (queryStr = '') => `/api/payments${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Payment', id: _id })), { type: 'Payment', id: 'LIST' }]
                    : [{ type: 'Payment', id: 'LIST' }],
        }),
        createPayment: builder.mutation({
            query: (data) => ({ url: '/api/payments', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Payment', id: 'LIST' }, { type: 'Invoice', id: 'LIST' }],
        }),
        updatePayment: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/payments/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Payment', id }, { type: 'Payment', id: 'LIST' }],
        }),
        verifyPayment: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/payments/${id}/verify`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Payment', id }, { type: 'Payment', id: 'LIST' }],
        }),
        deletePayment: builder.mutation({
            query: (id) => ({ url: `/api/payments/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Payment', id }, { type: 'Payment', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetPaymentsQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useVerifyPaymentMutation,
    useDeletePaymentMutation,
} = paymentApi;
