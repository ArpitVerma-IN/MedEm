import { createClient } from '@supabase/supabase-js';

// Access the environment variables populated by Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn("⚠️ Supabase URLs are missing from the environment configuration. Phase 2 auth will fail.");
    }
}

// Single initialized database client instances across the application
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

/**
 * Initiates the Google OAuth 2.0 flow via Supabase.
 * It automatically redirects the user to the Google Consent screen.
 * Upon success, Supabase catches the redirect and natively writes the JWT token to local storage.
 */
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // This tells Supabase to redirect back to the home route after Google confirms their identity
            redirectTo: window.location.origin,
            queryParams: {
                access_type: 'offline', // Requests a refresh token so the user stays logged in
                prompt: 'consent',
            }
        }
    });

    if (error) {
        console.error("Google OAuth Error:", error.message);
        throw error;
    }
    
    return data;
};
