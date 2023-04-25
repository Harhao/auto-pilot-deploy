import { IsDefined, IsString, IsArray, IsNumber, IsOptional } from "class-validator";

class CommonLogDto {

    @IsNumber()
    @IsOptional()
    pid: number;

    @IsString()
    @IsDefined()
    projectId: string;

    @IsString()
    @IsDefined()
    logName: string;

    @IsString()
    @IsDefined()
    deployMsg: string;

    @IsArray()
    @IsDefined()
    logList: string[];
}


export class UpdateLogDto extends CommonLogDto{

    @IsString()
    @IsDefined()
    id: string;
}

export class CreateLogDto extends CommonLogDto{}


export class GetLogsDto {

    @IsString()
    @IsDefined()
    projectId: string;
}


export class GetLogsDetailDto {

    @IsString()
    @IsDefined()
    projectId: string;


    @IsDefined()
    @IsString()
    id: string;
}