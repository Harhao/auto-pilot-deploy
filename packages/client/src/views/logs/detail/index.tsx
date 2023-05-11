import React, { useEffect, useState } from 'react';
import animation from '@/component/Animation';
import { cancelDeploy, deployProject, getLogsDetail } from '@/api';
import { useParams } from 'react-router-dom';
import { ELogsRunStatus, EResponseMap } from '@/const';
import { Button, message } from 'antd';
import RunningStatus from '@/component/Status';

import './index.less';


function LogDetail() {

    const params = useParams();
    const [logData, setLogData] = useState<{ list: string[]; status: number }>({
        list: [],
        status: -1,
    });
    const [logId, setLogId] = useState<string>('');

    let interval: number | null = null;

    const getLogDetail = async (logId: string) => {
        const resp = await getLogsDetail({ logId });
        const { list, status } = resp.data;
        setLogData({
            list,
            status
        });
        return resp;
    };

    const cancelRuningJob = async () => {
        const res = await cancelDeploy({ logId });
        if (res.code === EResponseMap.SUCCESS) {
            message.success({
                content: '取消成功'
            });
        }
    };

    const getLogsPoll = (logId: string) => {
        getLogDetail(logId);
        interval = setInterval(async () => {
            const res = await getLogDetail(logId);
            if (res.code === EResponseMap.SUCCESS) {
                const { isDone } = res.data;
                if (isDone) {
                    if (interval) {
                        clearInterval(interval);
                        interval = null;
                    }
                    return;
                }
            }
        }, 3000);

    };

    const deployHandle = async (projectId: string) => {
        const resp = await deployProject({ projectId });
        if (resp.code === EResponseMap.SUCCESS) {
            const { logId } = resp.data;
            setLogId(logId);
            getLogsPoll(logId);
        }
    };

    useEffect(() => {
        const { projectId = null, logId = null } = params;
        if (projectId) {
            // 如果已有logId，证明已有点击部署
            logId ? getLogsPoll(logId) : deployHandle(projectId);
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, []);

    return (
        <div className="log-detail-container">
            <div className='log-detail-header'>
                <RunningStatus status={logData.status} />
                {logData.status === ELogsRunStatus.RUNNING ? <Button onClick={cancelRuningJob}>取消部署</Button> : null}
            </div>
            <div className='log-detail-header'>
               
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