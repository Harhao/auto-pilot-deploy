import { IsString, IsOptional, IsDefined } from 'class-validator';
export class CommonPilot {
    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    account: string;

    @IsOptional()
    @IsString()
    serverPass: string;

    @IsOptional()
    @IsString()
    gitUser: string;
    
    @IsOptional()
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
    pilotId?: string;
}

export class getPilotListDto {

    @IsOptional()
    @IsString()
    env?: string;
}

export class deletePilotDto {
    @IsString()
    pilotId: string;
}