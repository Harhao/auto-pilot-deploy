import React, { useEffect, useState } from "react";
import animation from "@/component/animation";
import { deployProject, getLogsDetail } from "@/api";
import { useParams } from "react-router-dom";
import "./index.scss";

function LogDetail() {

    const [list, setList] = useState<any[]>([]);
    const params = useParams();
    let interval: number = 0;

    const getLogDetail = async (logId: string) => {
        const resp = await getLogsDetail({ logId });
        setList(resp.data.list);
        return resp;
    }

    const getLogsPoll = async (logId: string) => {
        interval = setInterval(async () => {
            const res = await getLogDetail(logId);
            if (res.code === 200) {
                const { isDone } = res.data;
                if (isDone) {
                    clearInterval(interval);
                    return;
                }
            }
        }, 3000);

    }

    const deployHandle = async (projectId: string) => {
        const resp: any = await deployProject({ projectId });
        if (resp.code === 200) {
            const { logId } = resp.data;
            getLogsPoll(logId);
        }
    }

    useEffect(() => {
        if( params.projectId)  {
            deployHandle(params.projectId);
        }
        
    }, []);

    return (
        <div className="log-detail-container">
            <div
                className="log-detail-content">
                {
                    list.map((log: string, index: number) => {
                        return <div key={index}>{log}</div>
                    })
                }
            </div>
        </div>
    );
}


export default animation(LogDetail);