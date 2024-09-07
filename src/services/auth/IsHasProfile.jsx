import React from 'react';
import useAuth from "../../hooks/auth/useAuth";
import {get, isNil} from "lodash";

const IsHasProfile = ({children}) => {
    const {isAuthenticated = false, user = null} = useAuth({});
    return !!(isAuthenticated && !isNil(get(user, "authorities"))) ? children : null
};
export default IsHasProfile;