import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import Container from "../../../components/Container.jsx";
import {Input, Pagination, Row, Space, Table} from "antd";
import {get} from "lodash";

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
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
        },
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