import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, DatabaseProfile } from '../../types';
import { supabase } from '../api/supabaseClient';

interface AuthState {
    user: User | null;
    profile: DatabaseProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        // Fetch current session natively from Workbox / Local Storage via Supabase SDK
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
                // Fetch strict Profile bounds metadata
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('profile_id', session.user.id)
                    .single();

                if (profileData) {
                    setState({
                        profile: profileData,
                        user: {
                            id: session.user.id,
                            name: profileData.full_name,
                            location: { lat: 0, lng: 0 }, 
                            color: '#3B82F6', 
                            userType: profileData.role,
                            needsCare: false,
                        },
                        isAuthenticated: true,
                        isLoading: false
                    });
                } else {
                    setState(p => ({ ...p, isAuthenticated: false, isLoading: false }));
                }
            } else {
                setState(p => ({ ...p, isAuthenticated: false, isLoading: false }));
            }
        };

        initializeAuth();

        // Subscribe to Token refreshes, Login, and Logout events globally
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('profile_id', session.user.id)
                    .single();

                if (profileData) {
                    setState({
                        profile: profileData,
                        user: {
                            id: session.user.id,
                            name: profileData.full_name,
                            location: { lat: 0, lng: 0 },
                            color: '#3B82F6',
                            userType: profileData.role,
                            needsCare: false,
                        },
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                setState({ user: null, profile: null, isAuthenticated: false, isLoading: false });
                localStorage.removeItem('medem_auth_token');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ ...state, logout }}>
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
