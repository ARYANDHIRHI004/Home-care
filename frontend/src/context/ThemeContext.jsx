'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => {},
    resolvedTheme: 'light',
});

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState('light');
    const [resolvedTheme, setResolvedTheme] = useState('light');

    // Apply theme to <html> element
    const applyTheme = (t) => {
        const root = document.documentElement;
        const isDark =
            t === 'dark' ||
            (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
            root.classList.add('dark');
            setResolvedTheme('dark');
        } else {
            root.classList.remove('dark');
            setResolvedTheme('light');
        }
    };

    // On mount: load saved theme from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('hc-theme') || 'light';
        setThemeState(saved);
        applyTheme(saved);

        // Listen to system preference changes when theme = 'system'
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const current = localStorage.getItem('hc-theme') || 'light';
            if (current === 'system') applyTheme('system');
        };
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

    const setTheme = (t) => {
        setThemeState(t);
        localStorage.setItem('hc-theme', t);
        applyTheme(t);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
