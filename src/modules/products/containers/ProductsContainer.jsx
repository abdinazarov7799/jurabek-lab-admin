import React, {useEffect, useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {Button, Flex, Image, Input, message, Modal, Pagination, Popconfirm, Row, Space, Table, Upload} from "antd";
import Container from "../../../components/Container.jsx";
import {DeleteOutlined, EditOutlined, InboxOutlined, UploadOutlined} from "@ant-design/icons";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import ImgCrop from "antd-img-crop";
import Resizer from "react-image-file-resizer";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
const { Dragger } = Upload;

const ProductsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);
    const [imageUrl,setImgUrl] = useState(null);
    const [description,setDescription] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.product_list,
        url: URLS.product_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const { mutate:fileUpload } = usePostQuery({});
    const { mutate:UploadImage } = usePostQuery({});
    const {mutate} = usePatchQuery({listKeyId: KEYS.product_list})

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                400,
                400,
                "WEBP",
                60,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });
    const beforeUpload = async (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error(t('Image must smaller than 10MB!'));
            return;
        }
        const uri = await resizeFile(file);
        const resizedImage = await fetch(uri).then(res => res.blob());
        return new Blob([resizedImage],{ type: "webp"});
    };
    const customRequestImage = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        UploadImage(
            { url: URLS.upload_file, attributes: formData, config: { headers: { 'Content-Type': 'multipart/form-data' } } },
            {
                onSuccess: ({ data }) => {
                    onSuccess(true);
                    setImgUrl(data);
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
    };

    const handleOk = () => {
        if (!!imageUrl || !!description) {
            mutate({
                url: `${URLS.product_edit}/${get(selected, 'id')}`,
                attributes: {imageUrl,description},
            },{
                onSuccess: () => {
                    setImgUrl(null)
                    setSelected(null);
                }
            })
        }else {
            setSelected(null);
        }
    }

    const onCancel = () => {
        setSelected(null)
        setImgUrl(null)
    }

    const { mutate:mutateDelete } = useDeleteQuery({
        listKeyId: KEYS.product_list
    });
    const useDelete = (id) => {
        mutateDelete({url: `${URLS.product_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
            width: 30
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("Description"),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t("Price"),
            dataIndex: "price",
            key: "price",
            render: (price) => Number(price).toLocaleString("en-US")
        },
        {
            title: t("Edit"),
            key: "edit",
            width: 50,
            render: (data) => (
                <Button icon={<EditOutlined />} onClick={() => setSelected(data)} />
            )
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
            { url: URLS.product_add, attributes: formData, config: { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' } } },
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

    useEffect(() => {
        setDescription(get(selected,'description'));
        setImgUrl(get(selected,'imageUrl'))
    }, [selected]);

    return(
        <Container>
            {
                selected && (
                    <Modal
                        title={get(selected,'name')}
                        open={!!selected}
                        onCancel={onCancel}
                        onOk={handleOk}
                    >
                        <Space direction="vertical" style={{width:'100%'}} size={"middle"}>
                            <Flex justify={"center"}>
                                <Image src={imageUrl} width={400} height={400} />
                            </Flex>
                            <ImgCrop quality={0.5} aspect={1} showGrid rotationSlider minZoom={-1}>
                                <Dragger
                                    maxCount={1}
                                    multiple={false}
                                    accept={".jpg,.png,jpeg,svg"}
                                    customRequest={customRequestImage}
                                    beforeUpload={beforeUpload}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                                </Dragger>
                            </ImgCrop>
                            <Input.TextArea value={description} onChange={e => setDescription(e.target.value)} />
                        </Space>
                    </Modal>
                )
            }
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
    )
}
export default ProductsContainer