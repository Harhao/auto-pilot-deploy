import { IsDefined, IsString } from 'class-validator';

export class createUserDto {

    @IsDefined()
    @IsString()
    userName: string;


    @IsDefined()
    @IsString()
    password: string;

}

export class LoginUserDto {
    @IsDefined()
    @IsString()
    userName: string;


    @IsDefined()
    @IsString()
    password: string;
}