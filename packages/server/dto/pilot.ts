import { IsString, IsNumber } from 'class-validator';
export class CreatePilotDto {
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

    @IsNumber()
    id?: number;
}