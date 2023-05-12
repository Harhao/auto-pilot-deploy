import { EResponseMap, IResponse } from "@/const";
import axios, { AxiosInstance } from "axios";
import store from "@/store";
import { clearAuthToken } from "@/store/reducers/auth";
import { message } from 'antd';

class PilotRequest {

    private request: AxiosInstance;
    private static singleInstance: PilotRequest | null = null;

    constructor() {
        this.request = this.initAxiosInstance();
    }
    public static getInstance() {
        if(!this.singleInstance) {
            this.singleInstance = new PilotRequest();
        }
        return this.singleInstance;
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
                    store.dispatch(clearAuthToken());
                }
                // 处理请求成功的响应
                return response.data;
            },
            (error) => {
                //TODO 处理请求失败的响应
                message.error(error.desc);
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

export const request = PilotRequest.getInstance();