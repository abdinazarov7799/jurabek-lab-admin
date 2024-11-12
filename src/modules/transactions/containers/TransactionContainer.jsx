import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import Container from "../../../components/Container.jsx";
import {Button, Input, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get, isEqual} from "lodash";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
const {Text} = Typography

const TransactionContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading} = usePaginateQuery({
        key: KEYS.transactions_list,
        url: URLS.transaction_list,
        params: {
            params: {
                size: 10,
                status: searchKey
            }
        },
        page
    });

    const {mutate:accept} = usePatchQuery({listKeyId: KEYS.transactions_list})

    const useAccept = (id,isAccept) => {
        accept({url: `${URLS.transaction_accept}/${id}?paidOrRejected=${isAccept}`})
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "DONE" : return "success"
            case "REJECTED" : return "danger"
            case "WAITING" : return "warning"
        }
    }

    const columns = [
        {
            title: t("Number"),
            dataIndex: "number",
            key: "number",
        },
        {
            title: t("Phone"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Card"),
            dataIndex: "card",
            key: "card",
        },
        {
            title: t("Amount"),
            dataIndex: "amount",
            key: "amount",
            render: (price) => Number(price).toLocaleString("en-US")
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
            render: (text) => <Text type={getStatusColor(text)}>{text}</Text>
        },
        {
            title: t("Reject / Accept"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data) => {
                if (!isEqual(get(data,'status'),'WAITING')){
                    return <></>
                }else {
                    return (
                        <Space>
                            <Popconfirm
                                title={t("Reject")}
                                description={t("Are you sure to reject?")}
                                onConfirm={() => useAccept(get(data,'id'),false)}
                                okText={t("Yes")}
                                cancelText={t("No")}
                            >
                                <Button danger icon={<CloseOutlined />}/>
                            </Popconfirm>
                            <Popconfirm
                                title={t("Accept")}
                                description={t("Are you sure to accept?")}
                                onConfirm={() => useAccept(get(data,'id'),true)}
                                okText={t("Yes")}
                                cancelText={t("No")}
                            >
                                <Button type={"primary"} icon={<CheckOutlined />}/>
                            </Popconfirm>
                        </Space>
                    )
                }
            }
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
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


export default TransactionContainer;