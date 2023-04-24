import CmdService from '../service/cmd';
import SocketService from '../service/socket';
import { Context } from 'koa';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Body } from '../decorator';
import { CommonProjectDto, RollbackCmdDto, StartCmdDto, StopCmdDto } from '../dto';
import { Inject } from '../ioc';

@Controller('/cmd')
export default class CmdController {

    @Inject private cmdService: CmdService;
    @Inject private socketService: SocketService;


    public onStdoutHandle = (data: Buffer) => {
        console.log(data.toString());
        this.socketService.sendToSocketId(data.toString());
    }

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonProjectDto)
    @Response
    public async deploy(projectConfig: CommonProjectDto) {

        this.cmdService.deployService(
            JSON.stringify(projectConfig), 
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
    public async stopProcess(ctx: Context) {
        return {
            code: 200,
            data: "stopRun function",
            msg: 'success'
        }
    }

    @Post('/rollback')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(RollbackCmdDto)
    @Response
    public async rollback(@Body projectConfig: RollbackCmdDto) {

        this.cmdService.rollbackService(
            JSON.stringify(projectConfig), 
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
    public async startService(ctx: Context) {
        const { id } = ctx.request.body;
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
    public async getServices(ctx: Context) {
        const list = await this.cmdService.getServiceList();
        return {
            code: 200,
            data: list,
            msg: 'success'
        }
    }
}
