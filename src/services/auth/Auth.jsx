import React, { useEffect } from "react";
import { KEYS } from "../../constants/key";
import { URLS } from "../../constants/url";
import useGetAllQuery from "../../hooks/api/useGetAllQuery";
import { useStore } from "../../store";
import {get} from "lodash";
import useAuth from "../../hooks/auth/useAuth";
import OverlayLoader from "../../components/OverlayLoader.jsx";

const Auth = ({ children }) => {
    const {token} = useAuth({})
    const setUser = useStore((state) => get(state, "setUser", () => {}));
    const setAuthenticated = useStore((state) => get(state, "setAuthenticated", () => {}));
    const { data, isLoading } = useGetAllQuery({
        key: KEYS.getMe,
        url: URLS.getMe,
        hideErrorMsg: true,
        enabled:!!token
    });
    useEffect(() => {
        if (get(data, "data")) {
            const {role,...userData} = get(data, "data", {})
            const user = {
                ...userData,
                roles: [role]
            }
            setUser(user);
            setAuthenticated(true);
        }
    }, [data]);

    if (isLoading) {
        return <OverlayLoader />;
    }
    return <>{children}</>;
};

export default Auth;