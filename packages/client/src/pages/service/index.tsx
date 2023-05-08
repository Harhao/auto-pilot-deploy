import React, { useState } from 'react';
import { getServiceList } from '@/api';
import animation from '@/component/animation';
import { useParams } from 'react-router-dom';
import { Space, Table } from 'antd';
import { useMount } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import './index.scss';


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
        }
    };

    useMount(() => {
        getProjectService();
    });
  
    const columns: ColumnsType<DataType> = [
      {
        title: '日志id',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: '提交备注',
        dataIndex: 'commitMsg',
        key: 'commitMsg',
      },
      {
        title: '提交commit',
        dataIndex: 'logName',
        key: 'logName',
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