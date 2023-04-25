import CmdService from '../service/cmd';
import SocketService from '../service/socket';
import LogsService from '../service/logs';
import RedisService from '../service/redis';

import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Body } from '../decorator';
import { CommonProjectDto, RollbackCmdDto, StartCmdDto, StopCmdDto } from '../dto';
import { Inject } from '../ioc';

@Controller('/cmd')
export default class CmdController {

    @Inject private cmdService: CmdService;
    @Inject private socketService: SocketService;
    @Inject private redisService: RedisService<any>;
    @Inject private logsService: LogsService;

    // 执行命令的进程id
    private processId: number | null = null;
    private redisLogKey: string | null = null;


    public onStdoutHandle = (data: Buffer) => {
        console.log(data.toString());
        this.socketService.sendToSocketId(data.toString());
    }

    private async createRunLog() {

    }

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonProjectDto)
    @Response
    public async deploy(@Body projectConfig: CommonProjectDto) {

        this.processId = process.pid;

        await this.createRunLog();

        this.cmdService.deployService(
            JSON.stringify(projectConfig),
            JSON.stringify(projectConfig.nginxConfig),
            this.onStdoutHandle,
            this.onStdoutHandle
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
        if (this.processId) {
            process.kill(this.processId, 'SIGTERM');
            return {
                code: 200,
                data: true,
                msg: 'success'
            }
        }
        return {
            code: 200,
            data: false,
            msg: 'success'
        }
    }

    @Post('/rollback')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(RollbackCmdDto)
    @Response
    public async rollback(@Body projectConfig: RollbackCmdDto) {

        this.processId = process.pid;

        await this.createRunLog();

        this.cmdService.rollbackService(
            JSON.stringify(projectConfig),
            JSON.stringify(projectConfig.nginxConfig),
            this.onStdoutHandle,
            this.onStdoutHandle
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
        const { id } = body;
        this.cmdService.stopService(
            id,
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
        const { id } = body;
        this.cmdService.startService(
            id,
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
