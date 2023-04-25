import { IsDefined, IsString, IsArray } from "class-validator";

class CommonLogDto {

    @IsString()
    @IsDefined()
    projectId: string;

    @IsString()
    @IsDefined()
    logName: string;

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