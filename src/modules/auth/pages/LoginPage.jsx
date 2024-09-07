import React from 'react';
import LoginContainer from "../containers/LoginContainer";

const LoginPage = ({...rest}) => {
    return (
        <>
            <LoginContainer {...rest} />
        </>
    );
};

export default LoginPage;