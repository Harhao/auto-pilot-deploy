import { Context } from "koa";
import { CatchError, Controller, Post, ValidateDto } from "../decorator";
import { LoginUserDto } from "../dto";
import { Inject } from "../ioc";

import NginxService from "../service/nginx";

@Controller("/nginx")
export default class NginxController {
    
    @Inject private nginxService: NginxService;

    @Post("/create")
    @CatchError()
    @ValidateDto(LoginUserDto)
    public async create(ctx: Context) {
       
    }
}
