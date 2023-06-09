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
    redisprefix: process.env.REDISPREFIX,
    redisPidMap: process.env.REDISPIDMAP,
};

// mongodb配置
export const MongoConfig = {
    databaseUrl: process.env.DATABASE_URL,
    databaseName: process.env.DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    cryptoRandom: process.env.CRYPTORANDOM,
    serverCors: {
        origin: process.env.NODE_ENV === 'production' ? 'admin.oss-storage.top' : '*',
        maxAge: 86400,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
    },
    bodyConfig: {
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024,
        },
    }

};
