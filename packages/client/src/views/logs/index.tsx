import animation from "@/component/Animation";
import React, {useState } from "react";
import type { ColumnsType } from "antd/es/table";

import { getLogsList, rollBack } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Modal, Space, Table, Tag } from "antd";
import { EResponseMap, deployStatus } from "@/const";
import { useDebounceFn, useMount } from "ahooks";

import "./index.less";


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
    if(resp.code === EResponseMap.SUCCESS) {
      setList(resp.data);
    }
  };

  const rollBackHandle = async (commitMsg: string) => {
    const data = {projectId: params.id!, commitMsg: commitMsg ?? ''};
    const resp =  await rollBack(data);
    if(resp.code === EResponseMap.SUCCESS) {
      console.log(resp);
    }
  }

  const { run } = useDebounceFn(
    () => {
      let commitMsg: string  = '';
      Modal.confirm({
        centered: true,
        title: "输入备注",
        content: (
          <Input
            placeholder="请输入部署备注"
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

  useMount(() => {
    if (params.id) {
      getLogList();
    }
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "日志id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "提交备注",
      dataIndex: "commitMsg",
      key: "commitMsg",
    },
    {
      title: "提交commit",
      dataIndex: "logName",
      key: "logName",
    },
    {
      title: "构建状态",
      dataIndex: "status",
      key: "status",
      render: (_, data) => {
        const status: number = data.status;
        const { color, msg } = deployStatus[status];
        return <Tag color={color}>{msg}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
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

  return <Table columns={columns} dataSource={list} />;
}

export default animation(Logs);
