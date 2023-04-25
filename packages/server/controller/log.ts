import LogsService from "../service/logs";
import { Body, CatchError, Controller, Get, Post, Query, Response, ValidateDto } from "../decorator";
import { CreateLogDto, GetLogsDetailDto, GetLogsDto, UpdateLogDto } from "../dto";
import { Inject } from "../ioc";
import { ELogsRunStatus } from "../consts";

@Controller("/logs")
export default class LogsController {

    @Inject private logService: LogsService;


    // 更新日志
    @Post("/createLog")
    @CatchError()
    @ValidateDto(CreateLogDto)
    @Response
    public async createLog(@Body logsData: CreateLogDto) {
        return await this.logService.createLogs({
            ...logsData, 
            status: ELogsRunStatus.RUNNING,
        });
    }


    // 更新日志
    @Post("/updateLog")
    @CatchError()
    @ValidateDto(UpdateLogDto)
    @Response
    public async updateLog(@Body logsData: UpdateLogDto) {
        return await this.logService.updateLogs(logsData);
    }

    // 获取运行日志列表
    @Get("/getlogs")
    @CatchError()
    @ValidateDto(GetLogsDto)
    @Response
    public async getLogs(@Body logsData: GetLogsDto) {
        return await this.logService.getLogs(logsData)

    }

    // 获取日志详情
    @Get('/getLogDetail')
    @CatchError()
    @ValidateDto(GetLogsDetailDto)
    @Response
    public async getLogDetail(@Query logsData: GetLogsDetailDto) {
        return await this.logService.getLogsDetail(logsData);
    }
}
