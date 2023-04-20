import { Context } from 'koa';
import { Controller, Post, ValidateDto, CatchError } from '../decorator';
import { LoginUserDto, createUserDto } from '../dto';
import UserService from '../service/user';
import AuthService from '../service/auth';

@Controller('/user')
export default class UserController {
    
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    @Post('/login')
    @CatchError()
    @ValidateDto(LoginUserDto) 
    public async login(ctx: Context) {
        const token = AuthService.generateToken({
            id: 123,
            name: ctx.request.body.userName
        });

        ctx.body = {
            code: 200,
            data: token,
            msg: 'success'
        };
    }


    @Post('/register')
    @CatchError()
    @ValidateDto(createUserDto) 
    public async register(ctx: Context) {
    
        await this.userService.register();
        ctx.body = {
            code: 200,
            data: null,
            msg: 'success'
        };
    }

}
