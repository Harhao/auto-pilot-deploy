import React, { useEffect, useState } from "react";
import animation from '@/component/animation';
import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getProjectList } from "@/api";
import { EResponseMap } from "@/const";
import { useNavigate } from "react-router-dom";

interface DataType {
  _id: string;
  gitUrl: string;
  branch: string;
  dest: string;
  type: string;
}

const Project: React.FC = () => {

  const [list, setList] = useState<any[]>([]);
  const navigate = useNavigate();

  const onGetProjects = async () => {
    const res: any = await getProjectList({});
    if (res.code === EResponseMap.SUCCESS) {
      setList(res.data);
    }
  }

  useEffect(() => {
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
      title: '操作',
      key: 'action',
      render: (_, data) => {
        return (
          <Space size="middle">
            <Button danger type="primary">删除</Button>
            <Button type="primary" onClick={() => navigate(`/admin/logs/${data._id}`)}>日志</Button>
            <Button type="primary" onClick={() => navigate(`/admin/logsDetail/${data._id}`)}>部署</Button>
          </Space>
        )
      }
    },
  ];

  return <Table columns={columns} dataSource={list} />
};

export default animation(Project);