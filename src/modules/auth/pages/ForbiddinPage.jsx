import React from 'react';
import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ForbiddinPage = ({...rest}) => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary" onClick={() => navigate('/')}>{t("Back Home")}</Button>}
            />
        </>
    );
};

export default ForbiddinPage;
