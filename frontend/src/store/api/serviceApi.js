import { apiSlice } from '../apiSlice';

export const serviceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query({
            query: (queryStr = '') => `/api/services${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Service', id: _id })), { type: 'Service', id: 'LIST' }]
                    : [{ type: 'Service', id: 'LIST' }],
        }),
        getServiceById: builder.query({
            query: (id) => `/api/services/${id}`,
            providesTags: (result, error, id) => [{ type: 'Service', id }],
        }),
        createService: builder.mutation({
            query: (data) => ({ url: '/api/services', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Service', id: 'LIST' }],
        }),
        updateService: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/services/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
        }),
        toggleService: builder.mutation({
            query: (id) => ({ url: `/api/services/${id}/toggle`, method: 'PATCH', body: {} }),
            invalidatesTags: (result, error, id) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
        }),
        deleteService: builder.mutation({
            query: (id) => ({ url: `/api/services/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useToggleServiceMutation,
    useDeleteServiceMutation,
} = serviceApi;
