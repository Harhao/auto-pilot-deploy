import React, { useEffect, useState } from 'react';
import { getLogsList } from '@/api';
import animation from '@/component/animation';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './index.scss';


interface DataType {
    _id: string;
    commitMsg: string;
    logName: string;
    status: number;
  }

function Logs() {
    const [list, setList] = useState<any[]>([]);
    const params = useParams();
    const navigate = useNavigate();
    const getLogList = async () => {
        const resp = await getLogsList({ projectId: params.id });
        setList(resp.data);
    };

    useEffect(() => {
        if (params.id) {
          getLogList();
        }
    }, []);
  
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
        title: '构建状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '操作',
        key: 'action',
        render: (_, data) => {
          return (
            <Space size="middle">
              <Button type="primary" size="small" onClick={() => navigate(`/admin/logsDetail/${params.id}/${data._id}`)}>详情</Button>
              <Button danger type="primary" size="small">回滚</Button>
            </Space>
          );
        }
      },
    ];
  
    return <Table columns={columns} dataSource={list} />;
}


export default animation(Logs);