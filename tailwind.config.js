/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#6366f1',
                    DEFAULT: '#4f46e5',
                    dark: '#4338ca',
                },
                med: {
                    light: '#bfdbfe',
                    DEFAULT: '#3b82f6',
                    dark: '#1e3a8a',
                },
                danger: {
                    light: '#fca5a5',
                    DEFAULT: '#ef4444',
                    dark: '#b91c1c',
                },
                success: {
                    light: '#6ee7b7',
                    DEFAULT: '#10b981',
                    dark: '#047857',
                }
            }
        },
    },
    plugins: [],
}
