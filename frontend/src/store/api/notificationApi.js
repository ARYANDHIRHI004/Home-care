import { apiSlice } from '../apiSlice';

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyNotifications: builder.query({
            query: () => '/api/notifications/me',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Notification', id: _id })), { type: 'Notification', id: 'LIST' }]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({ url: `/api/notifications/me/${id}/read`, method: 'PATCH' }),
            invalidatesTags: (result, error, id) => [{ type: 'Notification', id }, { type: 'Notification', id: 'LIST' }],
        }),
        markAllNotificationsRead: builder.mutation({
            query: () => ({ url: '/api/notifications/me/read-all', method: 'PATCH' }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetMyNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
} = notificationApi;
