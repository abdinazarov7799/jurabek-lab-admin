import React from 'react';
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";
import OrderViewContainer from "../containers/OrderViewContainer.jsx";
import {useParams} from "react-router-dom";

const OrderViewPage = () => {
    const {id} = useParams();
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER]}><OrderViewContainer id={id}/></HasAccess>
};

export default OrderViewPage;
