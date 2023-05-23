import React, { useState } from 'react';
import animation from '@/component/Animation';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  IQueryProjects,
  getPilotList,
} from '@/api';
import { EResponseMap, Eenviroment } from '@/const';
import { useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';

import './index.less';

interface DataType {
  _id: string;
  gitUrl: string;
  branch: string;
  dest: string;
  type: string;
}

const Project: React.FC = () => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<IQueryProjects>({
    name: '',
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);

  const onGetPilotConfig = async () => {
    const res = await getPilotList({});
    if (res.code === EResponseMap.SUCCESS) {
      const { list, total } = res.data;
      setList(list);
      setTotal(total);
    }
  };

  const onAddPilot = () => {
    navigate('/');
  };

  useMount(() => {
    onGetPilotConfig();
  });

  const columns: ColumnsType<DataType> = [
    {
      title: '服务器地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '帐号',
      dataIndex: 'account',
      key: 'account',
      align: 'center',
    },
    {
      title: 'Git用户',
      dataIndex: 'gitUser',
      key: 'gitUser',
      align: 'center',
    },
    {
      title: 'git授权token',
      dataIndex: 'gitPass',
      key: 'gitPass',
      align: 'center',
    },
    {
      title: '服务器密码',
      dataIndex: 'serverPass',
      key: 'serverPass',
      align: 'center',
    },
    {
      title: '环境',
      dataIndex: 'env',
      key: 'env',
      align: 'center',
      render: (_, data: any) => {
        const env: keyof typeof Eenviroment = data.env;
        return (
          <Tag>
            {Eenviroment[env]}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, data) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              onClick={() => navigate(`/dashboard/setting/edit/${data._id}`)}
            >
              编辑
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="setting-container">
      <Space size="small" wrap className="setting-header">
        <Button type="primary" onClick={onAddPilot}>
          添加项目
        </Button>
      </Space>
      <Table
        bordered
        columns={columns}
        dataSource={list}
        pagination={{
          pageSize: queryParams.pageSize,
          current: queryParams.pageNum,
          total: total,
          onChange: (page, pageSize) => {
            setQueryParams({
              ...queryParams,
              pageNum: page,
              pageSize: pageSize,
            });
          },
        }}
      />
    </div>
  );
};

export default animation(Project);
