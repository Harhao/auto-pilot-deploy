import CmdService from '../service/cmd';
import SocketService from '../service/socket';
import LogsService from '../service/logs';
import RedisService from '../service/redis';

import { Inject } from '../ioc';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Body } from '../decorator';
import { DeployCmdDto, RollbackCmdDto, StartCmdDto, StopCmdDto } from '../dto';

@Controller('/cmd')
export default class CmdController {

    @Inject private cmdService: CmdService;

    @Post('/deploy')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(DeployCmdDto)
    @Response
    public async deploy(@Body data: DeployCmdDto) {

        await this.cmdService.runDeployJob(data);

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

        await this.cmdService.runDeployJob(data);

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
