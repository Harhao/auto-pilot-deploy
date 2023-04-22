import { IsDefined, IsNumber, IsString } from "class-validator";
import { ProjectDto } from "./project";

export class CommonCmdDto {
    
    @IsDefined()
    @IsNumber()
    id: number;
}

export class RollbackCmdDto extends ProjectDto{

    @IsString()
    @IsDefined()
    rollNode: string;

}


export class StopCmdDto extends CommonCmdDto {}


export class StartCmdDto extends CommonCmdDto {}