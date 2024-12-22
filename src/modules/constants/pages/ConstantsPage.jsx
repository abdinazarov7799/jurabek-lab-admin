import React from 'react';
import ConstantsContainer from "../containers/ConstantsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const ConstantsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN]}><ConstantsContainer /></HasAccess>
};

export default ConstantsPage;