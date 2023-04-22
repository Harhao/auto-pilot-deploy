import { IsDefined, IsNumber, IsString, isString } from "class-validator";


export class CommonNginxDto {

    @IsDefined()
    @IsNumber()
    apiPort: number;

    @IsDefined()
    @IsString()
    apiPrefix: string;


    @IsDefined()
    @IsString()
    apiHost: string;

    @IsDefined()
    @IsString()
    apiDomain: string;
}

// 创建nginx的dto
export class CreateNginxDot extends CommonNginxDto {}


//删除nginx的 dto 

export class deleteNginxDto {

    @IsDefined()
    @IsNumber()
    nginxId: number;
    
}



