import { Inject, Injectable } from "../ioc";
import { CatchError } from "../decorator";
import RedisService from "./redis";
import { RedisConfig } from "../config";


@Injectable
export default class ProcessService {

    @Inject private redisService: RedisService;


    @CatchError()
    public async saveProcess(pid: number) {
       return await this.redisService.setList(`${RedisConfig.redisdeployList}`, pid);
    }

    @CatchError()
    public async deleteProcess(pid: number): Promise<boolean> {
        return await this.redisService.delListKey(`${RedisConfig.redisdeployList}`, pid);
    }

    @CatchError()
    public async existProcess(pid: number):Promise<boolean> {
        return await this.redisService.existKeyVal(RedisConfig.redisdeployList, pid);
    }
}