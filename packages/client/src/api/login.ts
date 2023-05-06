import { IResponse } from "@/const";
import { request } from "@/utils";



export async function login(params: { userName: string; password: string}): Promise<IResponse> {
    return await request.post('/user/login', params);
}

