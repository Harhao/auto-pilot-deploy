import { IsString, IsDefined, Validate, IsOptional } from 'class-validator';
import { GitCheck, NginxConfig } from './common';

export class CommonProjectDto {

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
    dest?: string;

    @IsDefined()
    @IsString()
    // 项目类型
    type: string;

    @IsDefined()
    // nginx配置
    nginxConfig: NginxConfig;
}


export class UpdateProjectDto extends CommonProjectDto {

    @IsDefined()
    @IsString()
     // projectId
     projectId: string;
}

export class GetProjectDto {

    @IsString()
    @IsOptional()
    // projectId
    projectId: string;
}

export class DelProjectDto {
    @IsDefined()
    @IsString()
    // projectId
    projectId: string;
}