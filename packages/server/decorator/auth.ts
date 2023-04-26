import Koa from 'koa';
import container from '../ioc/container';
import MongoDBService from '../service/mongo';
import AuthService from '../service/auth';
import { getContextArgs, getNextArgs } from './routes';


function throwUnauthorized(ctx: Koa.Context, data: any = null) {
    ctx.body = {
        code: 401,
        data: data,
        msg: 'Unauthorized'
    };
}

function validateJwt(): Koa.Middleware {
    return async (ctx, next) => {

        try {
            // 获取JWT token
            const token = ctx.headers.authorization?.replace(/^Bearer\s+/, '');

            if (!token) {
                throwUnauthorized(ctx);
                return;
            }
            // 验证JWT token
            const payload = AuthService.verifyToken(token);

            const mongodbService = container.getInstance(MongoDBService);

            const userInfo = await mongodbService.findOne('users', { userName: payload.userName });

            if(userInfo.userName === payload.userName) {
                ctx.state.user = payload;
                await next();
                return;
            }
            throwUnauthorized(ctx, "user is not exist");
        } catch (err) {
            throwUnauthorized(ctx, err);
        }
    };
}

export function ValidateAuth() {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const ctx = getContextArgs(args);
            const next = getNextArgs(args);
            await validateJwt()(ctx, next);
            if (ctx.state.user) {
               return await originalMethod.call(this, ...args);;
            }
            return null;
        };

        return descriptor;
    }
}