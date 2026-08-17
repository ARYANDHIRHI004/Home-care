import { apiSlice } from '../apiSlice';

export const expenseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getExpenses: builder.query({
            query: () => '/api/expenses',
            transformResponse: (response) => response.data,
            providesTags: ['Expense'],
        }),
        createExpense: builder.mutation({
            query: (data) => ({
                url: '/api/expenses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Expense'],
        }),
        updateExpense: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/expenses/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Expense'],
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `/api/expenses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Expense'],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
} = expenseApi;
