import LogsService from "../service/logs";
import { Body, CatchError, Controller, EValidateFields, Get, Post, Query, Response, ValidateAuth, ValidateDto } from "../decorator";
import { CreateLogDto, GetLogsDetailDto, GetLogsDto, UpdateLogDto } from "../dto";
import { Inject } from "../ioc";
import { ELogsRunStatus } from "../consts";

@Controller("/logs")
export default class LogsController {

    @Inject private logService: LogsService;


    // 创建日志
    @Post("/createLog")
    @ValidateAuth()
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
    @ValidateAuth()
    @CatchError()
    @ValidateDto(UpdateLogDto)
    @Response
    public async updateLog(@Body logsData: UpdateLogDto) {
        return await this.logService.updateLogs(logsData);
    }

    // 获取运行日志列表
    @Get("/getlogs")
    @ValidateAuth()
    @CatchError()
    @ValidateDto(GetLogsDto, EValidateFields.QUERY)
    @Response
    public async getLogs(@Query logsData: GetLogsDto) {
        return await this.logService.getLogs(logsData)
    }

    // 获取日志详情
    @Get('/getLogDetail')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(GetLogsDetailDto,EValidateFields.QUERY)
    @Response
    public async getLogDetail(@Query logsData: GetLogsDetailDto) {
        return await this.logService.getLogsDetail(logsData);
    }
}
