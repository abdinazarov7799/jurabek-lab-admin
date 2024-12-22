import React from 'react';
import UsersContainer from "../containers/UsersContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const UsersPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ADMIN]}><UsersContainer /></HasAccess>
};
export default UsersPage;
