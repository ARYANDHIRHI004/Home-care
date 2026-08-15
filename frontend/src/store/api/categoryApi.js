import { apiSlice } from '../apiSlice';

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (queryStr = '') => `/api/categories${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Category', id: _id })), { type: 'Category', id: 'LIST' }]
                    : [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoryById: builder.query({
            query: (id) => `/api/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation({
            query: (data) => ({ url: '/api/categories', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/categories/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, { type: 'Category', id: 'LIST' }],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({ url: `/api/categories/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Category', id }, { type: 'Category', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
