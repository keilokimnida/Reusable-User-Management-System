export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => localStorage.setItem("token", token);

export const clearToken = () => localStorage.removeItem("token");

export const login = (data) => {
    setToken(data.token);
    Object.keys(data.data).forEach(key => localStorage.setItem(key, data.data[key]));
}
