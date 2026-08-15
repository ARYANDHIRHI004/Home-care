import { apiSlice } from '../apiSlice';

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (queryStr = '') => `/api/notifications${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Notification', id: _id })), { type: 'Notification', id: 'LIST' }]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),
        getNotificationById: builder.query({
            query: (id) => `/api/notifications/${id}`,
            providesTags: (result, error, id) => [{ type: 'Notification', id }],
        }),
        createNotification: builder.mutation({
            query: (data) => ({ url: '/api/notifications', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
        markNotificationSent: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/notifications/${id}/sent`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Notification', id }, { type: 'Notification', id: 'LIST' }],
        }),
        markNotificationFailed: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/notifications/${id}/failed`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Notification', id }, { type: 'Notification', id: 'LIST' }],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({ url: `/api/notifications/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Notification', id }, { type: 'Notification', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetNotificationByIdQuery,
    useCreateNotificationMutation,
    useMarkNotificationSentMutation,
    useMarkNotificationFailedMutation,
    useDeleteNotificationMutation,
} = notificationApi;
