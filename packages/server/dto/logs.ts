import { IsDefined, IsString, IsArray, IsNumber, IsOptional } from "class-validator";

class CommonLogDto {

    @IsString()
    @IsOptional()
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

    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @IsOptional()
    @IsNumber()
    pageNum?: number;


    @IsOptional()
    @IsString()
    commitMsg?: string;
}


export class GetLogsDetailDto {

    @IsDefined()
    @IsString()
    //日志logId
    logId: string;
}