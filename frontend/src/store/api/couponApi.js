import { apiSlice } from '../apiSlice';

export const couponApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: (queryStr = '') => `/api/coupons${queryStr ? `?${queryStr}` : ''}`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Coupon', id: _id })), { type: 'Coupon', id: 'LIST' }]
                    : [{ type: 'Coupon', id: 'LIST' }],
        }),
        getCouponById: builder.query({
            query: (id) => `/api/coupons/${id}`,
            providesTags: (result, error, id) => [{ type: 'Coupon', id }],
        }),
        createCoupon: builder.mutation({
            query: (data) => ({ url: '/api/coupons', method: 'POST', body: data }),
            invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/coupons/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Coupon', id }, { type: 'Coupon', id: 'LIST' }],
        }),
        updateCouponStatus: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/api/coupons/${id}/status`, method: 'PATCH', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Coupon', id }, { type: 'Coupon', id: 'LIST' }],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({ url: `/api/coupons/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Coupon', id }, { type: 'Coupon', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useUpdateCouponStatusMutation,
    useDeleteCouponMutation,
} = couponApi;
