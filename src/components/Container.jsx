import React from 'react';
import {theme} from "antd";

const Container = ({children}) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <div style={{
            margin: "0 auto",
            padding: 16,
            borderRadius: 5,
            width: "100%",
            backgroundColor: colorBgContainer,
        }}>
            {children}
        </div>
    );
};

export default Container;
