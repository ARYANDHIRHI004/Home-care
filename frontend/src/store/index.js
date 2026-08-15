// Barrel exports — import everything auth-related from "@/store"

// Slice actions
export { setUser, clearUser, clearError } from "./slices/authSlice";

// Async thunks
export { loginOfficeUser, logoutOfficeUser, fetchAdminProfile } from "./slices/authSlice";

// Typed hooks
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";

// Store factory
export { makeStore } from "./store";
