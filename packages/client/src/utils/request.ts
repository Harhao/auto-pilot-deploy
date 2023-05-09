import { EResponseMap, IResponse } from "@/const";
import axios, { AxiosInstance } from "axios";

class PilotRequest {

    private request: AxiosInstance;

    constructor() {
        this.request = this.initAxiosInstance();
    }

    private initAxiosInstance(): AxiosInstance {

        const instance = axios.create({
            baseURL: process.env.REQUEST_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        instance.interceptors.request.use((config) => {
            // 在请求头中添加 Token 等信息
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        instance.interceptors.response.use(
            (response) => {
                if (response.data.code === EResponseMap.EXPIRES) {
                  localStorage.removeItem('token');
                  window.location.reload();
                }
                // 处理请求成功的响应
                return response.data;
            },
            (error) => {
                //TODO 处理请求失败的响应
                console.log(error);
            }
        );
        return instance;
    }

    public async get(url: string, params?: Record<string, any>): Promise<IResponse> {
        return await this.request.get(url, {
            params: params,
        });
    }

    public async post(url: string, params?: Record<string, any>) : Promise<IResponse>{
        return await this.request.post(url, params);
    }

    public async put(url: string, params?: Record<string, any>): Promise<IResponse> {
        return await this.request.post(url, params);
    }

    public async delete(url: string, params?: Record<string, any>): Promise<IResponse> {
        return await this.request.post(url, params);
    }
}

export const request = new PilotRequest();