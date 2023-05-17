import { IsString, IsOptional, IsDefined } from 'class-validator';
export class CommonPilot {
    @IsString()
    address: string;

    @IsString()
    account: string;

    @IsString()
    serverPass: string;

    @IsString()
    gitUser: string;

    @IsString()
    gitPass: string;
}

export class UpdatePilotDto extends CommonPilot {

    @IsDefined()
    @IsString()
    pilotId: string;
}

export class getPilotDto {

    @IsOptional()
    @IsString()
    pilotId?: number;
}

export class deletePilotDto {
    @IsString()
    pilotId: string;
}