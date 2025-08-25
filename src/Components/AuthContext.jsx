import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
let globalAuthHandler = null;
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const handleUnauthorized = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        setUser(null);
        const shouldRedirect = window.confirm(
            'You need to log in to access this feature. Would you like to go to the login page?'
        );
        if (shouldRedirect) {
            window.location.href = '/login';
        }

    };
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // If token exists, assume authenticated until proven otherwise by a 401
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        setUser(null);
    };
    useEffect(() => {
        checkAuthStatus();
        globalAuthHandler = handleUnauthorized;
        return () => { globalAuthHandler = null; };
    }, []);
    const value = {
        isAuthenticated,
        user,
        loading,
        logout,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}
export const AuthFetch = async (url, options = {}) => {
    const token = localStorage.getItem('jwtToken');
    const headers = options.headers || {};
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    const config = { ...options, headers: headers };
    const response = await fetch(url, config);
    if (response.status === 401 && globalAuthHandler) {
        globalAuthHandler();
        throw new Error("Please log in first");
    }
    return response;
}
