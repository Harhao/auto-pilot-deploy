import { Context } from "koa";
import { CatchError, Controller, Delete, Get, Post, Put, ValidateDto } from "../decorator";
import { CommonPilot, UpdatePilotDto, deletePilotDto, getPilotDto } from "../dto";
import { Inject } from "../ioc";

import PilotService from "../service/pilot";

@Controller("/pilot")
export default class PilotController {
    
    @Inject private pilotService: PilotService;

    @Post("/createPilot")
    @CatchError()
    @ValidateDto(CommonPilot)
    public async createPilot(ctx: Context) {
        const pilotDto: CommonPilot = ctx.request.body;
        const resp = await this.pilotService.createPilot(pilotDto);
        ctx.body = resp;
    }

    @Put("/updatePilot")
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
        const { id = null } = ctx.request.body;
        const resp = await this.pilotService.getPilot(id);
        ctx.body = resp;        
    }

    @Post("/delPilot")
    @CatchError()
    @ValidateDto(deletePilotDto)
    public async deletePilot(ctx: Context) {
        const { id } = ctx.request.body;
        const resp = await this.pilotService.deletePilot(id);
        ctx.body = resp;        
    }
}
