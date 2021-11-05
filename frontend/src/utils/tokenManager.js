const tokenManager = () => {
    let accessToken = null;
    let message = "";

    const getToken = () => accessToken;

    const setToken = (pToken) => {
        accessToken = pToken;
        return true;
    };

    const removeToken = () => {
        accessToken = null;
        return true;
    };

    const getMessage = () => message;

    const setMessage = (pMsg) => {
        message = pMsg;
        return true;
    };

    return {
        getToken,
        setToken,
        removeToken,
        getMessage,
        setMessage
    };
};

export default tokenManager;