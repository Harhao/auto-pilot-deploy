import React, { useEffect, useState } from "react";
import animation from "@/component/animation";
import { deployProject, getLogsDetail } from "@/api";
import { useParams } from "react-router-dom";
import "./index.scss";

function LogDetail() {
    const [list, setList] = useState<any[]>([]);
    const params = useParams();
    const getLogDetail = async (logId: string) => {
        const resp = await getLogsDetail({ logId });
        setList(resp.data.list);
    }

    const deployHandle = async (projectId: string) => {
        const logId = await deployProject({ projectId });
        console.log(logId);
    }

    useEffect(() => {
        console.log(params)
        if (params?.id) {
            getLogDetail(params.id);
        } else {
            deployHandle(params.projectId)
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