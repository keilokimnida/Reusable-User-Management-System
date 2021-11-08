import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router';
import TokenManager from '../utils/tokenManager';
import APP_CONFIG from '../config/appConfig';

const LoggedOut = () => {
    const history = useHistory();

    const decodedToken = TokenManager.getDecodedToken();
    const accountUUID = decodedToken?.account_uuid;

    useEffect(() => {

        (async () => {
            // Check if user is already signed in
            try {
                if (accountUUID) {
                    await axios.get(`${APP_CONFIG.baseUrl}/users/account/${accountUUID}`);
                    history.push("/");
                }
            } catch (error) {
                console.log(error);
            }

        })();

    }, []);

    return (
        <div className="c-Logged-out">
            <h1>You are logged out!</h1>
            <p>Please login to continue.</p>
            <NavLink to="/login">Go to login</NavLink>
        </div>
    )
}

export default LoggedOut;