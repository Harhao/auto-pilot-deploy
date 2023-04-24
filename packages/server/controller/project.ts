import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Put, Body, Query } from '../decorator';
import { CommonCmdDto, CommonProjectDto } from '../dto';
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
    @ValidateDto(CommonCmdDto)
    @Response
    public async updateProject(@Body data: CommonCmdDto) {

    }

    @Get('/getProject')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonCmdDto)
    @Response
    public async getProjects(@Query data: CommonCmdDto) {

    }

    @Post('/delProject')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonCmdDto)
    @Response
    public async deleteProject(@Body data: CommonCmdDto) {

    }
}
