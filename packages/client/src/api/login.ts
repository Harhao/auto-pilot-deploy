import { request } from "@/utils";



export async function login(params: any) {
    return await request.post('/user/login', params);
}

