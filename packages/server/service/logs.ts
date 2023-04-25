import MongoDBService from "./mongo";
import { Inject, Injectable } from "../ioc";
import { ELogsRunStatus, EResponseCodeMap } from "../consts";
import { ObjectId } from "mongodb";
import { CreateLogDto, GetLogsDetailDto, GetLogsDto, UpdateLogDto } from "../dto";


@Injectable
export default class LogsService {

    public static tableName: string = 'logs';

    @Inject mongoService: MongoDBService;


    public async createLogs(data: CreateLogDto) {

        const result = await this.mongoService.insertOne(LogsService.tableName, data);

        if (result.insertedId) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: result.insertedId,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: null,
            msg: 'success'
        };
    }

    public async updateLogs(data: UpdateLogDto) {
        const result = await this.mongoService.updateOne(
            LogsService.tableName,
            {
                _id: new ObjectId(data.logId)
            }, data);
        if (result?.acknowledged) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: result,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: null,
            msg: 'success'
        };
    }

    public async getLogs(data: GetLogsDto) {
        const result = await this.mongoService.find(LogsService.tableName, data);
        if (result?.acknowledged) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: result,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: null,
            msg: 'success'
        };
    }

    public async getLogsDetail(data: GetLogsDetailDto) {
        const result = await this.mongoService.findOne(LogsService.tableName, {
            projectId: new ObjectId(data.projectId),
            id: new ObjectId(data.logId)
        });
        if (result?.acknowledged) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: result,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: null,
            msg: 'success'
        };
    }

}