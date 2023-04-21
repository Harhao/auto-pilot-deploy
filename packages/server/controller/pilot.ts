import { Context } from "koa";
import { CatchError, Controller, Get, Post, ValidateDto } from "../decorator";
import { CreatePilotDto } from "../dto";
import { Inject } from "../ioc";

import PilotService from "../service/pilot";

@Controller("/pilot")
export default class PilotController {
    
    @Inject private pilotService: PilotService;

    @Post("/create")
    @CatchError()
    @ValidateDto(CreatePilotDto)
    public async create(ctx: Context) {
        const pilotDto: CreatePilotDto = ctx.request.body;
        const resp = await this.pilotService.createPilot(pilotDto);
        ctx.body = resp;
    }

    @Post("/update")
    @CatchError()
    @ValidateDto(CreatePilotDto)
    public async update(ctx: Context) {
        const userData = ctx.request.body;
        const resp = await this.pilotService.updatePilot(userData);
        ctx.body = resp;        
    }

    @Get("/info")
    @CatchError()
    public async getDetail(ctx: Context) {
        const userData = ctx.request.body;
        const resp = await this.pilotService.getPilot();
        ctx.body = resp;        
    }
}
