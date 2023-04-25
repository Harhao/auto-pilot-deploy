import MongoDBService from "./mongo";
import { CommonProjectDto, GetProjectDto, UpdateProjectDto, deletePilotDto } from "../dto";
import { Inject, Injectable } from "../ioc";
import { EResponseCodeMap } from "../consts";
import { ObjectId } from "mongodb";


@Injectable
export default class ProjectService {

    public static tableName: string = 'project';

    @Inject mongoService: MongoDBService;

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
            _id: data.id
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
        
        const filter = data?.id ? { id: new ObjectId(data.id)} : {};
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


    public async delProject(data: deletePilotDto) {
        const result = await this.mongoService.deleteOne(ProjectService.tableName, {
            _id: new ObjectId(data.id)
        });
        if (result.acknowledged) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: true,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.SUCCESS,
            data: false,
            msg: 'success'
        };
    }

}