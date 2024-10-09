import React, {useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {Button, Flex, Image, Input, message, Modal, Pagination, Row, Space, Table, Upload} from "antd";
import Container from "../../../components/Container.jsx";
import {EditOutlined, InboxOutlined, UploadOutlined} from "@ant-design/icons";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import ImgCrop from "antd-img-crop";
const { Dragger } = Upload;

const ProductsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);
    const [imageUrl,setImgUrl] = useState(null);

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
    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });
    const {mutate} = usePatchQuery({})

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
        if (!!imageUrl) {
            mutate({
                url: `${URLS.product_edit}/${get(selected, 'id')}`,
                attributes: imageUrl,
            },{
                onSuccess: () => {
                    setSelected(null);
                }
            })
        }else {
            setSelected(null);
        }
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
            title: t("Price"),
            dataIndex: "price",
            key: "price",
        },
        {
            title: t("Image"),
            key: "imageUrl",
            width: 50,
            render: (data) => (
                <Button icon={<EditOutlined />} onClick={() => setSelected(data)} />
            )
        },
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

    return(
      <Container>
          {
              selected && (
                  <Modal
                      title={get(selected,'name')}
                      open={!!selected}
                      onCancel={() => setSelected(null)}
                      onOk={handleOk}
                  >
                      <Space direction="vertical" style={{width:'100%'}} size={"middle"}>
                          <Flex justify={"center"}>
                              <Image src={imageUrl ?? get(selected,'imageUrl')} width={400} height={400} />
                          </Flex>
                          <ImgCrop quality={0.5} aspect={1}>
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
