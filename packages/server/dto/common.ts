import { 
    IsDefined,
    IsNumber, 
    IsString, 
    ValidatorConstraint, 
    ValidatorConstraintInterface,
} from "class-validator";

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


export class NginxConfig {

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
