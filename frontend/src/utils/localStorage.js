import jwtDecode from 'jwt-decode';

/**
 * Gets the token and the decoded token
 * @returns {[string, object]} Token, decoded token (both null if there is no token)
 */
export const getToken = () => {
    const token = localStorage.getItem("token");
    return [token, token ? jwtDecode(token) : null];
}

/**
 * Sets token
 * @param {string} token 
 */
export const setToken = (token) => localStorage.setItem("token", token);

/**
 * Clear token
 */
export const clearToken = () => localStorage.removeItem("token");

export const login = (data = {}) => {
    Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
    setToken(data.access_token);
}

export const logout = () => localStorage.clear();

export const getAccountId = () => {
    const [, decoded] = getToken();
    return decoded.account_id;
};

export const getAll = () => {
    const [, decoded] = getToken();
    return { ...localStorage, decoded };
}
