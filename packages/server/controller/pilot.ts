import { Body, CatchError, Controller, Get, Post, Put, Query, Response, ValidateDto } from "../decorator";
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
    public async createPilot(@Body pilotDto: CommonPilot) {
        return await this.pilotService.createPilot(pilotDto);
    }

    @Put("/updatePilot")
    @CatchError()
    @ValidateDto(UpdatePilotDto)
    @Response
    public async updatePilot(@Body userData: UpdatePilotDto) {
        return await this.pilotService.updatePilot(userData);        
    }

    @Get("/getPilot")
    @CatchError()
    @ValidateDto(getPilotDto)
    @Response
    public async getPilot(@Query body: getPilotDto) {
        const { id = null } = body;
        return await this.pilotService.getPilot(id);       
    }

    @Post("/delPilot")
    @CatchError()
    @ValidateDto(deletePilotDto)
    @Response
    public async deletePilot(@Body body: deletePilotDto) {
        const { id } = body;
        return await this.pilotService.deletePilot(id);     
    }
}
