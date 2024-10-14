import React from 'react';
import {Col, Image, Input, Row, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
const {Text} = Typography;

const EditedProduct = ({product}) => {
    const {t} = useTranslation();
    return (
        <Row>
            <Col span={2}>
                <Image src={get(product,'imageUrl')} width={50} height={50} />
            </Col>
            <Col flex={"auto"}>
                <Text>{get(product,'name')}</Text>
            </Col>
            <Col span={3}>
                <Text>{get(product,'price')?.toLocaleString("en-US")} {t("so'm")}</Text>
            </Col>
            <Col span={2}>
                <Input type={"number"} value={get(product,'quantity')}/>
            </Col>
        </Row>
    );
};

export default EditedProduct;