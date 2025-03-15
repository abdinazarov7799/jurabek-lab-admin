import React, {useState} from 'react';
import {Button, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get, isEqual} from "lodash";
import Container from "../../../components/Container.jsx";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import OrderEdit from "../components/OrderEdit.jsx";
import dayjs from "dayjs";
import {hasAccess} from "../../../services/auth/HasAccess.jsx";
import {useStore} from "../../../store/index.js";
import config from "../../../config.js";
import {useNavigate} from "react-router-dom";
const {Text} = Typography;

const OrdersContainer = () => {
    const [status, setStatus] = useState(null);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useStore(state => get(state,'user',{}))

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

    const useAccept = (id,isAccept) => {
        accept({url: `${URLS.order_accept}/${id}?accept=${isAccept}`})
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED" : return "success"
            case "REJECTED" : return "danger"
            case "SENT" : return "warning"
        }
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Full name"),
            dataIndex: "fullName",
            key: "fullName",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("User phone"),
            dataIndex: "userPhone",
            key: "userPhone",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Pharmacy"),
            dataIndex: "pharmacy",
            key: "pharmacy",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("INN"),
            dataIndex: "inn",
            key: "inn",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
            render: (text) => <Text type={getStatusColor(text)}>{text}</Text>,
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Total price"),
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => Number(price).toLocaleString("en-US"),
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Created time"),
            dataIndex: "createdTime",
            key: "createdTime",
            width: 120,
            render: (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Updated time"),
            dataIndex: "updatedTime",
            key: "updatedTime",
            width: 120,
            render: (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Updated by"),
            dataIndex: "updatedBy",
            key: "updatedBy",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Edit"),
            width: 50,
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Button icon={<EditOutlined />} onClick={() => {
                    setSelected(data)
                }} />
            ),
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER],
        },
        {
            title: t("Reject / Accept"),
            width: 90,
            fixed: 'right',
            key: 'action',
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN],
            render: (props, data) => {
                if (!isEqual(get(data,'status'),'SENT')){
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
    ].filter((item) => {
        return hasAccess(get(user,'roles',[]),get(item,'access'));
    });
    return (
        <Container>
            <Modal
                title={get(selected,'phoneNumber')}
                open={!!selected}
                onCancel={() => {setSelected(null)}}
                footer={null}
                width={1300}
            >
                <OrderEdit selected={selected} setSelected={setSelected} getStatusColor={getStatusColor}/>
            </Modal>
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
                    onRow={(props) => {
                        return {onDoubleClick: () => navigate(`/order/view/${get(props,'id')}`)}
                    }}
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
