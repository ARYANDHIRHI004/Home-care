import { apiSlice } from '../apiSlice';

export const enquiryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEnquiries: builder.query({
            query: (queryStr = '') => `/api/enquiries${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) => 
                result?.data
                    ? [
                          ...result.data.map(({ id }) => ({ type: 'Enquiry', id })),
                          { type: 'Enquiry', id: 'LIST' },
                      ]
                    : [{ type: 'Enquiry', id: 'LIST' }],
        }),
        getEnquiryById: builder.query({
            query: (id) => `/api/enquiries/${id}`,
            providesTags: (result, error, id) => [{ type: 'Enquiry', id }],
        }),
        createEnquiry: builder.mutation({
            query: (data) => ({
                url: '/api/enquiries',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Enquiry', id: 'LIST' }],
        }),
        updateEnquiry: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/enquiries/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Enquiry', id },
                { type: 'Enquiry', id: 'LIST' }
            ],
        }),
        addEnquiryNote: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/enquiries/${id}/notes`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Enquiry', id }],
        }),
        deleteEnquiry: builder.mutation({
            query: (id) => ({
                url: `/api/enquiries/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Enquiry', id },
                { type: 'Enquiry', id: 'LIST' }
            ],
        }),
    }),
});

export const {
    useGetEnquiriesQuery,
    useGetEnquiryByIdQuery,
    useCreateEnquiryMutation,
    useUpdateEnquiryMutation,
    useAddEnquiryNoteMutation,
    useDeleteEnquiryMutation,
} = enquiryApi;
