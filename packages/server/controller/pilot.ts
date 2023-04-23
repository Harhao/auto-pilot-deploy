import { Context } from "koa";
import { CatchError, Controller, Delete, Get, Post, Put, Response, ValidateDto } from "../decorator";
import { CommonPilot, UpdatePilotDto, deletePilotDto, getPilotDto } from "../dto";
import { Inject } from "../ioc";

import PilotService from "../service/pilot";

@Controller("/pilot")
export default class PilotController {
    
    @Inject private pilotService: PilotService;

    @Post("/createPilot")
    @CatchError()
    @ValidateDto(CommonPilot)
    @Response
    public async createPilot(ctx: Context) {
        const pilotDto: CommonPilot = ctx.request.body;
        return await this.pilotService.createPilot(pilotDto);
    }

    @Put("/updatePilot")
    @CatchError()
    @ValidateDto(UpdatePilotDto)
    @Response
    public async updatePilot(ctx: Context) {
        const userData = ctx.request.body;
        return await this.pilotService.updatePilot(userData);        
    }

    @Get("/getPilot")
    @CatchError()
    @ValidateDto(getPilotDto)
    @Response
    public async getPilot(ctx: Context) {
        const { id = null } = ctx.request.body;
        return await this.pilotService.getPilot(id);       
    }

    @Post("/delPilot")
    @CatchError()
    @ValidateDto(deletePilotDto)
    @Response
    public async deletePilot(ctx: Context) {
        const { id } = ctx.request.body;
        return await this.pilotService.deletePilot(id);     
    }
}
