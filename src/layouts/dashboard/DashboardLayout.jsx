import React from 'react';
import { Layout, } from 'antd';
import {Outlet} from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
const { Content} = Layout;



const DashboardLayout = () => {

  return(
      <Layout hasSider>

          <DashboardSidebar />

          <Layout style={{marginLeft: 200, minHeight: '100vh'}}>
              <DashboardHeader />

              <Content
                  style={{
                      padding: '24px 16px',
                      overflow: 'initial',
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start"
                  }}
              >
                  <Outlet />
              </Content>

          </Layout>
      </Layout>
  )
}
export default DashboardLayout
