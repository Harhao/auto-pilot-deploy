import CmdService from '../service/cmd';
import SocketService from '../service/socket';
import { Context } from 'koa';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth } from '../decorator';
import { ProjectDto } from '../dto';
import { Inject } from '../ioc';

@Controller('/cmd')
export default class CmdController {

    @Inject private sockertService: SocketService;
    @Inject private cmdService: CmdService;

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(ProjectDto)
    public async deploy(ctx: Context) {

        const projectConfig = ctx.request.body;

        const callBack = (data: Buffer) => {    
            console.log(data.toString()); 
        };

        ctx.body = {
            code: 200,
            data: true,
            msg: 'success'
        }

        this.cmdService.deployService(JSON.stringify(projectConfig), callBack, callBack);

    }

    @Post('/rollback')
    @ValidateAuth()
    @CatchError()
    public async rollback(ctx: Context) {
    }

    @Get('/stopRun')
    @ValidateAuth()
    @CatchError()
    public async stopRun(ctx: Context) {
        ctx.body = {
            code: 200,
            data: "stopRun function",
            msg: 'success'
        }
    }


    @Get('/services')
    @ValidateAuth()
    @CatchError()
    public async getServices (ctx: Context) {
        const list = await this.cmdService.getServiceList();
        ctx.body = {
            code: 200,
            data: list,
            msg: 'success'
        }  
    }
}
