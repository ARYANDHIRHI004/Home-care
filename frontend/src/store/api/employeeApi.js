import { apiSlice } from '../apiSlice';

export const employeeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees: builder.query({
            query: (queryStr = '') => `/api/employees${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...(Array.isArray(result) ? result : []).map(({ _id }) => ({ type: 'Employee', id: _id })), { type: 'Employee', id: 'LIST' }]
                    : [{ type: 'Employee', id: 'LIST' }],
        }),
        getEmployeeById: builder.query({
            query: (id) => `/api/employees/${id}`,
            providesTags: (result, error, id) => [{ type: 'Employee', id }],
        }),
        createEmployee: builder.mutation({
            query: (data) => ({ url: '/api/employees', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
        }),
        updateEmployee: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/employees/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, { type: 'Employee', id: 'LIST' }],
        }),
        updateEmployeePermissions: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/employees/${id}/permissions`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
        }),
        deleteEmployee: builder.mutation({
            query: (id) => ({ url: `/api/employees/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Employee', id }, { type: 'Employee', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeByIdQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useUpdateEmployeePermissionsMutation,
    useDeleteEmployeeMutation,
} = employeeApi;
