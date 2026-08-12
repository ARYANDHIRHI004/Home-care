'use client';

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { fetchAdminProfile } from "./slices/authSlice";

export default function StoreProvider({ children }) {
    const storeRef = useRef(undefined);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

 
    useEffect(() => {
        storeRef.current.dispatch(fetchAdminProfile());
    }, []);

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    );
}
