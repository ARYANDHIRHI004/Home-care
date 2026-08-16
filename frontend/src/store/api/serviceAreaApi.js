import { apiSlice } from '../apiSlice';

export const serviceAreaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServiceAreas: builder.query({
            query: (queryStr = '') => `/api/service-areas${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'ServiceArea', id: _id })), { type: 'ServiceArea', id: 'LIST' }]
                    : [{ type: 'ServiceArea', id: 'LIST' }],
        }),
        // { locality } or { lat, lng } -> { serviceable, matchedArea }. A
        // mutation (not a query) since it's a one-shot check called on demand
        // from checkout/onboarding, not something to cache and re-serve.
        checkServiceArea: builder.mutation({
            query: (data) => ({ url: '/api/service-areas/check', method: 'POST', body: data }),
        }),
        notifyMeWhenAvailable: builder.mutation({
            query: (data) => ({ url: '/api/service-areas/notify-me', method: 'POST', body: data }),
        }),
        createServiceArea: builder.mutation({
            query: (data) => ({ url: '/api/service-areas', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'ServiceArea', id: 'LIST' }],
        }),
        updateServiceArea: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/service-areas/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'ServiceArea', id }, { type: 'ServiceArea', id: 'LIST' }],
        }),
        deleteServiceArea: builder.mutation({
            query: (id) => ({ url: `/api/service-areas/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'ServiceArea', id }, { type: 'ServiceArea', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetServiceAreasQuery,
    useCheckServiceAreaMutation,
    useNotifyMeWhenAvailableMutation,
    useCreateServiceAreaMutation,
    useUpdateServiceAreaMutation,
    useDeleteServiceAreaMutation,
} = serviceAreaApi;
