import { Inject, Injectable } from "../ioc";
import { CatchError } from "../decorator";
import RedisService from "./redis";
import { RedisConfig } from "../config";


@Injectable
export default class ProcessService {

    @Inject private redisService: RedisService;


    @CatchError()
    public async saveProcess(data: Record<string, any>) {
       return await this.redisService.setHashMap(`${RedisConfig.redisPidMap}`, data);
    }

    @CatchError()
    public async deleteProcess(logId: string): Promise<boolean> {
        return await this.redisService.deleteHashMapVal(`${RedisConfig.redisPidMap}`, logId);
    }

    @CatchError()
    public async existProcess(logId: string):Promise<number> {
        return await this.redisService.getHashMap(RedisConfig.redisPidMap, logId);
    }
}