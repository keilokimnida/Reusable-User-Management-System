import React from 'react';
import { logout } from "../utils/localStorage";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";


const useLogout = () => {
    const history = useHistory;

    logout();
    toast("Logged out successfully");
    history.push("/login");
}

export default useLogout;