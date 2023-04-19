import { IsString, IsDefined, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

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


export class ProjectDto {

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
}