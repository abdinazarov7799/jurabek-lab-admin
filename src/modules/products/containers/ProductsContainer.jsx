import React, {useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {Button, Input, Pagination, Row, Space, Table, Typography, Upload} from "antd";
import Container from "../../../components/Container.jsx";
import {UploadOutlined} from "@ant-design/icons";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
const { Link } = Typography;
const ProductsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();

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
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 50,
            render: (props, data) => (
                <Link href={get(data,'imageUrl')} target="_blank">{t("Image")}</Link>
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
