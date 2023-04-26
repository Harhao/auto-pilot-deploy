import MongoDBService from "./mongo";
import LogsService from "./logs";
import { CommonProjectDto, DelProjectDto, GetProjectDto, UpdateProjectDto, deletePilotDto } from "../dto";
import { Inject, Injectable } from "../ioc";
import { EResponseCodeMap } from "../consts";
import { ObjectId } from "mongodb";



@Injectable
export default class ProjectService {

    public static tableName: string = 'project';

    @Inject mongoService: MongoDBService;
    @Inject logService: LogsService;

    public async createProject(data: CommonProjectDto) {
        const result = await this.mongoService.insertOne(ProjectService.tableName, data);
        if (result?.acknowledged) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: true,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: false,
            msg: 'success'
        };
    }

    public async updateProject(data: UpdateProjectDto) {
        const result = await this.mongoService.updateOne(ProjectService.tableName, {
            _id: new ObjectId(data.projectId)
        }, data);
        if (result?.acknowledged) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: true,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: false,
            msg: 'success'
        };
    }

    public async getProject(data: GetProjectDto) {

        const filter = data?.projectId ? { id: new ObjectId(data.projectId) } : {};
        const result = await this.mongoService.find(ProjectService.tableName, filter);
        if (result) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: result,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.SUCCESS,
            data: null,
            msg: 'success'
        };
    }


    public async delProject(data: DelProjectDto) {

        const result = await this.mongoService.deleteOne(ProjectService.tableName, {
            _id: new ObjectId(data.projectId),
        });
        console.log(result)
        return {
            code: EResponseCodeMap.SUCCESS,
            data: !!result?.deletedCount,
            msg: 'success'
        };
    }

}