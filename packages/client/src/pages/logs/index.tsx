import React, { useEffect } from "react";
import { getLogsList } from "@/api";
import animation from "@/component/animation";
import { useParams } from "react-router-dom";
import "./index.scss";

function Logs() {
    const params = useParams();

    const getLogList = async () => {
        const resp = await getLogsList({ projectId: params.id });
        console.log(resp);
    }

    useEffect(() => {
        if (params.id) {
            getLogList();
        }
    }, []);

    return <div>logs</div>
}


export default animation(Logs);