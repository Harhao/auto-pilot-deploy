import React, { useState } from 'react';
import { getServiceList } from '@/api';
import animation from '@/component/animation';
import { useParams } from 'react-router-dom';
import { Space, Table } from 'antd';
import { useMount } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import { EResponseMap } from '@/const';
import './index.less';


interface DataType {
    _id: string;
    commitMsg: string;
    logName: string;
    status: number;
  }

const Service = () => {
    const [list, setList] = useState<any[]>([]);
    const params = useParams();


    const getProjectService = async () => {
        if(params.name) {
            const resp = await getServiceList({ name: params.name });
            console.log(resp);
            if(resp.code === EResponseMap.SUCCESS) {
              setList(resp.data);
            }
        }
    };

    useMount(() => {
        getProjectService();
    });
  
    const columns: ColumnsType<DataType> = [
      {
        title: '服务名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'node版本',
        dataIndex: 'node_version',
        key: 'node_version',
      },
      {
        title: '上传地址',
        dataIndex: 'pm_cwd',
        key: 'pm_cwd',
      },
      {
        title: '发布时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'CPU占用',
        render: (_, data: any) => {
          return (
            <Space size="middle">
              {data.monit.cpu}
            </Space>
          );
        }
      },
      {
        title: '内存占用',
        render: (_, data: any) => {
          return (
            <Space size="middle">
              {data.monit.memory}
            </Space>
          );
        }
      },
      {
        title: '用户',
        dataIndex: 'USER',
        key: 'USER',
      },
      {
        title: '操作',
        key: 'action',
        render: (_, data) => {
          return (
            <Space size="middle">
              
            </Space>
          );
        }
      },
    ];
  
    return <Table columns={columns} dataSource={list} />;
};


export default animation(Service);