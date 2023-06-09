import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, message } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Breadcrumb from '@/component/BreadCrumb';

import { privateRoutes } from '@/routes';
import { useDispatch } from 'react-redux';
import { clearAuthToken } from '@/store/reducers/auth';
import Footer from '../Footer';
import RouteLink from '../RouteLink';

const { Header, Sider, Content } = Layout;

import './index.less';


// 侧边栏
const SideBar: React.FC<{ collapsed: boolean}> = (SideBarProps) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={SideBarProps.collapsed}
      className="layout-container_sider"
    >
      <div className="layout-logo_container">Pilot</div>
      <Menu theme="dark" mode="inline">
        {privateRoutes.children.map((route) => {
          return route.icon ? (
            <Menu.Item key={route.path} icon={route.icon}>
              <RouteLink to={`${privateRoutes.path}/${route.path}`}>
                {route.label}
              </RouteLink>
            </Menu.Item>
          ) : null;
        })}
      </Menu>
    </Sider>
  );
};

const LayoutContainer: React.FC = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logOutHandle = () => {
    dispatch(clearAuthToken());
    message.success({
      content: '退出登录',
    });
    navigate('/login', { replace: true });
  };

  return (
    <Layout rootClassName="layout-container">
      <SideBar collapsed={collapsed}/>
      <Layout>
        <Header style={{ padding: 0, background: '#ffffff' }}>
          <Space className="layout-header-wrapper">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="layout-collapsed_btn"
            />
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: <span>退出登录</span>,
                    onClick: logOutHandle,
                  },
                ],
              }}
              placement="bottom"
              arrow
            >
              <Avatar
                style={{ backgroundColor: '#87d068' }}
                icon={<UserOutlined />}
                size="small"
              />
            </Dropdown>
          </Space>
        </Header>
        <Content className="layout-main-container">
          <Breadcrumb />
          <Outlet />
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;
