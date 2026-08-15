import { apiSlice } from '../apiSlice';

export const customerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: (queryStr = '') => `/api/customers${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result?.data
                    ? [...result.data.map(({ _id }) => ({ type: 'Customer', id: _id })), { type: 'Customer', id: 'LIST' }]
                    : [{ type: 'Customer', id: 'LIST' }],
        }),
        getCustomerById: builder.query({
            query: (id) => `/api/customers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Customer', id }],
        }),
        createCustomer: builder.mutation({
            query: (data) => ({ url: '/api/customers', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
        }),
        updateCustomer: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/customers/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, { type: 'Customer', id: 'LIST' }],
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({ url: `/api/customers/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Customer', id }, { type: 'Customer', id: 'LIST' }],
        }),
        findOrCreateCustomer: builder.mutation({
            query: (data) => ({ url: '/api/customers/find-or-create', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useFindOrCreateCustomerMutation,
} = customerApi;
