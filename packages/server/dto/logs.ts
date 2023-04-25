import { IsDefined, IsString, IsArray, IsNumber, IsOptional } from "class-validator";

class CommonLogDto {

    @IsNumber()
    @IsOptional()
    // task的进程id
    pid: number;

    @IsString()
    @IsDefined()
    // 归属的projectid
    projectId: string;

    @IsString()
    @IsDefined()
    // task的git commitHash
    logName: string;

    @IsString()
    @IsDefined()
    // task的额外信息
    commitMsg: string;

    @IsArray()
    @IsDefined()
    // task的日志list
    logList: string[];

    // task运行状态
    @IsNumber()
    @IsDefined()
    status: number;
}


export class UpdateLogDto extends CommonLogDto{

    @IsString()
    @IsDefined()
    //日志logId
    logId: string;
}

export class CreateLogDto extends CommonLogDto{
}


export class GetLogsDto {
    @IsString()
    @IsDefined()
    // 项目projectId
    projectId: string;
}


export class GetLogsDetailDto {

    @IsString()
    @IsDefined()
    //归属projectId
    projectId: string;

    @IsDefined()
    @IsString()
    //日志logId
    logId: string;
}