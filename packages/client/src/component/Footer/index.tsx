import { Space } from "antd";
import React from "react";
import { GithubOutlined } from "@ant-design/icons";
import './index.less';

export default function Footer() {
  return (
    <Space className="footer-container">
      <GithubOutlined/>
      <a href="">auto-pilot-deploy</a>
    </Space>
  );
}
