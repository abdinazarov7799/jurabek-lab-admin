import React from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get} from "lodash";
import useGetOneQuery from "../../../hooks/api/useGetOneQuery.js";
import {Divider, Row, Space, Statistic, Typography} from "antd";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
const {Text,Title} = Typography;

const OrderEdit = ({selected,getStatusColor}) => {
    const id = get(selected,'id')
    const {t} = useTranslation()
    const {data,isLoading} = useGetOneQuery({
        id,
        key: `${KEYS.order_products}_${id}`,
        url: URLS.order_products,
        params: {
            page: 0,
            size: 1000
        }
    })
    console.log(selected)
    return (
        <div>
            <Divider style={{marginTop: 0}}/>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Address")}</Title>
                    <Text>{get(selected,'address')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Pharmacy")}</Title>
                    <Text>{get(selected,'pharmacy')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Phone")}</Title>
                    <Text>{get(selected,'phoneNumber')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Created time")}</Title>
                    <Text>{dayjs(get(selected,'createdTime')).format("YYYY-MM-DD HH:mm:ss")}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Total price")}</Title>
                    <Text>{Number(get(selected,'totalPrice')).toLocaleString("en-US")} {t("so'm")}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Status")}</Title>
                    <Text type={getStatusColor(get(selected,'status'))}>{get(selected,'status')}</Text>
                </Row>
            </Space>
        </div>
    );
};

export default OrderEdit;