import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../../types';

// Phase 2: Authentication Context Boilerplate
// This file will handle the state for logged-in users, tokens, and OAuth flows (e.g., Supabase, Firebase).

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (credentials: Record<string, string>) => Promise<void>;
    logout: () => Promise<void>;
    register: (details: Record<string, string>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
    });

    // TODO: Implement actual authentication logic here in Phase 2
    const login = async (credentials: Record<string, string>) => {
        // Implement login (Supabase auth.signInWithPassword etc.)
        // Ensure default `isActiveResponder` and `needsCare` states are retrieved and set properly here.
        setState(prev => ({ ...prev, isLoading: true }));
        console.log("Login not yet implemented", credentials);
    };

    const logout = async () => {
        // Implement logout
        console.log("Logout not yet implemented");
    };

    const register = async (details: Record<string, string>) => {
        // Implement registration
        console.log("Register not yet implemented", details);
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
