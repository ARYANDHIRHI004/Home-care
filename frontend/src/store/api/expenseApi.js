import { apiSlice } from '../apiSlice';

export const expenseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getExpenses: builder.query({
            query: () => '/expenses',
            providesTags: ['Expense'],
        }),
        createExpense: builder.mutation({
            query: (data) => ({
                url: '/expenses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Expense'],
        }),
        updateExpense: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/expenses/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Expense'],
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `/expenses/${id}`,
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
