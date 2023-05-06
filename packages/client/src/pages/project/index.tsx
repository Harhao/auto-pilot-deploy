import React, { useEffect, useState } from 'react';
import animation from '@/component/animation';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getProjectList, getServiceList } from '@/api';
import { EResponseMap } from '@/const';
import { useNavigate } from 'react-router-dom';

interface DataType {
  _id: string;
  gitUrl: string;
  branch: string;
  dest: string;
  type: string;
}

const getRepoName = (url: string) => {
  const pattern = /^.*?\/\/.*?\/([\w-]+)\/([\w-]+?)(\.git)?$/;
  const match = url.match(pattern);
  return match?.[2] ?? null;
};

const Project: React.FC = () => {

  const [list, setList] = useState<any[]>([]);
  const [serviceList, setServices] = useState<any[]>([]);
  const navigate = useNavigate();

  const onGetProjects = async () => {
    const res: any = await getProjectList();
    if (res.code === EResponseMap.SUCCESS) {
      setList(res.data);
    }
  };

  const onGetServices = async () => {
    const res: any = await getServiceList({});
    if (res.code === EResponseMap.SUCCESS) {
      setServices(res.data);
    }
  };

  useEffect(() => {
    onGetServices();
    onGetProjects();
  }, []);


  const columns: ColumnsType<DataType> = [
    {
      title: '项目id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Git地址',
      dataIndex: 'gitUrl',
      key: 'gitUrl',
    },
    {
      title: '分支',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: '部署目录',
      dataIndex: 'dest',
      key: 'dest',
    },
    {
      title: '项目类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '构建工具',
      dataIndex: 'tool',
      key: 'tool',
    },
    {
      title: '服务',
      key: 'status',
      render: (_, data) => {
        const name = getRepoName(data.gitUrl);
        const service = serviceList.find(item => item.name === name);
        const color = service?.status === 'online' ? 'green': 'red';

        return (
          <Space size="small">
            { service ? <Tag color={color}>{service?.status}</Tag>: <span>/</span>}
          </Space>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, data) => {
        const name = getRepoName(data.gitUrl);
        return (
          <Space size="small">
            <Button type="primary" size="small" onClick={() => navigate(`/admin/service/${name}`)}>服务</Button>
            <Button type="primary" size="small" onClick={() => navigate(`/admin/logs/${data._id}`)}>日志</Button>
            <Button type="primary" size="small" onClick={() => navigate(`/admin/logsDetail/${data._id}`)}>部署</Button>
          </Space>
        );
      }
    },
  ];

  return <Table columns={columns} dataSource={list} />;
};

export default animation(Project);