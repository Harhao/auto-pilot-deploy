import { spawn } from "child_process";
import { Inject, Injectable } from "../ioc";

import PilotService from "./pilot";



@Injectable
export default class CmdService {

    public pilotConfig: string;

    @Inject pilotService: PilotService;

    constructor() {
        this.initPilotService();
    }

    public async initPilotService() {
        const config = await this.pilotService.getPilot();
        const { address, account, serverPass, gitUser, gitPass } = config?.data;
        this.pilotConfig = JSON.stringify({ address, account, serverPass, gitUser, gitPass });
    }

    //  获取服务列表
    public getServiceList() {
        return new Promise((resolve) => {
            const child = spawn(`pilot-script`, ['service', '--pilotConfig', this.pilotConfig]);
            child.stdout.on('data', (data) => {
                const jsonData = JSON.parse(data.toString('utf-8'));
                resolve(jsonData);
            });
        });
    }

    // 部署服务
    public deployService(projectConfig: string, onData: Function, onErr: Function) {
        return new Promise((resolve) => {
            const child = spawn('pilot-script', ['deploy', '--pilotConfig', this.pilotConfig, '--projectConfig', projectConfig]);
            child.stdout.on('data', (data) => {
                onData?.(data);
            });
            child.stderr.on('data', (data) => {
                onErr?.(data);
            });
            child.stdout.on('close', () => {
                resolve(true);
            });
        });
    }


    //  回滚服务
    public rollbackService(projectConfig: string, onData: Function, onErr: Function) {
        return new Promise((resolve) => {
            const child = spawn(
                'pilot-script',
                [
                    'rollback',
                    '--pilotConfig',
                    this.pilotConfig,
                    '--projectConfig',
                    projectConfig
                ]
            );
            child.stdout.on('data', (data) => {
                onData?.(data);
            });
            child.stderr.on('data', (data) => {
                onErr?.(data);
            });
            child.stdout.on('close', () => {
                resolve(true);
            });
        });
    }

    //  停止服务
    public stopService(serviceId: number, onData: Function, onErr: Function) {
        return new Promise((resolve) => {
            const child = spawn(
                'pilot-script', 
                [
                    'stopService', 
                    `${serviceId}`,
                    '--pilotConfig', 
                    this.pilotConfig
                ]
            );
            child.stdout.on('data', (data) => {
                onData?.(data);
            });
            child.stderr.on('data', (data) => {
                onErr?.(data);
            });
            child.stdout.on('close', () => {
                resolve(true);
            });
        });
    }

    //  开始服务
    public startService(serviceId: number, onData: Function, onErr: Function) {
        return new Promise((resolve) => {
            const child = spawn(
                'pilot-script',
                [
                    'startService', 
                    `${serviceId}`, 
                    '--pilotConfig', 
                    this.pilotConfig
                ]
            );
            child.stdout.on('data', (data) => {
                onData?.(data);
            });
            child.stderr.on('data', (data) => {
                onErr?.(data);
            });
            child.stdout.on('close', () => {
                resolve(true);
            });
        });
    }
}