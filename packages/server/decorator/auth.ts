import Koa from 'koa';
import AuthService  from '../service/auth';

function validateJwt(): Koa.Middleware {
    return async (ctx, next) => {

        const unauthorizedData: unknown = {
            code: 401,
            data: null,
            error: 'Unauthorized'
        };

        try {
            // 获取JWT token
            const token = ctx.headers.authorization?.replace(/^Bearer\s+/, '');

            if (!token) {
                ctx.throw(401);
                return;
            }
            // 验证JWT token
            const payload = AuthService.verifyToken(token);

            ctx.state.user = payload;

            await next();

        } catch (err) {
            ctx.body = unauthorizedData;
        }
    };
}

export function ValidateAuth() {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        descriptor.value = async function (ctx: Koa.Context, next: Koa.Next) {
            await validateJwt()(ctx, next);
            if(ctx.state.user) {
                await originalMethod.call(this, ctx, next);
            }
        };

        return descriptor;
    }
}