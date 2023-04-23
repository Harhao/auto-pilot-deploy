import "reflect-metadata";
import Koa from "koa";

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch';

interface Middleware {
    (ctx: Koa.Context, next: () => Promise<any>): any;
}

interface IControllerRoute {
    routePath: string;
    method: HTTPMethod;
    middlewares: Middleware[];
    handler: (ctx: Koa.Context) => void;
};

export const Get = createMappingDecorator('get');
export const Post = createMappingDecorator('post');
export const Put = createMappingDecorator('put');
export const Delete = createMappingDecorator('del');

export function Controller(prefix: string): ClassDecorator {
    return (target: any) => {
        const prefixPath = prefix || '';
        const routes = Reflect.getMetadata('routes', target.prototype) || [];
        const controllers: IControllerRoute[] = [];
        routes.forEach((route: any) => {
            const { method, path } = route.options;
            const middlewares = [...(target.middlewares || []), ...(route.middlewares || [])];
            const handler = route.handler.bind(new target());
            controllers.push({
                routePath: `${prefixPath}${path}`,
                method: method,
                middlewares: middlewares,
                handler: handler,
            });
        });
        Reflect.defineMetadata('controllerInfo', controllers, target);
    };
}

export function Response(target: any, key: string, descriptor: any) {
    
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const ctx = args[0];
        const result = await originalMethod.apply(this, args);
        ctx.body = result;
    };
    return descriptor;
}

function createMappingDecorator(method: HTTPMethod): (path: string, ...middlewares: Middleware[]) => MethodDecorator {
    return (path: string, ...middlewares: Middleware[]) => {
        return (target: any, key: string, decriptor: any) => {
            const routes = Reflect.getMetadata('routes', target.constructor.prototype) || [];
            routes.push({
                options: {
                    method,
                    path,
                },
                middlewares,
                handler: decriptor.value,
            });
            Reflect.defineMetadata('routes', routes, target.constructor.prototype);
        };
    };
}

export function CatchError() {
    return function (target: any, propertyKey: string, descriptor: any) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let result;
            try {
                result = originalMethod.apply(this, args);
            } catch (e) {
                console.error(`${propertyKey} error ${e}`);
            }
            return result ?? null;
        };
        return descriptor;
    };
}
