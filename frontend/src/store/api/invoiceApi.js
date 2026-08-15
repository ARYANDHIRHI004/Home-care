import { apiSlice } from '../apiSlice';

export const invoiceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: (queryStr = '') => `/api/invoices${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Invoice', id: _id })), { type: 'Invoice', id: 'LIST' }]
                    : [{ type: 'Invoice', id: 'LIST' }],
        }),
        getInvoiceById: builder.query({
            query: (id) => `/api/invoices/${id}`,
            providesTags: (result, error, id) => [{ type: 'Invoice', id }],
        }),
        createInvoice: builder.mutation({
            query: (data) => ({ url: '/api/invoices', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
        }),
        updateInvoice: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/invoices/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, { type: 'Invoice', id: 'LIST' }],
        }),
        updateInvoicePaymentStatus: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/invoices/${id}/payment-status`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, { type: 'Invoice', id: 'LIST' }],
        }),
        deleteInvoice: builder.mutation({
            query: (id) => ({ url: `/api/invoices/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Invoice', id }, { type: 'Invoice', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useUpdateInvoicePaymentStatusMutation,
    useDeleteInvoiceMutation,
} = invoiceApi;
