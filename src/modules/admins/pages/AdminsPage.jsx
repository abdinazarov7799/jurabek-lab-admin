import React from 'react';
import AdminsContainer from "../containers/AdminsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const AdminsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}><AdminsContainer /></HasAccess>
};
export default AdminsPage;
