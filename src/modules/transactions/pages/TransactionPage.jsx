import React from 'react';
import TransactionContainer from "../containers/TransactionContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const TransactionPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN]}><TransactionContainer /></HasAccess>
};

export default TransactionPage;