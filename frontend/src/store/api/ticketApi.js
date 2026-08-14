import { apiSlice } from '../apiSlice';

export const ticketApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query({
            query: (queryStr = '') => `/api/tickets${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Ticket', id: _id })), { type: 'Ticket', id: 'LIST' }]
                    : [{ type: 'Ticket', id: 'LIST' }],
        }),
        getTicketById: builder.query({
            query: (id) => `/api/tickets/${id}`,
            providesTags: (result, error, id) => [{ type: 'Ticket', id }],
        }),
        createTicket: builder.mutation({
            query: (data) => ({ url: '/api/tickets', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
        }),
        updateTicketStatus: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/tickets/${id}/status`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
        }),
        assignTicketPartner: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/tickets/${id}/assign`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
        }),
        addTicketNote: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/tickets/${id}/notes`, method: 'POST', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
        }),
        deleteTicket: builder.mutation({
            query: (id) => ({ url: `/api/tickets/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTicketsQuery,
    useGetTicketByIdQuery,
    useCreateTicketMutation,
    useUpdateTicketStatusMutation,
    useAssignTicketPartnerMutation,
    useAddTicketNoteMutation,
    useDeleteTicketMutation,
} = ticketApi;
