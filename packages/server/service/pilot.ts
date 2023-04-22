import MongoDBService from "./mongo";

import { CreateCrpyto } from "../utils";
import { CatchError } from "../decorator";
import { CommonPilot, UpdatePilotDto } from "../dto";
import { Inject, Injectable } from "../ioc";
import { EResponseCodeMap } from "../consts";
import { ObjectId } from "mongodb";

@Injectable
export default class PilotService {

    private static tableName: string = 'pilot';

    @Inject private mongodbService: MongoDBService;

    @CatchError()
    public async createPilot(data: CommonPilot) {
        
        const pilotList = await this.mongodbService.findOne(PilotService.tableName, {});

        if(!pilotList) {
            const insertInfo = {
                ...data,
                serverPass: CreateCrpyto.encrypt(data.serverPass)
            };
            const result = await this.mongodbService.insertOne(PilotService.tableName, insertInfo);
            if (result.acknowledged) {
                return {
                    code: EResponseCodeMap.SUCCESS,
                    data: '创建成功',
                    msg: 'success'
                }
            }
            return {
                code: EResponseCodeMap.NORMALERROR,
                data: '创建失败',
                msg: 'success'
            }
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: '已设置过配置',
            msg: 'success'
        }
    }

    @CatchError()
    public async updatePilot(data: UpdatePilotDto) {

        const result = await this.mongodbService.updateOne(PilotService.tableName,{ _id: new ObjectId(data.id) }, data);

        if(result?.modifiedCount > 0) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: true,
                msg: 'success'
            }
        }
        return {
            code: EResponseCodeMap.SUCCESS,
            data: false,
            msg: 'success'
        }
    }

    @CatchError()
    public async getPilot(id?: number): Promise<any> {
        const filter =  id ? { id } : {};
        const result: any = await this.mongodbService.findOne(PilotService.tableName, filter);

        if(result) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: {
                    ...result,
                    serverPass: CreateCrpyto.decrypt(result.serverPass)
                },
                msg: 'success'
            }
        }
        return {
            code: EResponseCodeMap.SUCCESS,
            data: null,
            msg: 'success'
        };
    }

    @CatchError()
    public async deletePilot(id: string) {
        const result: any = await this.mongodbService.deleteOne(PilotService.tableName, { _id: new ObjectId(id) });
        console.log(result);
        if(result?.deletedCount > 0) {
            return {
                code: EResponseCodeMap.SUCCESS,
                data: true,
                msg: 'success'
            }
        }
        return {
            code: EResponseCodeMap.SUCCESS,
            data: false,
            msg: 'success'
        };
    }
}