import { IResponse } from "@/const";
import { request } from "@/utils";


export async function getProjectList(): Promise<IResponse> {
    return await request.get('/project/getProject');
}

export async function deployProject(params: { projectId: string }): Promise<IResponse> {
    return await request.post('/cmd/deploy', params);
}

