/**
 * Phase 2 Native Fetch Interceptor Wrapper
 * Seamlessly injects Bearer tokens (from Auth state or localStorage) into outgoing requests
 * without requiring heavy third-party libraries like axios.
 */

interface RequestConfig extends RequestInit {
    requireAuth?: boolean;
}

const getAuthToken = (): string | null => {
    // In Phase 2: This will fetch explicitly from your secure persist layer (e.g. Supabase session)
    // For now in Demo Mode, this safely returns null to rely on guest architecture
    return localStorage.getItem('medem_auth_token'); 
};

export const apiClient = async <T>(url: string, config: RequestConfig = {}): Promise<T> => {
    const { requireAuth = false, ...customConfig } = config;
    const headers = new Headers(customConfig.headers || {});

    // Always append JSON payload headers if not explicitly overridden
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Role-based auth barrier injection
    if (requireAuth) {
        const token = getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            console.warn(`[apiClient] Request to ${url} requires auth, but no local token exists.`);
        }
    }

    const enhancedConfig: RequestInit = {
        ...customConfig,
        headers,
    };

    try {
        const response = await fetch(url, enhancedConfig);
        
        // Handle explicit HTTP error statuses
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
        }

        // Only parse JSON if content exists
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return (await response.text()) as any;
    } catch (error) {
        console.error(`[apiClient] Network Boundary Error contacting ${url}:`, error);
        throw error;
    }
};
