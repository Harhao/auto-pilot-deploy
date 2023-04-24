import { Body, CatchError, Controller, Post, Response, ValidateDto } from "../decorator";
import { createUserDto, LoginUserDto } from "../dto";
import { Inject } from "../ioc";

import UserService from "../service/user";

@Controller("/user")
export default class UserController {
    
    @Inject private userService: UserService;

    @Post("/login")
    @CatchError()
    @ValidateDto(LoginUserDto)
    @Response
    public async login(@Body loginDto: LoginUserDto) {
        return await this.userService.login(loginDto); 
        
    }

    @Post("/register")
    @CatchError()
    @ValidateDto(createUserDto)
    @Response
    public async register(@Body userData: createUserDto) {
        return await this.userService.register(userData);     
    }
}
