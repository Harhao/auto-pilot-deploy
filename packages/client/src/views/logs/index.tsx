import animation from '@/component/Animation';
import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import Search from 'antd/es/input/Search';

import { getLogsList, rollBack } from '@/api';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Modal, Space, Table, Tag, message } from 'antd';
import { EResponseMap, deployStatus } from '@/const';
import { useDebounceFn, useMount } from 'ahooks';

import './index.less';

interface DataType {
  _id: string;
  commitMsg: string;
  logName: string;
  status: number;
}

function Logs() {
  const params = useParams();
  const [queryParams, setQueryParams] = useState<any>({
    projectId: '',
    commitMsg: '',
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);
  const navigate = useNavigate();

  const getLogList = async (params = queryParams) => {
    const resp = await getLogsList(params);
    if (resp.code === EResponseMap.SUCCESS) {
      setList(resp.data.list);
      setTotal(resp.data.total);
      return;
    }
    setList([]);
    setTotal(0);
  };

  const rollBackHandle = async (commitMsg: string) => {
    const data = { projectId: params.id!, commitMsg: commitMsg ?? '' };
    const res = await rollBack(data);
    if (res.code === EResponseMap.SUCCESS) {
      const logId = res.data.logId;
      navigate(`/dashboard/logsDetail/${params.id}/${logId}`);
      message.success('开始回滚项目');
    }
  };

  const { run } = useDebounceFn(
    () => {
      let commitMsg = '';
      Modal.confirm({
        centered: true,
        title: '输入备注',
        content: (
          <Input
            placeholder="请输入回滚信息备注"
            onChange={(e) => (commitMsg = e.target.value)}
          />
        ),
        onOk: () => {
          rollBackHandle(commitMsg);
        },
      });
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (queryParams.projectId) {
      getLogList(queryParams);
    }
  }, [queryParams]);

  useMount(() => {
    if (params.id) {
      setQueryParams({
        ...queryParams,
        projectId: params.id,
      });
    }
  });

  const columns: ColumnsType<DataType> = [
    {
      title: '日志名',
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
      render: (_, data) => {
        const status: number = data.status;
        const { color, msg } = deployStatus[status];
        return <Tag color={color}>{msg}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              size="small"
              onClick={() =>
                navigate(`/dashboard/logsDetail/${params.id}/${data._id}`)
              }
            >
              详情
            </Button>
            <Button danger type="primary" size="small" onClick={run}>
              回滚
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="logs-container">
      <Space size="small" wrap className="logs-header">
        <Search
          placeholder="输入要搜索的提交备注"
          onSearch={(value: string) => {
            setQueryParams({ ...queryParams, commitMsg: value, pageNum: 1 });
          }}
          style={{ width: 200 }}
        />
      </Space>
      <Table
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
}

export default animation(Logs);
