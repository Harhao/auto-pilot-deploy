import { spawn } from "child_process";
import { Inject, Injectable } from "../ioc";
import simpleGit from 'simple-git';
import PilotService from "./pilot";
import RedisService from "./redis";
import LogsService from "./logs";
import SocketService from "./socket";
import { ELogsRunStatus } from "../consts";
import { CommonCmdDto, DeployCmdDto, RollbackCmdDto } from "../dto";



@Injectable
export default class CmdService {

    public pilotConfig: string;

    @Inject pilotService: PilotService;
    @Inject private redisService: RedisService;
    @Inject private logsService: LogsService;
    @Inject private socketService: SocketService;

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
    public rollbackService(projectConfig: string, nginxConfig: string, onData: Function, onErr: Function,onClose?: Function) {
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
                onClose?.();
            });
        });
    }

    //  停止服务
    public stopService(serviceId: number) {
        return new Promise((resolve) => {
            const child = spawn('pilot-script',['stopService',`${serviceId}`,'--pilotConfig', this.pilotConfig]);

            child.stdout.on('data', (data) => {
               this.onStdoutHandle(data);
            });
            child.stderr.on('data', (data) => {
                this.onStdoutHandle(data);
            });
            child.stdout.on('close', () => {
                resolve(true);
            });
        });
    }

    //  开始服务
    public startService(serviceId: number) {
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
                this.onStdoutHandle(data);
            });
            child.stderr.on('data', (data) => {
                this.onStdoutHandle(data);
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

    public onStdoutHandle = (data: Buffer) => {
        this.socketService.sendToSocketId(data.toString());
    }

    private async createRunLog(data: CommonCmdDto, logName: string) {
        // mongodb生成logs日志
        const resp = await this.logsService.createLogs({
            pid: process.pid,
            projectId: data.projectId,
            logName: logName,
            commitMsg: data.commitMsg,
            logList: [],
            status: ELogsRunStatus.RUNNING,
        });
        return resp?.data;
    }

    public async runDeployJob(data: DeployCmdDto | RollbackCmdDto) {
        const commitHash = await this.getRepoHeadHash(data.gitUrl, data.branch);
        const logId = await this.createRunLog(data, commitHash);
        const redisKey = `${commitHash}`;

        this.deployService(
            JSON.stringify(data),
            JSON.stringify(data.nginxConfig),
            async (datatBuffer: Buffer) => {
                this.onStdoutHandle(datatBuffer);
                await this.redisService.setList(`${redisKey}`, datatBuffer.toString());
            },
            async (datatBuffer: Buffer) => {
                this.onStdoutHandle(datatBuffer);
                await this.redisService.setList(`${redisKey}`, datatBuffer.toString());
            },
            async () => {
                const stdout = await this.redisService.getList(`${redisKey}`);
                await this.logsService.updateLogs({
                    projectId: data.projectId,
                    logId: logId.toString(), 
                    logList: stdout,
                    pid: process.pid,
                    logName: commitHash,
                    commitMsg: data.commitMsg,
                    status: ELogsRunStatus.SUCCESS
                });
                await this.redisService.deleteKey(`${redisKey}`);
            }
        );
    }

}