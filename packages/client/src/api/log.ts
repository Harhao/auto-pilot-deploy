import { IResponse } from "@/const";
import { request } from "@/utils";

export async function getLogsList(params: { projectId: string | undefined }): Promise<IResponse> {
    return await request.post('/logs/getlogs', params);
}


export async function getLogsDetail(params: { logId: string }): Promise<IResponse> {
    return await request.get('/logs/getLogDetail', params);
}

export async function cancelDeploy(params: { logId: string }): Promise<IResponse> {
    return await request.get('/cmd/stopRunner', params);
}