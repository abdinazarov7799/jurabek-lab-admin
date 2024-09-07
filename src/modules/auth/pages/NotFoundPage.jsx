import React from 'react';
import {Button, Result} from "antd";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const NotFoundPage = ({...rest}) => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => navigate('/')}>{t("Back Home")}</Button>}
            />
        </>
    );
};

export default NotFoundPage;
