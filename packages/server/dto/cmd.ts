import { IsDefined, IsNumber, IsString } from "class-validator";
import { CommonProjectDto } from "./project";

export class CommonCmdDto {
    
    @IsDefined()
    @IsNumber()
    id: number;
}

export class RollbackCmdDto extends CommonProjectDto {

    @IsString()
    @IsDefined()
    rollNode: string;

}


export class StopCmdDto extends CommonCmdDto {}


export class StartCmdDto extends CommonCmdDto {}