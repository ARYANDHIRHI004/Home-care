import { apiSlice } from '../apiSlice';

export const feedbackApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFeedback: builder.query({
            query: (queryStr = '') => `/api/feedback${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Feedback', id: _id })), { type: 'Feedback', id: 'LIST' }]
                    : [{ type: 'Feedback', id: 'LIST' }],
        }),
        getFeedbackById: builder.query({
            query: (id) => `/api/feedback/${id}`,
            providesTags: (result, error, id) => [{ type: 'Feedback', id }],
        }),
        createFeedback: builder.mutation({
            query: (data) => ({ url: '/api/feedback', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Feedback', id: 'LIST' }],
        }),
        deleteFeedback: builder.mutation({
            query: (id) => ({ url: `/api/feedback/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Feedback', id }, { type: 'Feedback', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetFeedbackQuery,
    useGetFeedbackByIdQuery,
    useCreateFeedbackMutation,
    useDeleteFeedbackMutation,
} = feedbackApi;
