import dotenv from "dotenv";
import { resolve } from "path";

const nodeEnv = process.env.NODE_ENV;

const options = {
    path: resolve(__dirname, `../.env.${nodeEnv}`),
    encoding: "utf8",
};

dotenv.config(options);

// redis 配置
export const RedisConfig = {
    redisport: +process.env.REDISPORT,
    redispass: process.env.REDISPASS,
    redishost: process.env.REDISHOST,
};

// mongodb配置
export const MongoConfig = {
    databaseUrl: process.env.DATABASE_URL,
};

// 七牛云配置
export const QiniuOssConfig = {
    SecretKey: process.env.SECRET_KEY,
    AccessKey: process.env.ACCESS_KEY,
    UploadSpace: process.env.UPLOAD_SPACE,
    Domain: process.env.DOMAIN,
};

// 服务配置
export const ServerConfig = {
    port: +(process.env.PORT || 8080),
    jwtSecret: process.env.JWT_SECRET,
    serverCors: {
        origin: '*',
        maxAge: 5,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
    },
};
