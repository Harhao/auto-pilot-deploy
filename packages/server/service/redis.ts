import redis, { RedisClient } from "redis";
import { promisify } from "util";
import { RedisConfig } from "../config";
import { CatchError } from "../decorator";

interface IEntity {
    id: string;
}

export default class RedisService<T extends IEntity> {
    public redisClient: RedisClient;
    public prefix: string;

    constructor(options: { prefix: string }) {
        this.prefix = options?.prefix;
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
    async create(entity: T): Promise<T> {
        await this.set(entity);
        return entity;
    }

    @CatchError()
    async findById(id: string): Promise<T | null> {
        const entity = await this.get(id);
        return entity ? JSON.parse(entity) : null;
    }

    @CatchError()
    async findAll(): Promise<T[]> {
        const keys = await this.keys();
        const entities = await Promise.all(keys.map((key) => this.get(key)));
        return entities
            .filter((e) => !!e)
            .map((e) => JSON.parse(e as string)) as T[];
    }

    @CatchError()
    async update(entity: T): Promise<T> {
        await this.set(entity);
        return entity;
    }

    @CatchError()
    async delete(id: string): Promise<void> {
        await this.redisClient.del(`${this.prefix}:${id}`);
    }

    @CatchError()
    private async set(entity: T): Promise<void> {
        const key = `${this.prefix}:${entity.id}`;
        await this.redisClient.set(key, JSON.stringify(entity));
    }

    @CatchError()
    private async get(id: string): Promise<string | null> {
        const key = `${this.prefix}:${id}`;
        return promisify(this.redisClient.get).bind(this.redisClient)(key);
    }

    @CatchError()
    private async keys(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redisClient.keys(`${this.prefix}:*`, (err, keys) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(keys);
                }
            });
        });
    }

    @CatchError() 
    public close() {
        this.redisClient.quit();
    }
}
