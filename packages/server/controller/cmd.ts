import CmdService from '../service/cmd';
import SocketService from '../service/socket';
import LogsService from '../service/logs';
import RedisService from '../service/redis';

import { Inject } from '../ioc';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Body } from '../decorator';
import { CommonCmdDto, DeployCmdDto, RollbackCmdDto, StartCmdDto, StopCmdDto } from '../dto';
import { ELogsRunStatus } from '../consts';
import { ObjectId } from 'mongodb';

@Controller('/cmd')
export default class CmdController {

    @Inject private cmdService: CmdService;
    @Inject private socketService: SocketService;
    @Inject private redisService: RedisService;
    @Inject private logsService: LogsService;


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

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(DeployCmdDto)
    @Response
    public async deploy(@Body data: DeployCmdDto) {

        const commitHash = await this.cmdService.getRepoHeadHash(data.gitUrl, data.branch);
        const logId = await this.createRunLog(data, commitHash);
        const redisKey = `${commitHash}`;

        this.cmdService.deployService(
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

        return {
            code: 200,
            data: true,
            msg: 'success'
        }

    }

    @Get('/stopProcess')
    @ValidateAuth()
    @CatchError()
    @Response
    public async stopProcess() {
    }

    @Post('/rollback')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(RollbackCmdDto)
    @Response
    public async rollback(@Body data: RollbackCmdDto) {

        const commitHash = await this.cmdService.getRepoHeadHash(data.gitUrl, data.branch);
        const logId = await this.createRunLog(data, commitHash);
        const redisKey = `${commitHash}`;

        this.cmdService.rollbackService(
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

        return {
            code: 200,
            data: true,
            msg: 'success'
        }
    }

    @Post('/stopService')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(StopCmdDto)
    @Response
    public async stopService(@Body body: StopCmdDto) {
        const { serviceId } = body;
        this.cmdService.stopService(
            serviceId,
            this.onStdoutHandle,
            this.onStdoutHandle
        );

        return {
            code: 200,
            data: true,
            msg: 'success'
        };
    }


    @Post('/startService')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(StartCmdDto)
    @Response
    public async startService(@Body body: StartCmdDto) {
        const { serviceId } = body;
        this.cmdService.startService(
            serviceId,
            this.onStdoutHandle,
            this.onStdoutHandle
        );
        return {
            code: 200,
            data: true,
            msg: 'success'
        };
    }



    @Get('/services')
    @ValidateAuth()
    @CatchError()
    @Response
    public async getServices() {
        const list = await this.cmdService.getServiceList();
        return {
            code: 200,
            data: list,
            msg: 'success'
        }
    }
}
