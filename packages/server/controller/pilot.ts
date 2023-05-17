import { Body, CatchError, Controller, EValidateFields, Get, Post, Put, Query, Response, ValidateAuth, ValidateDto } from "../decorator";
import { CommonPilot, UpdatePilotDto, deletePilotDto, getPilotDto } from "../dto";
import { Inject } from "../ioc";

import PilotService from "../service/pilot";

@Controller("/pilot")
export default class PilotController {
    
    @Inject private pilotService: PilotService;

    @Post("/createPilot")
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonPilot)
    @Response
    public async createPilot(@Body pilotDto: CommonPilot) {
        return await this.pilotService.createPilot(pilotDto);
    }

    @Put("/updatePilot")
    @ValidateAuth()
    @CatchError()
    @ValidateDto(UpdatePilotDto)
    @Response
    public async updatePilot(@Body userData: UpdatePilotDto) {
        return await this.pilotService.updatePilot(userData);        
    }

    @Get("/getPilot")
    @ValidateAuth()
    @CatchError()
    @ValidateDto(getPilotDto, EValidateFields.QUERY)
    @Response
    public async getPilot(@Query body: getPilotDto) {
        const { pilotId = null } = body;
        return await this.pilotService.getPilot(pilotId);       
    }

    @Post("/delPilot")
    @ValidateAuth()
    @CatchError()
    @ValidateDto(deletePilotDto)
    @Response
    public async deletePilot(@Body body: deletePilotDto) {
        const { pilotId } = body;
        return await this.pilotService.deletePilot(pilotId);     
    }
}
