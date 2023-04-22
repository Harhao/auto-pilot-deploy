import { IsDefined, IsNumber } from "class-validator";

export class CommonCmdDto {
    
    @IsDefined()
    @IsNumber()
    id: number;
}

export class RollbackCmdDto extends CommonCmdDto {}


export class StopCmdDto extends CommonCmdDto {}


export class StartCmdDto extends CommonCmdDto {}