import { apiSlice } from '../apiSlice';

export const workOrderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWorkOrders: builder.query({
            query: (queryStr = '') => `/api/work-orders${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Ticket', id: _id })), { type: 'Ticket', id: 'LIST' }]
                    : [{ type: 'Ticket', id: 'LIST' }],
        }),
        getWorkOrderById: builder.query({
            query: (id) => `/api/work-orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Ticket', id }],
        }),
        createWorkOrder: builder.mutation({
            query: (data) => ({ url: '/api/work-orders', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
        }),
        updateWorkOrderStatus: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/work-orders/${id}/status`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
        }),
        assignWorkOrderPartner: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/work-orders/${id}/assign`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
        }),
        addWorkOrderNote: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/work-orders/${id}/notes`, method: 'POST', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
        }),
        deleteWorkOrder: builder.mutation({
            query: (id) => ({ url: `/api/work-orders/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetWorkOrdersQuery,
    useGetWorkOrderByIdQuery,
    useCreateWorkOrderMutation,
    useUpdateWorkOrderStatusMutation,
    useAssignWorkOrderPartnerMutation,
    useAddWorkOrderNoteMutation,
    useDeleteWorkOrderMutation,
} = workOrderApi;
