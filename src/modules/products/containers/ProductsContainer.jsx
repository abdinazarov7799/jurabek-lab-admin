import React, {useEffect, useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {
    Button,
    Flex,
    Image,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Space, Switch,
    Table,
    Upload,
    Form, InputNumber
} from "antd";
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
    const [editForm] = Form.useForm();

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
                    editForm.setFieldsValue({ imageUrl: data });
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
    };

    const handleOk = () => {
  editForm.submit();
};

const onCancel = () => {
  setSelected(null);
  setImgUrl(null);
  editForm.resetFields();
};

    const onEditFinish = (values: any) => {
  mutate(
    {
      url: `${URLS.product_edit}/${get(selected, "id")}`,
      attributes: {
        name: values.name?.trim(),
        description: values.description ?? null,
        imageUrl: imageUrl ?? values.imageUrl ?? null,
        isActive: !!values.isActive,
        price: values.price ?? null,
      },
    },
    {
      onSuccess: () => {
        setImgUrl(null);
        setSelected(null);
      },
    }
  );
};


    const { mutate:mutateDelete } = useDeleteQuery({
        listKeyId: KEYS.product_list
    });
    const useDelete = (id) => {
        mutateDelete({url: `${URLS.product_delete}/${id}`})
    }

    const handleChangeActive = (isActive,productId) => {
        mutate({
            url: `${URLS.product_edit}/${productId}`,
            attributes: {isActive},
        })
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
            title: t("Is Active"),
            dataIndex: "isActive",
            key: "isActive",
            render: (checked,data) => <Switch value={checked} onClick={() => handleChangeActive(!checked,get(data,'id'))} />
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
  if (selected) {
    setImgUrl(get(selected, "imageUrl") || null);
    editForm.setFieldsValue({
      name: get(selected, "name"),
      description: get(selected, "description"),
      isActive: get(selected, "isActive"),
      price: get(selected, "price"),
      imageUrl: get(selected, "imageUrl"),
    });
  } else {
    editForm.resetFields();
    setImgUrl(null);
  }
}, [selected]);

    return(
        <Container>
            {selected && (
  <Modal
    title={get(selected, "name")}
    open={!!selected}
    onCancel={onCancel}
    onOk={handleOk}
    destroyOnClose
  >
    <Form
      form={editForm}
      layout="vertical"
      onFinish={onEditFinish}
      initialValues={{
        // xavfsizlik uchun defaultlar
        isActive: true,
      }}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[{ required: true, message: t("Name is required") }]}
      >
        <Input placeholder={t("Enter name")} />
      </Form.Item>

      {/* Price */}
      <Form.Item
        name="price"
        label={t("Price")}
        rules={[{ type: "number", min: 0, message: t("Price must be >= 0") }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder={t("Enter price")}
          formatter={(v) =>
            `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(v) => (v ? Number(v.replace(/,/g, "")) : undefined)}
        />
      </Form.Item>

      {/* IsActive */}
      <Form.Item name="isActive" label={t("Is Active")} valuePropName="checked">
        <Switch />
      </Form.Item>

      {/* Image preview + upload */}
      <Form.Item name="imageUrl" label={t("Image URL")} hidden>
        <Input />
      </Form.Item>

      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Flex justify="center">
          <Image src={imageUrl} width={300} height={300} fallback="" />
        </Flex>

        <ImgCrop quality={0.5} aspect={1} showGrid rotationSlider minZoom={-1}>
          <Dragger
            maxCount={1}
            multiple={false}
            accept=".jpg,.png,.jpeg,.svg,.webp"
            customRequest={customRequestImage}
            beforeUpload={beforeUpload}
            showUploadList={{ showRemoveIcon: false }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {t("Click or drag file to this area to upload")}
            </p>
          </Dragger>
        </ImgCrop>
      </Space>

      {/* Description */}
      <Form.Item name="description" label={t("Description")}>
        <Input.TextArea rows={4} placeholder={t("Enter description")} />
      </Form.Item>
    </Form>
  </Modal>
)}

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
