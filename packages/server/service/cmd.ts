import { spawn } from "child_process";
import { Inject, Injectable } from "../ioc";
import simpleGit, { SimpleGit } from 'simple-git';
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
    public deployService(projectConfig: string, nginxConfig: string, onData?: Function, onErr?: Function, onClose?: Function) {
        return new Promise((resolve) => {
            const child = spawn(
                'pilot-script', 
                [
                    'deploy', 
                    '--pilotConfig', 
                    this.pilotConfig, 
                    '--projectConfig', 
                    projectConfig, 
                    '--nginxConfig', 
                    nginxConfig
                ]
            );
            child.stdout.on('data', (data) => {
                onData?.(data);
            });
            child.stderr.on('data', (data) => {
                onErr?.(data);
            });
            child.stdout.on('close', () => {
                onClose?.();
            });
        });
    }


    //  回滚服务
    public rollbackService(projectConfig: string, nginxConfig: string, onData: Function, onErr: Function) {
        return new Promise((resolve) => {
            const child = spawn(
                'pilot-script',
                [
                    'rollback',
                    '--pilotConfig',
                    this.pilotConfig,
                    '--projectConfig',
                    projectConfig,
                    '--nginxConfig', 
                    nginxConfig
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
            const child = spawn('pilot-script',['stopService',`${serviceId}`,'--pilotConfig', this.pilotConfig]);

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

    public getRepoHeadHash(remoteUrl: string, branchName: string ): Promise<string> {
        return new Promise((resolve) => {
            const git = simpleGit();
            git.listRemote(['--heads', remoteUrl], (err: any, refs: any) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // 遍历引用列表，找到指定分支的引用
                let latestCommitHash;
                refs.split('\n').forEach((ref: any) => {
                    const [refHash, refName] = ref.split('\t');
                    if (refName === `refs/heads/${branchName}`) {
                        latestCommitHash = refHash;
                    }
                });
                resolve(latestCommitHash);
            });
        });
    }

}