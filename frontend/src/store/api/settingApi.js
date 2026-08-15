import { apiSlice } from '../apiSlice';

export const settingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => '/api/settings',
            providesTags: [{ type: 'Setting', id: 'SINGLETON' }],
        }),
        updateSettings: builder.mutation({
            query: (data) => ({ url: '/api/settings', method: 'PUT', body: data }),
            invalidatesTags: [{ type: 'Setting', id: 'SINGLETON' }],
        }),
        updateInvoiceSettings: builder.mutation({
            query: (data) => ({ url: '/api/settings/invoice', method: 'PATCH', body: data }),
            invalidatesTags: [{ type: 'Setting', id: 'SINGLETON' }],
        }),
        updateWhatsAppSettings: builder.mutation({
            query: (data) => ({ url: '/api/settings/whatsapp', method: 'PATCH', body: data }),
            invalidatesTags: [{ type: 'Setting', id: 'SINGLETON' }],
        }),
        updatePaymentSettings: builder.mutation({
            query: (data) => ({ url: '/api/settings/payment', method: 'PATCH', body: data }),
            invalidatesTags: [{ type: 'Setting', id: 'SINGLETON' }],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useUpdateInvoiceSettingsMutation,
    useUpdateWhatsAppSettingsMutation,
    useUpdatePaymentSettingsMutation,
} = settingApi;
