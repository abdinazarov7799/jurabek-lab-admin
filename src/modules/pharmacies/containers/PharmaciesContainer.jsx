import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import Container from "../../../components/Container.jsx";
import {Button, Input, Pagination, Popconfirm, Row, Space, Table, Upload} from "antd";
import {get} from "lodash";
import {DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import usePostQuery from "../../../hooks/api/usePostQuery.js";

const PharmaciesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading} = usePaginateQuery({
        key: KEYS.pharmacies_list,
        url: URLS.pharmacies_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });
    const { mutate:fileUpload } = usePostQuery({});

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.pharmacies_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.pharmacies_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("Region"),
            dataIndex: "region",
            key: "region"
        },
        {
            title: t("Address"),
            dataIndex: "address",
            key: "address"
        },
        {
            title: t("District"),
            dataIndex: "district",
            key: "district"
        },
        {
            title: t("Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Popconfirm
                    title={t("Delete")}
                    description={t("Are you sure to delete?")}
                    onConfirm={() => useDelete(get(data,'id'))}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button danger icon={<DeleteOutlined />}/>
                </Popconfirm>
            )
        }
    ]

    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        fileUpload(
            { url: URLS.pharmacies_add, attributes: formData, config: { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' } } },
            {
                onSuccess: () => {
                    onSuccess(true);
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
    };
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
                    />
                    <Upload
                        accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}
                        multiple={false}
                        customRequest={customRequest}
                        showUploadList={{showRemoveIcon:false}}
                    >
                        <Button icon={<UploadOutlined />}>{t("Upload excel file")}</Button>
                    </Upload>
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
export default PharmaciesContainer;