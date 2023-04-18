import { IsString, IsInt, MinLength, MaxLength, isString } from 'class-validator';

// 创建部署参数
export class CmdDeployDto {
    @IsString()
    readonly gitUrl: string;

    @IsString()
    readonly branch: string;

    @IsString()
    readonly tool: string;

    @IsString()
    readonly command: string;

    @IsString()
    readonly dest: string;

    @IsString()
    readonly type: string;

}