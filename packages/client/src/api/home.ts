import { request } from "@/utils";



export async function getProjectList(params: {}) {
    return await request.get('/project/getProject');
}

