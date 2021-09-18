import jwtDecode from 'jwt-decode';

/**
 * Gets the token and the decoded token
 * @returns {[string, object]} Token, decoded token (both null if there is no token)
 */
export const getToken = () => {
    const token = localStorage.getItem("token");
    return [token, token ? jwtDecode(token) : null];
}

export const setToken = (token) => localStorage.setItem("token", token);

export const clearToken = () => localStorage.removeItem("token");

export const login = (data) => {
    setToken(data.token);
    Object.keys(data.data).forEach(key => localStorage.setItem(key, data.data[key]));
}

export const getAccountId = () => {
    const [, decoded] = getToken();
    return decoded.account_id;
};
