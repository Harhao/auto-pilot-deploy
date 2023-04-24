import { Context } from 'koa';
import { Controller, Get, Post, ValidateDto, CatchError, ValidateAuth, Response, Put } from '../decorator';
import { CommonCmdDto } from '../dto';
import { Inject } from '../ioc';
import ProjectService from '../service/project';

@Controller('/project')
export default class ProjectController {

    @Inject projectService: ProjectService;

    @Post('/create')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonCmdDto)
    @Response
    public async createProject(ctx: Context) {

    }


    @Put('/update')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonCmdDto)
    @Response
    public async updateProject(ctx: Context) {

    }

    @Get('/getProject')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonCmdDto)
    @Response
    public async getProjects(ctx: Context) {

    }

    @Post('/delProject')
    @ValidateAuth()
    @CatchError()
    @ValidateDto(CommonCmdDto)
    @Response
    public async deleteProject(ctx: Context) {

    }
}
