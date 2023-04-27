import MongoDBService from "./mongo";
import { Inject, Injectable } from "../ioc";
import { EResponseCodeMap } from "../consts";
import { ObjectId } from "mongodb";
import { CreateLogDto, GetLogsDetailDto, GetLogsDto, UpdateLogDto } from "../dto";
import RedisService from "./redis";


@Injectable
export default class LogsService {

    public static tableName: string = 'logs';

    @Inject mongoService: MongoDBService;
    @Inject redisService: RedisService;


    public async createLogs(data: CreateLogDto) {

        const result = await this.mongoService.insertOne(LogsService.tableName, {
            ...data,
            projectId: new ObjectId(data.projectId)
        });

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
            }, {
            ...data,
            projectId: new ObjectId(data.projectId)
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

    public async getLogs(data: GetLogsDto) {
        const result = await this.mongoService.find(
            LogsService.tableName,
            {
                projectId: new ObjectId(data.projectId),
            },
            {
                projection: { logList: 0 }
            }
        );

        if (result.length > 0) {
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
        const result = await this.mongoService.findOne(
            LogsService.tableName, {
            _id: new ObjectId(data.logId)
        },
            {
                projection: { logList: 1, logName: 1 }
            });

        // 如果logList有数据说明已经跑完
        if (result?.logName) {
            const list = result?.logList.length > 0 ? result.logList : (await this.redisService.getList(`${result.logName}`));
            return {
                code: EResponseCodeMap.SUCCESS,
                data: {
                    isDone: result?.logList.length > 0,
                    list,
                },
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