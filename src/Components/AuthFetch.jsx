export const AuthFetch = async (url, options = {}) => {
    const token = localStorage.getItem('jwtToken');
    const headers = options.headers || {};
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    const config = { ...options, headers: headers };
    return fetch(url, config);
}