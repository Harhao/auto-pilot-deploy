import "reflect-metadata";
import Koa, { Context } from "koa";

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch';

interface Middleware {
    (ctx: Koa.Context, next: () => Promise<void>): void;
}

interface IControllerRoute {
    routePath: string;
    method: HTTPMethod;
    middlewares: Middleware[];
    functionName: string;
    params: any;
};

export const Get = createMappingDecorator('get');
export const Post = createMappingDecorator('post');
export const Put = createMappingDecorator('put');
export const Delete = createMappingDecorator('del');

export const Body = InjectAttributeDecorator((ctx: Context) => ctx.request.body);
export const Query = InjectAttributeDecorator((ctx: Context) => ctx.request.query);
export const Header = InjectAttributeDecorator((ctx: Context) => ctx.request.header);
export const Cookie = InjectAttributeDecorator((ctx: Context) => ctx.cookie);
export const State = InjectAttributeDecorator((ctx: Context) => ctx.state);


export function Controller(prefix: string): ClassDecorator {
    return (target: any) => {
        const prefixPath = prefix || '';
        const routes = Reflect.getMetadata('routes', target.prototype) || [];
        const controllers: IControllerRoute[] = [];
        routes.forEach((route: any) => {
            const { method, path, functionName } = route;
            const middlewares = [...(target.middlewares || []), ...(route.middlewares || [])];
            const params = Reflect.getMetadata(`route_param_${functionName}`, target.prototype)?.[0] || null;

            controllers.push({
                routePath: `${prefixPath}${path}`,
                method: method,
                middlewares: middlewares,
                functionName: functionName,
                params: params
            });
        });
        Reflect.defineMetadata('classDecoratorData', controllers, target);
    };
}

export function createMappingDecorator(method: HTTPMethod): (path: string, ...middlewares: Middleware[]) => MethodDecorator {
    return (path: string, ...middlewares: Middleware[]) => {
        return (target: any, key: string, decriptor: any) => {
            const routes = Reflect.getMetadata('routes', target.constructor.prototype) || [];
            routes.push({
                method,
                path,
                middlewares,
                functionName: key,
                handler: decriptor.value,
            });
            Reflect.defineMetadata('routes', routes, target.constructor.prototype);
        };
    };
}

export function InjectAttributeDecorator(fn: Function) {
    return function (target: any, name: string, propertyIndex: number) {
        const meta = Reflect.getMetadata(`route_param_${name}`, target) || [];
        meta.push({ propertyIndex, name, fn });
        Reflect.defineMetadata(`route_param_${name}`, meta, target);
    };
}

export function Response(target: any, key: string, descriptor: PropertyDescriptor) {

    const originalMethod = descriptor.value;   
    descriptor.value = async function (...args: any[]) {
        const ctx = getContextArgs(args);
        const result = await originalMethod.apply(this, args);
        ctx.body = result;
    };
    
    return descriptor;
}

export function getContextArgs(args: any[]) {
    return args.find(arg => !!arg?.request);
}

export function getNextArgs(args: any[]) {
    return args.find(arg => typeof arg === 'function' );
}

export function CatchError() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            let result;
            try {
                result = await originalMethod.apply(this, args);
            } catch (e) {
                console.error(`${propertyKey} error ${e}`);
            }
            return result ?? null;
        };
        return descriptor;
    };
}