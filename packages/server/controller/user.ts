import { Context } from 'koa';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth } from '../decorator';
import { ProjectDto } from '../dto';
import UserService from '../service/user';

@Controller('/user')
export default class UserController {

    @Post('/register')
    @CatchError()
    @ValidateDto(ProjectDto)
    public async register(ctx: Context) {

        ctx.body = {
            code: 200,
            data: null,
            msg: 'success'
        };
    }

}
