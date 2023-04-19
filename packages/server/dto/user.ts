import { IsDefined, IsString } from 'class-validator';

export class createUserDto {

    @IsDefined()
    @IsString()
    userNumber: string;


    @IsDefined()
    @IsString()
    password: string;

}