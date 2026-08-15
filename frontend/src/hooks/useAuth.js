"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    loginOfficeUser,
    logoutOfficeUser,
    clearError,
} from "@/store/slices/authSlice";

/**
 * useAuth — convenience hook providing auth state + action dispatchers.
 *
 * Usage:
 *   const { user, role, isAuthenticated, loading, error, login, logout } = useAuth();
 */
export function useAuth() {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const role = useAppSelector((state) => state.auth.role);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const loading = useAppSelector((state) => state.auth.loading);
    const error = useAppSelector((state) => state.auth.error);

    /** Login an office/admin user. Returns the dispatched thunk promise. */
    const login = useCallback(
        (email, password) => dispatch(loginOfficeUser({ email, password })),
        [dispatch]
    );

    /** Logout and clear state. Returns the dispatched thunk promise. */
    const logout = useCallback(
        () => dispatch(logoutOfficeUser()),
        [dispatch]
    );

    /** Dismiss the current error message. */
    const dismissError = useCallback(
        () => dispatch(clearError()),
        [dispatch]
    );

    return {
        user,
        token,
        role,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        dismissError,
    };
}
