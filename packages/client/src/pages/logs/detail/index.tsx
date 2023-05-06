import React, { useEffect, useState } from 'react';
import animation from '@/component/animation';
import { deployProject, getLogsDetail } from '@/api';
import { useParams } from 'react-router-dom';
import { EResponseMap } from '@/const';

import './index.scss';

function LogDetail() {

    const [list, setList] = useState<any[]>([]);
    const params = useParams();
    let interval = 0;

    const getLogDetail = async (logId: string) => {
        const resp = await getLogsDetail({ logId });
        setList(resp.data.list);
        return resp;
    };

    const getLogsPoll = (logId: string) => {
        interval = setInterval(async () => {
            const res = await getLogDetail(logId);
            if (res.code === EResponseMap.SUCCESS) {
                const { isDone } = res.data;
                if (isDone) {
                    clearInterval(interval);
                    return;
                }
            }
        }, 2000);

    };

    const deployHandle = async (projectId: string) => {
        const resp = await deployProject({ projectId });
        if (resp.code === EResponseMap.SUCCESS) {
            const { logId } = resp.data;
            getLogsPoll(logId);
        }
    };

    useEffect(() => {
        if (params.projectId) {
            // 如果已有logId，证明已有点击部署
            if (params.logId) {
                getLogsPoll(params.logId);
                return;
            }
            // 未部署
            deployHandle(params.projectId);
        }
    }, []);

    return (
        <div className="log-detail-container">
            <div
                className="log-detail-content">
                {
                    list.map((log: string, index: number) => {
                        return <div key={index}>{log}</div>;
                    })
                }
            </div>
        </div>
    );
}


export default animation(LogDetail);