import { useAuth } from './AuthContext';

export const AuthFetch = () => {
    // Our hook gets direct, reliable access to the context functions
    const { attemptRefresh, handleUnauthorized } = useAuth();

    // The hook returns a function that has the same signature as fetch
    const authFetch = async (url, options = {}) => {
        const makeRequest = async (token) => {
            const headers = { ...options.headers };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return fetch(url, { ...options, headers });
        };

        let response = await makeRequest(localStorage.getItem('accessToken'));

        if (response.status === 401) {
            try {
                // No more global variables! We call the stable function from context.
                const newToken = await attemptRefresh();
                // Retry the request with the new token
                response = await makeRequest(newToken);
            } catch (error) {
                // If refresh fails, call the final logout handler
                handleUnauthorized();
                // Return the original failed response so the component can handle it
                return response;
            }
        }

        return response;
    };

    return authFetch; // Return the function for components to use
};