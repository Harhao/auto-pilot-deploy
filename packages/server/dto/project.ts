import { IsString, IsDefined, Validate, ValidatorConstraint, ValidatorConstraintInterface, IsNumber, IsOptional } from 'class-validator';

@ValidatorConstraint({ name: 'GitCheck', async: false })
export class GitCheck implements ValidatorConstraintInterface {
    validate(text: string): boolean {
        const reg = /^.*?\/\/.*?\/([\w-]+)\/([\w-]+?)(\.git)?$/;
        return reg.test(text);
    }
    defaultMessage(args?: any): string {
        return 'git url is invalid';
    }
}

class NginxConfig {

    @IsString()
    @IsDefined()
    apiDomain: string;

    @IsString()
    @IsDefined()
    apiHost?: string;

    @IsString()
    @IsDefined()
    apiPrefix?: string;

    @IsNumber()
    @IsDefined()
    apiPort?: number
}

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

    @IsDefined()
    @IsString()
    dest: string;

    @IsDefined()
    @IsString()
    type: string;

    @IsDefined()
    nginxConfig: NginxConfig;
}


export class UpdateProjectDto extends CommonProjectDto {

    @IsDefined()
    @IsString()
    id: string;
}

export class GetProjectDto {

    @IsString()
    @IsOptional()
    id: string;
}

export class DelProjectDto {
    @IsDefined()
    @IsString()
    id: string;
}