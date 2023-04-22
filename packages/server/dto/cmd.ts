import { IsDefined, IsNumber } from "class-validator";

export class CommonCmdDto {
    @IsNumber()
    @IsDefined()
    id: number;
}

export class RollbackCmdDto extends CommonCmdDto {}


export class StopCmdDto extends CommonCmdDto {}


export class StartCmdDto extends CommonCmdDto {}