import MongoDBService from "./mongo";
import { CommonProjectDto } from "../dto";
import { Inject, Injectable } from "../ioc";
import { EResponseCodeMap } from "../consts";





@Injectable
export default class ProjectService {

    public static tableName: string = 'project';

    @Inject mongoService:MongoDBService;

    public async createProject(data: CommonProjectDto) {
        const result = await this.mongoService.insertOne(ProjectService.tableName, data);
        if(result?.acknowledged) {
            return {
                code:EResponseCodeMap.SUCCESS,
                data: true,
                msg: 'success'
            };
        } 
        return {
            code:EResponseCodeMap.NORMALERROR,
            data: false,
            msg: 'success'
        };
    }

}