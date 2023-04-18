import { Context } from 'koa';
import CmdService from '../service/cmd';
import { CmdDeployDto } from '../dto/cmdDto';

@Controller('/cmd')
class CmdController {

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
        this.cmdService = new CmdService({ pilotConfig: this.pilotConfig });
    }

    getPilotConfig = async (ctx: Context) => {

    }

    async deploy(ctx: Context) {

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

    rollback = async (ctx: Context) => {
    }

    stopRun = async (ctx: Context) => {

    }

    getServices = async (ctx: Context) => {
        const list = await this.cmdService.getServiceList(this.pilotConfig);
        ctx.body = {
            code: 200,
            data: list,
            msg: 'success'
        }
    }
}

export const cmdController = new CmdController()
