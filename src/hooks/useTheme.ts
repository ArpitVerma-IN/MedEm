import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode') as ThemeMode;
            if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
                return savedMode;
            }
        }
        return 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (currentMode: ThemeMode) => {
            root.classList.remove('light', 'dark');
            let resolvedTheme = currentMode;

            if (currentMode === 'system') {
                resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            root.classList.add(resolvedTheme);
        };

        applyTheme(mode);
        localStorage.setItem('themeMode', mode);

        if (mode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [mode]);

    const cycleTheme = () => {
        setMode(prev => {
            if (prev === 'system') return 'dark';
            if (prev === 'dark') return 'light';
            return 'system'; // light -> system
        });
    };

    return { mode, cycleTheme };
}
