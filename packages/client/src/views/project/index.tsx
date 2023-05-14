import React, { useEffect, useState } from "react";
import animation from "@/component/Animation";
import { Button, Space, Table, Tag, Modal, Input, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  IQueryProjects,
  deployProject,
  getProjectList,
  getServiceList,
} from "@/api";
import { EResponseMap } from "@/const";
import { useNavigate } from "react-router-dom";
import { useMount } from "ahooks";

import "./index.less";
import { getRepoName } from "@/utils";

const { Search } = Input;

interface DataType {
  _id: string;
  gitUrl: string;
  branch: string;
  dest: string;
  type: string;
}



const Project: React.FC = () => {
  const [queryParams, setQueryParams] = useState<IQueryProjects>({
    name: "",
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

  const onConfirmDeploy = (data: DataType) => {
    let commitMsg: string = "";
    Modal.confirm({
      centered: true,
      title: "输入备注",
      content: (
        <Input
          placeholder="请输入部署备注"
          onChange={(e) => (commitMsg = e.target.value)}
        />
      ),
      onOk: async () => {
        const resp = await deployProject({ projectId: data._id, commitMsg });
        if (resp.code === EResponseMap.SUCCESS) {
          const { logId } = resp.data;
          navigate(`/dashboard/logsDetail/${data._id}/${logId}`);
          message.open({ type: "success", content: "开始部署" });
        }
      },
    });
  };

  useEffect(() => {
    onGetProjects(queryParams);
  }, [queryParams]);

  useMount(() => {
    onGetServices();
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Git地址",
      dataIndex: "gitUrl",
      key: "gitUrl",
      align: "center",
    },
    {
      title: "分支",
      dataIndex: "branch",
      key: "branch",
      align: "center",
    },
    {
      title: "部署目录",
      dataIndex: "dest",
      key: "dest",
      align: "center",
    },
    {
      title: "项目类型",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "构建工具",
      dataIndex: "tool",
      key: "tool",
      align: "center",
    },
    {
      title: "服务",
      key: "status",
      align: "center",
      render: (_, data) => {
        const name = getRepoName(data.gitUrl);
        const service = serviceList.find((item) => item.name === name);
        const color = service?.status === "online" ? "green" : "red";

        return (
          <Space size="small">
            {service ? (
              <Tag color={color}>{service?.status}</Tag>
            ) : (
              <span>/</span>
            )}
          </Space>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, data) => {
        const name = getRepoName(data.gitUrl);
        return (
          <Space size="small">
            {data.type === "backEnd" ? (
              <Button
                type="primary"
                size="small"
                onClick={() => navigate(`/dashboard/service/${name}`)}
              >
                服务
              </Button>
            ) : null}
            <Button
              type="primary"
              size="small"
              onClick={() => navigate(`/dashboard/logs/${data._id}`)}
            >
              日志
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => onConfirmDeploy(data)}
            >
              部署
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="project-container">
      <Space size="small" wrap className="project-header">
        <Search
          placeholder="搜请输入项目名"
          onSearch={(value: string) => {
              setQueryParams({...queryParams, name: value, pageNum: 1 })
            }
          }
          style={{ width: 200 }}
        />
        <Button type="primary">添加项目</Button>
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
              pageSize: pageSize
            })
          }
        }} />
    </div>
  );
};

export default animation(Project);
