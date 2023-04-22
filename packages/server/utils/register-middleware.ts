import Koa from 'koa';
import cors from 'koa2-cors';
import error from 'koa-json-error';
import helmet from 'koa-helmet';
import body from 'koa-body';
import koaLog4 from 'koa-log4';
import { RateLimit } from 'koa2-ratelimit';
import log4js from 'log4js';
import log4jsJson from '../log4js.json';
import { ServerConfig } from '../config';

interface IErrorType {
    name: string
    status: number
    message: string
    stack: string
}


export class MiddlewareLoader {

    public static async load(app: Koa) {

        const { serverCors, bodyConfig } = ServerConfig;

        app.use(RateLimit.middleware({
            interval: { min: 15 },
            max: 1000,
        }));

        app.use(helmet());

        app.use(cors(serverCors));

        app.use(MiddlewareLoader.log4jsMiddleware());

        app.use(body(bodyConfig));

        app.use(error({
            postFormat: (_err: Error, data: IErrorType) => {
                const isProdEnv = process.env.NODE_ENV === 'prod';
                return isProdEnv ? { ...data, stack: null } : data;
            }
        }));
    }

    public static log4jsMiddleware(): Koa.Middleware {
        log4js.configure(log4jsJson);
        const logger = log4js.getLogger();
        return koaLog4.koaLogger(logger, { level: 'auto' });
    }
}
