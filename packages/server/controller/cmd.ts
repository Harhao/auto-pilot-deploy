import { Context } from 'koa';
import { CmdDeployDto } from '../dto/cmdDto';
import { Controller, Get, Post, catchError } from '../utils';

import CmdService from '../service/cmd';

@Controller('/cmd')
export default class CmdController {

    private pilotConfig: string;
    public cmdService: CmdService;

    constructor() {
        this.pilotConfig = JSON.stringify({
            "address": "47.106.90.4",
            "account": "root",
            "serverPass": "abc6845718ABC",
            "gitUser": "Harhao",
            "gitPass": "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"
        });
        this.cmdService =  new CmdService({ pilotConfig: this.pilotConfig});
        this.getServices = this.getServices.bind(this);
    }

    private getPilotConfig = async (ctx: Context) => { }

    @Post('/deploy')
    @catchError()
    public async deploy(ctx: Context) {

        const projectConfig = JSON.stringify({
            gitUrl: "https://github.com/Harhao/simple-redux.git",
            branch: "develop",
            tool: "yarn",
            command: "build",
            dest: "build",
            type: "frontEnd"
        });

        const callBack = (data: Buffer) => {
            console.log(data.toString());
            ctx.webSocket.emit(data.toString());
        };

        this.cmdService.deployService(projectConfig, callBack, callBack);

        ctx.body = {
            code: 200,
            data: null,
            msg: 'success'
        }
    }

    @Post('/rollback')
    @catchError()
    public async rollback(ctx: Context) {
    }

    @Get('/stopRun')
    @catchError()
    
    public async stopRun(ctx: Context) {
        ctx.body = {
            code: 200,
            data: "stopRun function",
            msg: 'success'
        }
    }

    @Get('/services')
    @catchError()
    public async getServices (ctx: Context) {
        console.log('===>', this);
        const list = await this.cmdService.getServiceList(this.pilotConfig);
        ctx.body = {
            code: 200,
            data: list,
            msg: 'success'
        }  
    }
}
