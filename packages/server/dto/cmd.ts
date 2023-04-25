import { IsDefined, IsNumber, IsString } from "class-validator";
import { UpdateProjectDto } from "./project";

export class DeployCmdDto extends UpdateProjectDto {

    @IsString()
    @IsDefined()
    //部署额外信息
    commitMsg: string;
}

export class RollbackCmdDto extends UpdateProjectDto {

    @IsString()
    @IsDefined()
    rollNode: string;
}

export class StopCmdDto extends UpdateProjectDto {
    @IsDefined()
    @IsNumber()
    serviceId: number;
}


export class StartCmdDto extends UpdateProjectDto {

    @IsDefined()
    @IsNumber()
    serviceId: number;
}