import React from 'react';
import Container from "../../../components/Container.jsx";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {Card, Col, Row, Space, Statistic} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";
import dayjs from "dayjs";

const OrderViewContainer = ({id}) => {
    const {t} = useTranslation();
    const {data,isLoading} = useGetAllQuery({
        key: `order-${id}`,
        url: `/api/admin/orders/get/${id}`,
        enabled: !!id
    })

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED" : return "green"
            case "REJECTED" : return "red"
            case "SENT" : return "yellow"
        }
    }

    return (
        <Container>
            <Space direction="vertical" style={{width:'100%'}}>
                <Row gutter={20}>
                    <Col span={8}>
                        <Statistic title={t("Full name")} value={get(data,'data.fullName')}/>
                    </Col>
                    <Col span={8}>
                        <Statistic title={t("User phone")} value={get(data,'data.userPhone')}/>
                    </Col>
                    <Col span={8}>
                        <Statistic title={t("Phone number")} value={get(data,'data.phoneNumber')} groupSeparator={''}/>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={8}>
                        <Statistic title={t("Pharmacy")} value={get(data,'data.pharmacy')}/>
                    </Col>
                    <Col span={8}>
                        <Statistic title={t("Region")} value={get(data,'data.region')}/>
                    </Col>
                    <Col span={8}>
                        <Statistic title={t("Adress")} value={get(data,'data.address')}/>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={6}>
                        <Card>
                            <Statistic title={t("Status")} value={get(data,'data.status')} valueStyle={{color: getStatusColor(get(data,'data.status'))}} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title={t("Total price")} value={get(data,'data.totalPrice')}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title={t("Created time")} value={dayjs(get(data,'data.createdTime')).format("YYYY-MM-DD HH:mm:ss")}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title={t("Updated time")} value={dayjs(get(data,'data.updatedTime')).format("YYYY-MM-DD HH:mm:ss")}/>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </Container>
    );
};

export default OrderViewContainer;
