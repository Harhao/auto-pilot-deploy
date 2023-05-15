import MongoDBService from './mongo';
import LogsService from './logs';
import { CommonProjectDto, DelProjectDto, GetProjectDto, UpdateProjectDto, deletePilotDto } from '../dto';
import { Inject, Injectable } from '../ioc';
import { EResponseCodeMap } from '../consts';
import { ObjectId } from 'mongodb';



@Injectable
export default class ProjectService {

    public static tableName = 'project';

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

        const pageParams: any = { pageSize: data?.pageSize ?? 10, pageNum: data?.pageNum ?? 1,};
        const params: any = {};

        data?.projectId && (params._id = new ObjectId(data.projectId));
        data?.name && (params.name = { $regex: new RegExp(data.name, 'i') });


        const { result, total }= await this.mongoService.find(ProjectService.tableName, params, pageParams);

        if (result.length > 0) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data:  { list: result, total },
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
        return {
            code: EResponseCodeMap.SUCCESS,
            data: !!result?.deletedCount,
            msg: 'success'
        };
    }

}