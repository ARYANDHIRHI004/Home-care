import { apiSlice } from '../apiSlice';

export const configApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEnums: builder.query({
            // Was missing the /api prefix every other endpoint in this app
            // uses — the request 404'd, so every consumer of this hook has
            // been silently running on its hardcoded fallback array instead.
            query: () => '/api/config/enums',
            keepUnusedDataFor: 86400, // enums don't change during a session
        }),
    }),
    overrideExisting: false,
});

export const { useGetEnumsQuery } = configApi;
