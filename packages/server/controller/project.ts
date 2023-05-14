import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Put, Body, Query, EValidateFields } from '../decorator';
import {CommonProjectDto, DelProjectDto, GetProjectDto, UpdateProjectDto } from '../dto';
import { Inject } from '../ioc';
import ProjectService from '../service/project';

@Controller('/project')
export default class ProjectController {

    @Inject projectService: ProjectService;

    @Post('/create')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonProjectDto)
    @Response
    public async createProject(@Body data: CommonProjectDto) {
        return await this.projectService.createProject(data);
    }


    @Put('/update')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(UpdateProjectDto)
    @Response
    public async updateProject(@Body data: UpdateProjectDto) {
        return await this.projectService.updateProject(data);
    }

    @Post('/getProject')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(GetProjectDto)
    @Response
    public async getProjects(@Body data: GetProjectDto) {
        return await this.projectService.getProject(data);
    }

    @Post('/delProject')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(DelProjectDto)
    @Response
    public async deleteProject(@Body data: DelProjectDto) {
        return await this.projectService.delProject(data);
    }
}
