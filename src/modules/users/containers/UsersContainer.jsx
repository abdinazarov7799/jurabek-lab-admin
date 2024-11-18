import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Pagination, Popconfirm, Row, Space, Switch, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {LockOutlined, UnlockOutlined} from "@ant-design/icons";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading} = usePaginateQuery({
        key: KEYS.users_list,
        url: URLS.users_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const {mutate:block} = usePutQuery({listKeyId: KEYS.users_list})

    const useBlock = (id,isBlock) => {
        block({url: `${URLS.user_block}/${id}?block=${isBlock}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("First name"),
            dataIndex: "firstName",
            key: "firstName"
        },
        {
            title: t("Last name"),
            dataIndex: "lastName",
            key: "lastName"
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Registered"),
            dataIndex: "registered",
            key: "registered",
            render: (props,data) => {
                return (
                    <Switch disabled value={get(data,'registered')}/>
                )
            }
        },
        {
            title: t("Blocked"),
            dataIndex: "blocked",
            key: "registered",
            render: (props,data) => {
                return (
                    <Switch disabled value={get(data,'blocked')}/>
                )
            }
        },
        {
            title: t("Block / Un block"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data) => {
                return (
                    <Space>
                        <Popconfirm
                            title={t("Block")}
                            description={t("Are you sure to block?")}
                            onConfirm={() => useBlock(get(data,'id'),true)}
                            okText={t("Yes")}
                            cancelText={t("No")}
                        >
                            <Button danger icon={<LockOutlined />}/>
                        </Popconfirm>
                        <Popconfirm
                            title={t("Un block")}
                            description={t("Are you sure to unblock?")}
                            onConfirm={() => useBlock(get(data,'id'),false)}
                            okText={t("Yes")}
                            cancelText={t("No")}
                        >
                            <Button type={"primary"} icon={<UnlockOutlined />}/>
                        </Popconfirm>
                    </Space>
                )
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

export default UsersContainer;
