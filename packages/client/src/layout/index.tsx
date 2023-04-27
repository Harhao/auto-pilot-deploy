import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { privateRoutes } from '@/routes';
import './index.scss';

const { Header, Sider, Content } = Layout;

const LayoutContainer: React.FC = () => {

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout rootClassName="layout-container">
      <Sider trigger={null} collapsible collapsed={collapsed} className="layout-container_sider">
        <div className="layout-logo_container"></div>
        <Menu
          theme="dark"
          mode="inline"
        >
          {
            privateRoutes.children.map(route => {
              return (
                <Menu.Item
                  key={route.path}
                  icon={route.icon}
                >
                  <Link to={route.path}>{route.label}</Link>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className='layout-collapsed_btn'
          />
        </Header>
        <Content
          className='layout-main-container'
          style={{
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;