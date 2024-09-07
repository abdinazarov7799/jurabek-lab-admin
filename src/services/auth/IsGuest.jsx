import React from 'react';
import useAuth from "../../hooks/auth/useAuth";

const IsGuest = ({children,...rest}) => {
    const {isAuthenticated,token} = useAuth({});
    return !(!!(token)) ? children : null
};

export default IsGuest;