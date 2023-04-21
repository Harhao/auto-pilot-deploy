import MongoDBService from "./mongo";

import { CreateCrpyto } from "../utils";
import { CatchError } from "../decorator";
import { CreatePilotDto, UpdatePilotDto } from "../dto";
import { Inject, Injectable } from "../ioc";
import { EResponseCodeMap } from "../consts";

@Injectable
export default class PilotService {

    private static tableName: string = 'pilot';

    @Inject private mongodbService: MongoDBService;

    @CatchError()
    public async createPilot(data: CreatePilotDto) {
        const insertInfo = {
            ...data,
            serverPass: CreateCrpyto.symEncrypt(data.serverPass)
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

    @CatchError()
    public async updatePilot(data: UpdatePilotDto) {
        const result = await this.mongodbService.updateOne(PilotService.tableName, { _id: data.id }, data);
    }

    @CatchError()
    public async getPilot(): Promise<any> {
        const result: any = await this.mongodbService.findOne(PilotService.tableName, {});
        return result;
    }
}