import { Space } from 'antd';
import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import './index.less';

export default function Footer() {
  return (
    <Space className="footer-container">
      <GithubOutlined/>
      <a href="">自动发布部署平台</a>
    </Space>
  );
}
