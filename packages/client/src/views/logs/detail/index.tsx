import React, { useState } from 'react';
import animation from '@/component/Animation';
import RunningStatus from '@/component/Status';
import Meta from 'antd/es/card/Meta';

import { useMount } from 'ahooks';
import { useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { cancelDeploy, getLogsDetail, getProjectList } from '@/api';
import { ELogsRunStatus, EResponseMap } from '@/const';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { getRepoName } from '@/utils';

import './index.less';



function LogDetail() {

    const params = useParams();
    const [logData, setLogData] = useState<{ list: string[]; status: number }>({
        list: [],
        status: -1,
    });

    const [projectInfo, setProjectInfo] = useState({
        name: '',
        onlineUrl: '',
        gitUrl: '',
    });

    let interval: number | null = null;

    // 取消部署job
    const cancelRuningJob = async () => {
        const res = await cancelDeploy({ logId: params.logId as string });
        if (res.code === EResponseMap.SUCCESS) {
            message.success({
                content: '取消成功'
            });
        }
    };

    // 获取日志详情
    const getLogDetail = async (logId: string) => {
        const res = await getLogsDetail({ logId });
        if (res.code === EResponseMap.SUCCESS) {
            const { list, status, isDone } = res.data;
            setLogData({
                list,
                status
            });
            return isDone;
        }
        return true;
    };

    // 轮训获取日志详情
    const getLogsPoll = async (logId: string) => {
        const isDone = await getLogDetail(logId);
        if (!isDone) {
            interval = setInterval(async () => {
                const needCancel = await getLogDetail(logId);
                if (needCancel && interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }, 3000);
        }
    };

    const getProjectInfo = async () => {
        const res = await getProjectList({ projectId: params.projectId });
        if (res.code === EResponseMap.SUCCESS) {
            const data = res.data.list?.[0];
            const { name, nginxConfig, gitUrl } = data;
            setProjectInfo({
                name,
                onlineUrl: `https://${nginxConfig.apiDomain}/projects/${getRepoName(gitUrl)}`,
                gitUrl
            });
        }
    };


    useMount(() => {
        if (params.logId) {
            getProjectInfo();
            getLogsPoll(params.logId);
        }
        return () => {
            interval && clearInterval(interval);
        };
    });

    const CardInfo = () => {
        return <Card
            style={{ width: '100%' }}
            cover={null}
        >
            <Meta
                avatar={<RunningStatus status={logData.status} />}
                title={projectInfo.name}
                description={projectInfo.onlineUrl}
            />
            { logData.status === ELogsRunStatus.RUNNING ? <Button onClick={cancelRuningJob}>取消部署</Button> : null }
        </Card>;
    };

    return (
        <div className="log-detail-container">
            <div className='log-detail-info'>
                <CardInfo />
            </div>
            <div
                className="log-detail-content">
                {
                    logData.list.map((log: string, index: number) => {
                        return <div key={index}>{log}</div>;
                    })
                }
            </div>
        </div>
    );
}


export default animation(LogDetail);