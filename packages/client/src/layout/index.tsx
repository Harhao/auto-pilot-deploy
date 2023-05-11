import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space, message } from "antd";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { privateRoutes } from "@/routes";
import { useAuth } from "@/hooks/auth";

import "./index.less";

const { Header, Sider, Content } = Layout;

const LayoutContainer: React.FC = () => {

  const auth = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logOutHandle = () => {
    auth.signout(() => {
      message.success({
        content: '退出登录'
      });
      navigate('/login', { replace: true });
    });
  }

  return (
    <Layout rootClassName="layout-container">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="layout-container_sider"
      >
        <div className="layout-logo_container">Pilot</div>
        <Menu theme="dark" mode="inline">
          {privateRoutes.children.map((route) => {

            return (
              route.icon ? <Menu.Item key={route.path} icon={route.icon}>
                <Link to={route.path}>{route.label}</Link>
              </Menu.Item> : null
            );
          })}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#ffffff' }}>
          <Space className="layout-header-wrapper">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="layout-collapsed_btn"
            />
            <Dropdown menu={{
              items: [{
                key: '1',
                label: <span>退出登录</span>,
                onClick: logOutHandle,
              },]
            }} placement="bottom" arrow>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="small" />
            </Dropdown>
          </Space>
        </Header>
        <Content
          className="layout-main-container"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;
