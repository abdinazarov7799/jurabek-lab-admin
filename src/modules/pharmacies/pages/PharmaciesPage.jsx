import React from 'react';
import PharmaciesContainer from "../containers/PharmaciesContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const PharmaciesPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_USER]}><PharmaciesContainer /></HasAccess>
};

export default PharmaciesPage;