import { IResponse } from "@/const";
import { request } from "@/utils";



export async function getPilotList(params: {}): Promise<IResponse> {
    return await request.get('/pilot/getPilotList', params);
}

export async function getPilot(params: { pilotId?: string}): Promise<IResponse> {
    return await request.get('/pilot/getPilot', params);
}

export async function updatePilot(params: any): Promise<IResponse> {
    return await request.put('/pilot/updatePilot', params);
}

export async function createPilot(params: any): Promise<IResponse> {
    return await request.put('/pilot/createPilot', params);
}

