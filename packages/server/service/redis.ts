import redis, { RedisClient } from "redis";
import { RedisConfig } from "../config";
import { CatchError } from "../decorator";

export default class RedisService {
    public redisClient: RedisClient;
    public prefix: string;

    constructor() {
        this.prefix = RedisConfig.redisprefix;
    }

    @CatchError()
    public async connect() {
        this.redisClient = redis.createClient({
            host: RedisConfig.redishost,
            port: RedisConfig.redisport,
            password: RedisConfig.redispass,
        });
        console.log('连接到Redis数据库');
    }

    @CatchError()
    public setString(key: string, value: string) {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, (err: Error, reply: "OK") => {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            });
        });
    }

    @CatchError()
    public getString(key: string) {
        return new Promise((resolve) => {
            this.redisClient.get(key, (err: Error, reply: string) => {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(reply);
            });
        });
    }

    @CatchError()
    public setHashMap(key: string, data: Record<string, any>) {
        return new Promise((resolve) => {
            const args = [];
            for (let [key, value] of Object.entries(data)) {
                args.push(key, value);
            }
            this.redisClient.hmset([key, ...args]);
        });
    }

    @CatchError()
    public getHashMap(key: string) {
        return new Promise((resolve) => {
            this.redisClient.hmget(key, (err: Error, object:  Record<string, any>) => {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(object);
            });
        });
    }

    @CatchError()
    public setList(key: string, data: string[] | string) {
        return new Promise((resolve) => {
           this.redisClient.rpush(key, data, (err, reply) => {
                if(err) {
                    resolve(null);
                    return;
                }
                resolve(true);
           });
        });
    }

    @CatchError()
    public getList(key: string): Promise<string[] | null> {
        return new Promise((resolve) => {
           this.redisClient.lrange(key, 0, -1, (err, reply) => {
                if(err) {
                    resolve(null);
                    return;
                }
                resolve(reply);
           });
        });
    }

    @CatchError()
    public setSets(key: string, data: string[] | string) {
        return new Promise((resolve) => {
           this.redisClient.sadd(key, data, (err, reply) => {
                if(err) {
                    resolve(null);
                    return;
                }
                resolve(true);
           });
        });
    }

    @CatchError()
    public getSets(key: string) {
        return new Promise((resolve) => {
           this.redisClient.smembers(key, (err, reply) => {
                if(err) {
                    resolve(null);
                    return;
                }
                resolve(reply);
           });
        });
    }

    @CatchError() 
    public deleteKey(key: string) {
        return new Promise((resolve) => {
            this.redisClient.del(key, (err) => {
                 if(err) {
                     resolve(false);
                     return;
                 }
                 resolve(true);
            });
         });
    }

    @CatchError()
    public close() {
        this.redisClient.quit();
    }
}
