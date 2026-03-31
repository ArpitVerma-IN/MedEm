import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactNode } from 'react';

/**
 * Phase 2 Auth Guard Boilerplate
 * This wrapper intercepts rendering of protected routes. 
 * If a user is not authenticated, it redirects them safely back to the Landing Page.
 */
interface ProtectedRouteProps {
    children: ReactNode;
    requireRole?: 'Patient' | 'Doctor';
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // While waiting for Supabase/OAuth verification network responses
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-slate-50 dark:bg-slate-900 border-none m-0 shadow-none">
                <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-med animate-spin"></div>
            </div>
        );
    }

    // Phase 1 Guest Fallback (Will be removed once Phase 2 is fully strictly enforced)
    const isGuestCurrently = localStorage.getItem('medem_guest_name') !== null;
    const guestRole = localStorage.getItem('medem_guest_type');

    if (!isAuthenticated && !isGuestCurrently) {
        // Redirect them to the login page, while saving their current desired location
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Role-based Access Control (RBAC) verification
    if (requireRole) {
        const currentUserRole = user?.userType || guestRole;
        if (currentUserRole !== requireRole) {
            // Unauthorized role access attempt, boot them to origin dashboard securely
            return <Navigate to={currentUserRole === 'Doctor' ? '/doctor' : '/patient'} replace />;
        }
    }

    return <>{children}</>;
};
