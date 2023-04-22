import CmdService from '../service/cmd';
import SocketService from '../service/socket';
import { Context } from 'koa';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth } from '../decorator';
import { ProjectDto, RollbackCmdDto, StartCmdDto, StopCmdDto } from '../dto';
import { Inject } from '../ioc';

@Controller('/cmd')
export default class CmdController {

    @Inject private sockertService: SocketService;
    @Inject private cmdService: CmdService;


    public onStdoutHandle(data: Buffer) {
        console.log(data.toString());
        this.sockertService.sendToSocketId(data.toString());
    }

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(ProjectDto)
    public async deploy(ctx: Context) {

        const projectConfig = ctx.request.body;

        this.cmdService.deployService(
            JSON.stringify(projectConfig), 
            this.onStdoutHandle, 
            this.onStdoutHandle
        );

        ctx.body = {
            code: 200,
            data: true,
            msg: 'success'
        }

    }

    @Get('/stopProcess')
    @ValidateAuth()
    @CatchError()
    public async stopProcess(ctx: Context) {
        ctx.body = {
            code: 200,
            data: "stopRun function",
            msg: 'success'
        }
    }

    @Post('/rollback')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(RollbackCmdDto)
    public async rollback(ctx: Context) {

        const projectConfig = ctx.request.body;

        this.cmdService.rollbackService(
            JSON.stringify(projectConfig), 
            this.onStdoutHandle, 
            this.onStdoutHandle
        );

        ctx.body = {
            code: 200,
            data: true,
            msg: 'success'
        }
    }

    @Post('/stopService')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(StopCmdDto)
    public async stopService(ctx: Context) {
        const { id } = ctx.request.body;
        this.cmdService.stopService(
            id,
            this.onStdoutHandle,
            this.onStdoutHandle
        );
        ctx.body = {
            code: 200,
            data: true,
            msg: 'success'  
        };
    }


    @Post('/startService')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(StartCmdDto)
    public async startService(ctx: Context) {
        const { id } = ctx.request.body;
        this.cmdService.startService(
            id,
            this.onStdoutHandle,
            this.onStdoutHandle
        );
        ctx.body = {
            code: 200,
            data: true,
            msg: 'success'  
        };
    }



    @Get('/services')
    @ValidateAuth()
    @CatchError()
    public async getServices(ctx: Context) {
        const list = await this.cmdService.getServiceList();
        ctx.body = {
            code: 200,
            data: list,
            msg: 'success'
        }
    }
}
