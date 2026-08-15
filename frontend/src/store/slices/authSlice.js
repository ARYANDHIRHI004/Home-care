import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/services/api";

/* ─── Async Thunks ─────────────────────────────────────────────────────────── */

/**
 * Login an office/admin user with email + password.
 * On success, the backend sets an HTTP-only session cookie and returns
 * { user, token } inside data.data.
 */
export const loginOfficeUser = createAsyncThunk(
    "auth/loginOfficeUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await authApi.loginOfficeUser(email, password);
            // res.data = { user: {...}, token: "..." }
            return res.data;
        } catch (err) {
            // err = { status, message } thrown by the api service
            return rejectWithValue(err.message || "Login failed.");
        }
    }
);

/**
 * Logout the currently authenticated office/admin user.
 */
export const logoutOfficeUser = createAsyncThunk(
    "auth/logoutOfficeUser",
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logoutOfficeUser();
        } catch (err) {
            return rejectWithValue(err.message || "Logout failed.");
        }
    }
);

/**
 * Re-hydrate the Redux store after a page reload by fetching the
 * current session from the backend (relies on the session cookie).
 */
export const fetchAdminProfile = createAsyncThunk(
    "auth/fetchAdminProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authApi.getAdminProfile();
            return res.data; // { id, name, email, role, image, createdAt }
        } catch {
            return rejectWithValue(null); // silently fail — user is just not logged in
        }
    }
);

/* ─── Slice ────────────────────────────────────────────────────────────────── */

const initialState = {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /** Manually set user (e.g. from customer/social auth flows). */
        setUser: (state, action) => {
            state.user = action.payload;
            state.role = action.payload?.role ?? null;
            state.isAuthenticated = true;
            state.error = null;
        },
        /** Clear all auth state (e.g. after session expiry detected on client). */
        clearUser: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        /** Clear any lingering error message. */
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ── loginOfficeUser ───────────────────────────────────────────────────
        builder
            .addCase(loginOfficeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginOfficeUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user ?? null;
                state.token = action.payload?.token ?? null;
                state.role = action.payload?.user?.role ?? null;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginOfficeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed. Please try again.";
                state.isAuthenticated = false;
            });

        // ── logoutOfficeUser ──────────────────────────────────────────────────
        builder
            .addCase(logoutOfficeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutOfficeUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.role = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutOfficeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── fetchAdminProfile ─────────────────────────────────────────────────
        builder
            .addCase(fetchAdminProfile.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                    state.role = action.payload?.role ?? null;
                    state.isAuthenticated = true;
                }
            })
            .addCase(fetchAdminProfile.rejected, (state) => {
                // Cookie is gone / expired — reset silently
                state.user = null;
                state.token = null;
                state.role = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, clearUser, clearError } = authSlice.actions;
export default authSlice.reducer;