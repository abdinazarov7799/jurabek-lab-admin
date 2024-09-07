import React, {useState} from 'react';
import {Button, Input, Pagination, Popconfirm, Row, Space, Table} from "antd";
import {get} from "lodash";
import Container from "../../../components/Container.jsx";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import {CheckOutlined, EditOutlined} from "@ant-design/icons";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";

const OrdersContainer = () => {
    const [status, setStatus] = useState(null);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const { t } = useTranslation();

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.order_list,
        url: URLS.order_list,
        params: {
            params: {
                size: 10,
                status
            }
        },
        page
    });

    const {mutate:accept} = usePatchQuery({})
    const useEdit = (id) => {

    }
    const useAccept = (id) => {
        accept({url: `${URLS.order_accept}/${id}`, attributes: {accept: true}})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Pharmacy"),
            dataIndex: "pharmacy",
            key: "pharmacy"
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber"
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status"
        },
        {
            title: t("Total price"),
            dataIndex: "totalPrice",
            key: "totalPrice"
        },
        {
            title: t("Created time"),
            dataIndex: "createdTime",
            key: "createdTime"
        },
        {
            title: t("Edit"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Button icon={<EditOutlined />} onClick={() => {
                    setSelected(data)
                }} />
            )
        },
        {
            title: t("Accept"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Popconfirm
                    title={t("Accept")}
                    description={t("Are you sure to accept?")}
                    onConfirm={() => useAccept(get(data,'id'))}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button icon={<CheckOutlined />}/>
                </Popconfirm>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setStatus(e.target.value)}
                        allowClear
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default OrdersContainer;