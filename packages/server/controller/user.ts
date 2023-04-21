import { Context } from "koa";
import { CatchError, Controller, Post, ValidateDto } from "../decorator";
import { createUserDto, LoginUserDto } from "../dto";
import { Inject } from "../ioc";

import UserService from "../service/user";

@Controller("/user")
export default class UserController {
    
    @Inject private userService: UserService;

    @Post("/login")
    @CatchError()
    @ValidateDto(LoginUserDto)
    public async login(ctx: Context) {
        const loginDto: LoginUserDto = ctx.request.body;
        const resp =  await this.userService.login(loginDto);
        ctx.body = resp;
    }

    @Post("/register")
    @CatchError()
    @ValidateDto(createUserDto)
    public async register(ctx: Context) {
        const userData = ctx.request.body;
        const resp = await this.userService.register(userData);
        ctx.body = resp;        
    }
}
