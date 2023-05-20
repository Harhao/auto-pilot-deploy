import { spawn } from "child_process";
import { Inject, Injectable } from "../ioc";
import { Octokit } from "@octokit/rest";
import PilotService from "./pilot";
import RedisService from "./redis";
import LogsService from "./logs";
import SocketService from "./socket";
import ProcessService from "./process";
import { ELogsRunStatus } from "../consts";
import { CommonCmdDto } from "../dto";
import { BaseTool } from "../utils";

@Injectable
export default class CmdService {

    public pilotConfig: string;

    @Inject pilotService: PilotService;
    @Inject redisService: RedisService;
    @Inject logsService: LogsService;
    @Inject socketService: SocketService;
    @Inject processService: ProcessService

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
    public startRunner(scriptName: string, logId: string, projectConfig: string, nginxConfig: string, onData?: Function, onErr?: Function, onClose?: Function) {
        return new Promise((resolve) => {
            const child = spawn(
                'pilot-script',
                [
                    `${scriptName}`,
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
            child.on('close', (code: any, signal: any) => {
                this.processService.deleteProcess(logId);
                onClose?.(code, signal);
            });
            this.processService.saveProcess({ [logId]: child.pid });
        });
    }

    //  停止服务
    public stopService(serviceId: number) {
        return new Promise((resolve) => {
            const child = spawn('pilot-script', ['stopService', `${serviceId}`, '--pilotConfig', this.pilotConfig]);

            child.stdout.on('data', (data) => {
                this.onStdoutHandle(data);
            });
            child.stderr.on('data', (data) => {
                this.onStdoutHandle(data);
            });
            child.on('error', (error) => {
                resolve(false);
            });
            child.on('close', (code: any, signal: any) => {
                const isSuccess = code === 0 && !signal; 
                resolve(isSuccess);
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
            child.on('error', (error) => {
                resolve(false);
            });
            // child.on('close', (code: any, signal: any) => {
            //     const isSuccess = code === 0 && !signal; 
            //     resolve(isSuccess);
            // });
            resolve(true);
        });
    }

    public async getRepoHeadHash(remoteUrl: string, branchName: string): Promise<string | null> {
        const octokit = new Octokit({
            auth: JSON.parse(this.pilotConfig).gitPass,
        });
        const { owner, repo } = BaseTool.getGitRepoParams(remoteUrl);
        const res = await octokit.repos.getBranch({
            owner,
            repo,
            branch: branchName,
        });
        return res.data.commit.sha;
    }

    public onStdoutHandle = (data: Buffer) => {
        this.socketService.sendToSocketId(data.toString());
    }

    public async createRunLog(data: CommonCmdDto) {
        const commitHash = data?.commitHash ? data.commitHash : await this.getRepoHeadHash(data.gitUrl, data.branch);
        // mongodb生成logs日志
        const resp = await this.logsService.createLogs({
            projectId: data.projectId,
            logName: commitHash,
            commitMsg: data?.commitMsg ?? '未填写commit备注',
            logList: [],
            status: ELogsRunStatus.RUNNING,
        });
        return { logId: resp?.data, commitHash, commitMsg: data?.commitMsg };
    }

    public async runDeployJob(scriptName: string, data: any, logId: string, commitHash: string, commitMsg: string) {

        // 使用logId作为redis key，防止重复冲突
        const redisKey = `${logId}`;

        this.startRunner(
            scriptName,
            logId,
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
            async (code: number, signal: any) => {
                const stdout = await this.redisService.getList(`${redisKey}`);
                await this.logsService.updateLogs({
                    projectId: data._id,
                    logId: logId,
                    logList: stdout,
                    logName: commitHash,
                    commitMsg,
                    status: this.getRunnerStatus(code, signal),
                });
                await this.redisService.deleteKey(`${redisKey}`);
            }
        );
    }

    public async stopRunner(logId: string) {
        let isStopDone = false;
        const pid: number = await this.processService.existProcess(logId);
        if (pid) {
            isStopDone = process.kill(pid, 'SIGINT');
            await this.processService.deleteProcess(logId);
        }
        return {
            isStop: isStopDone,
            pid
        };
    }

    private getRunnerStatus(code: any, signal: any) {
        if (code === null && signal === 'SIGINT') {
            return ELogsRunStatus.INTERRUPT;
        } else if (code === 0 && signal === null) {
            return ELogsRunStatus.SUCCESS;
        } else {
            return ELogsRunStatus.ERROR;
        }
    }
}