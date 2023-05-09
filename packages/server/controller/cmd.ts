import CmdService from '../service/cmd';
import ProjectService from '../service/project';

import { Inject } from '../ioc';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Body, EValidateFields, Query } from '../decorator';
import { DeployCmdDto, GetCmdDto, RollbackCmdDto, StartCmdDto, StopCmdDto } from '../dto';

@Controller('/cmd')
export default class CmdController {

    @Inject private cmdService: CmdService;
    @Inject private projectService: ProjectService;

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(DeployCmdDto)
    @Response
    public async deploy(@Body data: DeployCmdDto) {
        const config: any = await this.projectService.getProject({ projectId: data.projectId});
        const logConfig: any = config?.data?.[0];
        const { logId, commitHash  } = await this.cmdService.createRunLog({ ...logConfig, ...data });
        
        this.cmdService.runDeployJob(logConfig, logId.toString(), commitHash);

        return {
            code: 200,
            data: { logId },
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

        const config: any = await this.projectService.getProject({ projectId: data.projectId});
        const logConfig: any = config?.data?.[0];
        const { logId, commitHash  } = await this.cmdService.createRunLog({ ...logConfig, ...data });

        this.cmdService.runDeployJob(logConfig, logId.toString(), commitHash);

        return {
            code: 200,
            data: { logId },
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
        this.cmdService.stopService(serviceId);

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
            serviceId
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
    @ValidateDto(GetCmdDto, EValidateFields.QUERY)
    @Response
    public async getServices(@Query data: GetCmdDto) {
        let resp = [];
        const list = (await this.cmdService.getServiceList()) as any;
        if(data?.name) {
            resp = list.filter((item: any) => item.name === data.name);
        } else {
            resp = list;
        }
        return {
            code: 200,
            data: resp,
            msg: 'success'
        }
    }
}
