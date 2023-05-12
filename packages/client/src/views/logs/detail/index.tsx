import React, { useState } from 'react';
import animation from '@/component/Animation';
import RunningStatus from '@/component/Status';

import { useMount } from 'ahooks';
import { useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { cancelDeploy, getLogsDetail } from '@/api';
import { ELogsRunStatus, EResponseMap } from '@/const';

import './index.less';


function LogDetail() {

    const params = useParams();
    const [logData, setLogData] = useState<{ list: string[]; status: number }>({
        list: [],
        status: -1,
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
        if(!isDone) {
            interval = setInterval(async () => {
                const needCancel = await getLogDetail(logId);
                if(needCancel && interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }, 3000);
        }
    };


    useMount(() => {
        if (params.logId) {
            getLogsPoll(params.logId);
        }
        return () => {
            interval && clearInterval(interval);
        };
    });

    return (
        <div className="log-detail-container">
            <div className='log-detail-header'>
                <RunningStatus status={logData.status} />
            </div>
            <div>{logData.status === ELogsRunStatus.RUNNING ? <Button onClick={cancelRuningJob}>取消部署</Button> : null}</div>
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