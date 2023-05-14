import React, { useState } from "react";
import animation from "@/component/Animation";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

import { useMount } from "ahooks";
import { getServiceList, startService, stopService } from "@/api";
import { EResponseMap, serviceStatus } from "@/const";
import { useParams } from "react-router-dom";
import { Button, Space, Table, Modal, message, Tag } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import "./index.less";

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
    if (params.name) {
      const resp = await getServiceList({ name: params.name });
      if (resp.code === EResponseMap.SUCCESS) {
        setList(resp.data);
      }
    }
  };

  const delayGetService = () => {
    setTimeout(() => {
      getProjectService();
    }, 500);
  };

  const stopServiceHandle = async (serviceId: number) => {
    Modal.confirm({
      title: "风险提示?",
      icon: <ExclamationCircleFilled />,
      content: "你确定需要停止服务",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        const res = await stopService({ serviceId });
        if (res.code === EResponseMap.SUCCESS) {
          message.success("已暂停服务");
          delayGetService();
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const startServiceHandle = async (serviceId: number) => {
    Modal.confirm({
      title: "发布提示",
      icon: <ExclamationCircleFilled />,
      content: "你确定需要恢复服务",
      okText: "确定",
      okType: "primary",
      cancelText: "取消",
      onOk: async () => {
        const res = await startService({ serviceId });
        if (res.code === EResponseMap.SUCCESS) {
          message.success("已恢复服务");
          delayGetService();
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useMount(() => {
    getProjectService();
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "服务名称",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "node版本",
      dataIndex: "node_version",
      key: "node_version",
      align: "center",
    },
    {
      title: "上传地址",
      dataIndex: "pm_cwd",
      key: "pm_cwd",
      align: "center",
    },
    {
      title: "发布时间",
      align: "center",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, data: any) => {
        return (
          <span>{dayjs(data.created_at).format("YY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      title: "状态",
      align: "center",
      dataIndex: "status",
      key: "status",
      render: (_, data: any) => {
        return <Tag color={serviceStatus[data.status]}>{data.status}</Tag>;
      },
    },
    {
      title: "CPU占用",
      align: "center",
      key: "cpu",
      render: (_, data: any) => {
        return <Space size="middle">{data.monit.cpu}</Space>;
      },
    },
    {
      title: "内存占用",
      align: "center",
      key: "memory",
      render: (_, data: any) => {
        return (
          <Space size="small">{Math.floor(data.monit.memory / 1048576)}M</Space>
        );
      },
    },
    {
      title: "用户",
      dataIndex: "USER",
      key: "USER",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, data: any) => {
        return (
          <Space size="small">
            {data.status === 'online' ? (
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => stopServiceHandle(data.pm_id)}
              >
                暂停
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                onClick={() => startServiceHandle(data.pm_id)}
              >
                恢复
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={list} />;
};

export default animation(Service);
