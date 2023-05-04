import { request } from "@/utils";



export async function getProjectList(params: {}) {
    return await request.get('/project/getProject');
}

export async function deployProject(params: any) {
    return await request.post('/cmd/deploy', params);
}

