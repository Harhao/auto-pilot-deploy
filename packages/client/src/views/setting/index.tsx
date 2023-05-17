import React, { useEffect, useState } from 'react';
import animation from '@/component/Animation';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  IQueryProjects,
  getProjectList,
  getServiceList,
} from '@/api';
import { EResponseMap } from '@/const';
import { useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';
import { getRepoName } from '@/utils';

import './index.less';

interface DataType {
  _id: string;
  gitUrl: string;
  branch: string;
  dest: string;
  type: string;
}

const Project: React.FC = () => {
  const [queryParams, setQueryParams] = useState<IQueryProjects>({
    name: '',
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);
  const [serviceList, setServices] = useState<any[]>([]);
  const navigate = useNavigate();

  const onGetProjects = async (params = queryParams) => {
    const res: any = await getProjectList(params);
    if (res.code === EResponseMap.SUCCESS) {
      setList(res.data.list);
      setTotal(res.data.total);
    }
  };

  const onGetServices = async () => {
    const res: any = await getServiceList({});
    if (res.code === EResponseMap.SUCCESS) {
      setServices(res.data);
    }
  };

  useEffect(() => {
    onGetProjects(queryParams);
  }, [queryParams]);

  useMount(() => {
    onGetServices();
  });

  const columns: ColumnsType<DataType> = [
    {
      title: '服务器地址',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '服务器帐号',
      dataIndex: 'gitUrl',
      key: 'gitUrl',
      align: 'center',
    },
    {
      title: 'Git用户',
      dataIndex: 'branch',
      key: 'branch',
      align: 'center',
    },
    {
      title: 'git授权token',
      dataIndex: 'dest',
      key: 'dest',
      align: 'center',
    },
    {
      title: '发布环境',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
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
    <div className="project-container">
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
