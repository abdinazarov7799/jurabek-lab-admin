import {Menu} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import config from "../../config.js";
import {hasAccess} from "../../services/auth/HasAccess.jsx";
import {useStore} from "../../store/index.js";

const DashboardSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()
    const user = useStore(state => get(state,'user',{}))
    const items = [
        {
            label: t("Transactions"),
            key: "/transactions",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN],
        },
        {
            label: t("Orders"),
            key: "/orders",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN],
        },
        {
            label: t("Products"),
            key: "/products",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_USER],
        },
        {
            label: t("Pharmacies"),
            key: "/pharmacies",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_USER],
        },
        {
            label: t("Users"),
            key: "/users",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_ADMIN],
        },
        {
            label: t("Admins"),
            key: "/admins",
            access: [config.ROLES.ROLE_SUPER_ADMIN],
        },
        {
            label: t("Constants"),
            key: "/constants",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN],
        },
        {
            label: t("Translations"),
            key: "/translations",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN],
        },
    ].filter((item) => {
        return hasAccess(get(user,'roles',[]),get(item,'access'));
    });

  return(
      <Sider
          theme={"light"}
          style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
          }}
      >
          <Menu
              mode="inline"
              style={{padding: 5}}
              onSelect={(event) => {navigate(get(event,'key','/'))}}
              items={items}
              selectedKeys={[get(location,'pathname','')]}
          />

      </Sider>
  )
}
export default DashboardSidebar
