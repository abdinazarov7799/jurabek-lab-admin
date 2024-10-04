import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get, isEqual} from "lodash";
import {Button, Modal, Row, Space, Table} from "antd";
import {useTranslation} from "react-i18next";
import EditConstants from "../components/EditConstants.jsx";
import {EditOutlined} from "@ant-design/icons";

const ConstantsContainer = () => {
    const {t} = useTranslation();
    const [isModalOpen,setIsModalOpen] = useState(false);
    let constants = []
    const {data,isLoading,refetch} = useGetAllQuery({
        key: KEYS.constants_list,
        url: URLS.constants_list,
    })
    const columns = [
        {
            title: t("Key"),
            dataIndex: "key",
            key: "key",
        },
        {
            title: t("Value"),
            dataIndex: "value",
            key: "value",
        }
    ]
    for (const [key, value] of Object.entries(get(data,'data',{}))) {
        !isEqual(key, 'id') && constants.push({key, value})
    }
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Row justify={"end"}>
                    <Button
                        icon={<EditOutlined />}
                        type={"primary"}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t("Edit")}
                    </Button>
                </Row>
                <Table
                    columns={columns}
                    dataSource={constants}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />
            </Space>
            <Modal
                title={t('Edit')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <EditConstants setIsModalOpen={setIsModalOpen} refetch={refetch} data={constants} />
            </Modal>
        </Container>
    );
};

export default ConstantsContainer;