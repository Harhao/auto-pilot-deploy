import { IResponse } from '@/const';
import { request } from '@/utils';

export interface IQueryProjects {
    name?: string;
    pageSize?: number;
    pageNum?: number;
}

export async function getProjectList(params?: IQueryProjects): Promise<IResponse> {
    return await request.post('/project/getProject', params);
}

export async function deployProject(params: { projectId: string, commitMsg: string }): Promise<IResponse> {
    return await request.post('/cmd/deploy', params);
}

export async function rollBack(params: { projectId: string, commitMsg: string }): Promise<IResponse> {
    return await request.post('/cmd/rollBack', params);
}

export async function getServiceList(params: { name?: string }): Promise<IResponse> {
    return await request.get('/cmd/services', params);
}

export async function stopService(params: { serviceId: number }): Promise<IResponse> {
    return await request.post('/cmd/stopService', params);
}

export async function startService(params: { serviceId: number }): Promise<IResponse> {
    return await request.post('/cmd/startService', params);
}

