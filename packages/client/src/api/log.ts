import { request } from "@/utils";

export async function getLogsList(params: any) {
    return await request.get('/logs/getlogs', params);
}


export async function getLogsDetail(params: any) {
    return await request.get('/logs/getLogDetail', params);
}