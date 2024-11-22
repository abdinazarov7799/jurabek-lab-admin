import React, {useEffect, useState} from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get} from "lodash";
import useGetOneQuery from "../../../hooks/api/useGetOneQuery.js";
import {Button, Col, Divider, Image, InputNumber, Popconfirm, Row, Select, Space, Spin, Typography} from "antd";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {CloseOutlined} from "@ant-design/icons";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import usePatchQuery from "../../../hooks/api/usePutQuery.js";
const {Text,Title} = Typography;

const OrderEdit = ({selected,setSelected,getStatusColor}) => {
    const id = get(selected,'id')
    const {t} = useTranslation()
    const [order,setOrder] = useState(selected)
    const [search,setSearch] = useState(null)
    const [selectedProducts,setSelectedProducts] = useState([]);
    const {data,isLoading} = useGetOneQuery({
        id,
        key: `${KEYS.order_products}_${id}`,
        url: URLS.order_products,
        params: {
            page: 0,
            size: 1000
        },
        enabled: !!id
    })
    const {data:products,isLoading:isLoadingProducts,refetch:refetchProducts} = useGetAllQuery({
        key: KEYS.product_list,
        url: URLS.product_list,
        params: {
            params: {
                search,
                page: 0,
                size: 50
            }
        }
    })
    const {mutate,isLoading:isLoadingEdit} = usePatchQuery({
        listKeyId: KEYS.order_list
    })

    useEffect(() => {
        refetchProducts()
    },[search])

    useEffect(() => {
        setOrder({
            ...selected,
            products: get(data,'data.content',[])
        })
    },[selected,data])

    const onEditOrder = () => {
        mutate({
            url: `${URLS.order_edit}/${get(selected,'id')}`,
            attributes: {
                pharmacyPhoneNumber: get(selected,'phoneNumber'),
                products: get(order,'products')?.map(product=> ({productId: get(product,'id'), quantity: get(product,'quantity')})),
            }
        },{
            onSuccess: () => {
                setSelected(null)
            }
        })
    }

    const deleteProduct = (id) => {
        const updatedProducts = get(order,'products').filter(product => product.id !== id);
        setOrder({
            ...order,
            products: updatedProducts
        });
    }

    const onChange = (value,data) => {
        setSelectedProducts(data);
    }
    const onSaveOrder = () => {
        const updatedOrderProducts = [...get(order, 'products')];

        selectedProducts.forEach(selectedProduct => {
            const existingProduct = updatedOrderProducts.find(product => product.id === selectedProduct.value);
            if (!existingProduct) {
                updatedOrderProducts.push({
                    ...get(selectedProduct, 'productData'),
                    quantity: 1
                });
            }
        });

        setOrder({
            ...order,
            products: updatedOrderProducts
        });
        setSelectedProducts([]);
    };

    const onChangeQuantity = (id, quantity) => {
        const updatedProducts = get(order, 'products', []).map(product =>
            product.id === id ? { ...product, quantity } : product
        );
        setOrder({
            ...order,
            products: updatedProducts
        });
    };

    return (
        <div>
            <Divider style={{marginTop: 0}}/>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Full name")}</Title>
                    <Text>{get(order,'fullName')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("User phone")}</Title>
                    <Text>{get(order,'userPhone')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Address")}</Title>
                    <Text>{get(order,'address')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Address")}</Title>
                    <Text>{get(order,'address')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Pharmacy")}</Title>
                    <Text>{get(order,'pharmacy')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("INN")}</Title>
                    <Text>{get(order,'inn')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Phone")}</Title>
                    <Text>{get(order,'phoneNumber')}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Created time")}</Title>
                    <Text>{dayjs(get(order,'createdTime')).format("YYYY-MM-DD HH:mm:ss")}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Total price")}</Title>
                    <Text>{Number(get(order,'totalPrice')).toLocaleString("en-US")} {t("so'm")}</Text>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                    <Title level={5}>{t("Status")}</Title>
                    <Text type={getStatusColor(get(order,'status'))}>{get(order,'status')}</Text>
                </Row>
                <Spin spinning={isLoading}>
                    <Space direction={"vertical"} style={{width: "100%"}} >
                        {
                            get(order,'products',[])?.map(product => {
                                return (
                                    <Row gutter={10} key={get(product,'id')}>
                                        <Col span={2}>
                                            <Image src={get(product,'imageUrl')} width={50} height={50} />
                                        </Col>
                                        <Col span={12}>
                                            <Text ellipsis>{get(product,'name')}{get(product,'name')}{get(product,'name')}{get(product,'name')}{get(product,'name')}{get(product,'name')}</Text>
                                        </Col>
                                        <Col>
                                            <Text>{get(product,'price')?.toLocaleString("en-US")} {t("so'm")}</Text>
                                        </Col>
                                        <Col span={3}>
                                            <InputNumber
                                                style={{width:80}}
                                                type={"number"}
                                                value={get(product,'quantity')}
                                                min={0}
                                                onChange={(value) => onChangeQuantity(get(product, 'id'), value)}
                                            />
                                        </Col>
                                        <Col span={3}>
                                            <Text>{Number(get(product,'price') * get(product,'quantity'))?.toLocaleString("en-US")} {t("so'm")}</Text>
                                        </Col>
                                        <Col span={1}>
                                            <Popconfirm
                                                title={t("Delete")}
                                                description={t("Are you sure to delete")}
                                                onConfirm={() => deleteProduct(get(product,'id'))}
                                                okText={t("Yes")}
                                                cancelText={t("No")}
                                            >
                                                <Button danger icon={<CloseOutlined />}/>
                                            </Popconfirm>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                    </Space>
                </Spin>
                <Row gutter={30}>
                    <Col span={20}>
                        <Select
                            showSearch
                            placeholder={t("Select a medicine")}
                            optionFilterProp="label"
                            onChange={onChange}
                            mode="multiple"
                            style={{width: "100%"}}
                            value={selectedProducts}
                            loading={isLoadingProducts}
                            onSearch={(value) => setSearch(value)}
                            options={get(products,'data.content',[])?.map(product => {
                                return {
                                    label: get(product,'name'),
                                    value: get(product,'id'),
                                    productData: product
                                }
                            })}
                        />
                    </Col>
                    <Col span={4}>
                        <Button type={"primary"} block onClick={onSaveOrder}>
                            {t("Add")}
                        </Button>
                    </Col>
                </Row>
                <Button type={"primary"} block onClick={onEditOrder} loading={isLoadingEdit}>{t("Save")}</Button>
            </Space>
        </div>
    );
};

export default OrderEdit;