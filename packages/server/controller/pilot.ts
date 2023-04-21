import { Context } from "koa";
import { CatchError, Controller, Delete, Get, Post, ValidateDto } from "../decorator";
import { CreatePilotDto, UpdatePilotDto, getPilotDto } from "../dto";
import { Inject } from "../ioc";

import PilotService from "../service/pilot";

@Controller("/pilot")
export default class PilotController {
    
    @Inject private pilotService: PilotService;

    @Post("/createPilot")
    @CatchError()
    @ValidateDto(CreatePilotDto)
    public async createPilot(ctx: Context) {
        const pilotDto: CreatePilotDto = ctx.request.body;
        const resp = await this.pilotService.createPilot(pilotDto);
        ctx.body = resp;
    }

    @Post("/updatePilot")
    @CatchError()
    @ValidateDto(UpdatePilotDto)
    public async updatePilot(ctx: Context) {
        const userData = ctx.request.body;
        const resp = await this.pilotService.updatePilot(userData);
        ctx.body = resp;        
    }

    @Get("/getPilot")
    @CatchError()
    @ValidateDto(getPilotDto)
    public async getPilot(ctx: Context) {
        const userData = ctx.request.body;
        const resp = await this.pilotService.getPilot();
        ctx.body = resp;        
    }

    @Delete("/delPilot")
    @CatchError()
    @ValidateDto(getPilotDto)
    public async deletePilot(ctx: Context) {
        const userData = ctx.request.body;
        const resp = await this.pilotService.getPilot();
        ctx.body = resp;        
    }
}
