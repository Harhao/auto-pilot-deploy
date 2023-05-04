import { IsDefined, IsNumber, IsOptional, IsString, Validate} from "class-validator";
import { GitCheck, NginxConfig } from "./common";

export class CommonCmdDto {
    
    @IsDefined()
    @IsString()
    @Validate(GitCheck)
    gitUrl: string;

    @IsDefined()
    @IsString()
    branch: string;

    @IsDefined()
    @IsString()
    tool: string;

    @IsDefined()
    @IsString()
    command: string;

    @IsOptional()
    @IsString()
    dest: string;

    @IsDefined()
    @IsString()
    // 项目类型
    type: string;

    @IsDefined()
    // nginx配置
    nginxConfig: NginxConfig;


    @IsDefined()
    @IsString()
    // 项目id
    projectId: string;

    @IsString()
    @IsDefined()
    //部署额外信息
    commitMsg: string;

    @IsOptional()
    @IsString()
    commitHash: string;
}

export class DeployCmdDto { 

    @IsDefined()
    @IsString()
    // 项目id
    projectId: string;
}

export class RollbackCmdDto {

    @IsDefined()
    @IsString()
    // 项目id
    projectId: string;

    @IsString()
    @IsOptional()
    rollNode: string;
}

export class StopCmdDto {
    @IsDefined()
    @IsNumber()
    serviceId: number;
}


export class StartCmdDto {
    @IsDefined()
    @IsNumber()
    serviceId: number;
}

export class GetCmdDto {
    @IsOptional()
    @IsString()
    name: string;
}