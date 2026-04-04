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
