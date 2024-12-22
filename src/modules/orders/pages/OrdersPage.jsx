import React from 'react';
import OrdersContainer from "../containers/OrdersContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const OrdersPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ORDER_MANAGER]}><OrdersContainer /></HasAccess>
};

export default OrdersPage;