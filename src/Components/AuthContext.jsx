import { createContext, useContext, useState, useEffect, useRef } from 'react';
const AuthContext = createContext();
let globalAuthHandler = null;
let globalRefreshHandler = null;



function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
    //Pop up that is shown when user tries to access protected endpoint without being logged in
    //in context wrapper
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <p className="text-gray-800 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const isRefreshingRef = useRef(false);

    const handleUnauthorized = () => {

        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);

        setShowLoginPrompt(true);




    };
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                try {
                    await attemptRefresh();
                    setIsAuthenticated(true);

                } catch (error) {
                    setIsAuthenticated(false);

                }


            }
            else {
                setIsAuthenticated(true);
                setLoading(false);
            }



        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const logout = async () => {
        const token = localStorage.getItem('accessToken');


        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);

        // Try to notify server, but don't fail if it doesn't work
        if (token) {
            try {
                const res = await fetch(`${apiUrl}/api/logout`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'text/plain',
                        'Authorization': `Bearer ${token}`
                    },
                    body: token

                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message);
                }
            } catch (error) {

                console.warn('Server logout failed:', error.message);
            }
        }

    };
    useEffect(() => {
        checkAuthStatus();
        globalAuthHandler = handleUnauthorized;
        globalRefreshHandler = attemptRefresh;
        return () => { globalAuthHandler = null; };
    }, []);
    const value = {
        isAuthenticated,
        user,
        loading,
        logout,
        checkAuthStatus,
        apiUrl
    };
    const attemptRefresh = async () => {

        try {
            const response = await fetch(`${apiUrl}/api/refresh`, {
                method: 'POST',
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data = await response.json();
                const newToken = data.accessToken;

                // Update the token in localStorage (keeping consistent with your current token key)
                localStorage.setItem('accessToken', newToken);
                setIsAuthenticated(true);

                return newToken;
            } else {
                // Refresh failed, clear everything
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                setUser(null);
                throw new Error('Refresh failed');

            }
        } catch (error) {
            // Clear auth state on any error
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        } finally {
            isRefreshingRef.current = false;
        }
    };
    const handleLoginConfirm = () => {

        setShowLoginPrompt(false);
        window.location.href = '/login';

    };

    const handleLoginCancel = () => {
        setShowLoginPrompt(false);
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <ConfirmModal
                isOpen={showLoginPrompt}
                onConfirm={handleLoginConfirm}
                onCancel={handleLoginCancel}
                message="You need to log in to access this feature. Would you like to go to the login page?"
            /> {/* ConfirmModal context wrapper, so any endpoint at any frontend that is accessed without logging in should have this pop up*/}
        </AuthContext.Provider>
    );

}
export const AuthFetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    const makeRequest = async (token) => {
        const headers = options.headers || {};
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        const config = { ...options, headers: headers, body: token };

        return fetch(url, config);
    }
    let response = await makeRequest(token);
    if (response.status === 401 && globalAuthHandler) {
        try {
            await globalRefreshHandler();
            const newToken = localStorage.getItem('accessToken');

            response = await makeRequest(newToken);

        } catch (error) {
            globalAuthHandler();
        }






    }

    return response;
}
export const AuthFetch = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    const makeRequest = async (token) => {
        const headers = options.headers || {};
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        const config = { ...options, headers: headers };

        return fetch(url, config);
    }
    let response = await makeRequest(token);
    if (response.status === 401 && globalAuthHandler) {
        try {
            await globalRefreshHandler();
            const newToken = localStorage.getItem('accessToken');

            response = await makeRequest(newToken);

        } catch (error) {
            globalAuthHandler();
        }



    }
    return response;
}