import { IsString, IsNumber, IsOptional } from 'class-validator';
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
    @IsString()
    id: string;
}

export class getPilotDto {

    @IsOptional()
    @IsString()
    id: string;
}

export class deletePilotDto {
    @IsString()
    id: string;
}