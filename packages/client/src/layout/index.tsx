import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space } from "antd";
import { Outlet, Link } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { privateRoutes } from "@/routes";
import "./index.scss";

const { Header, Sider, Content } = Layout;

const LayoutContainer: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

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
                label: (
                  <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    退出登录
                  </a>
                ),
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
