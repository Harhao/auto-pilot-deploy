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
}

export class DeployCmdDto extends CommonCmdDto { }

export class RollbackCmdDto extends CommonCmdDto {
    @IsString()
    @IsDefined()
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