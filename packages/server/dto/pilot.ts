import { IsString } from 'class-validator';
export class PilotDto {
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