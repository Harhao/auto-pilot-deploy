import { RedisClient } from "redis";

declare module globalThis {
    redisClient: RedisClient;
}