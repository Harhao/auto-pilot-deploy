import KoaRouter from 'koa-router';
import glob from 'glob';
import path from 'path';
import Koa, { Next, Context } from "koa";
import 'reflect-metadata';

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch';

interface Middleware {
    (ctx: Koa.Context, next: () => Promise<any>): any;
}

interface IControllerRoute {
    routePath: string;
    method: HTTPMethod;
    functionName: string;
    params: any;
    middlewares: Middleware[];
};

export class ControllerLoader {


    public static async load(app: any, dir: string) {

        const files = glob.sync(path.join(dir, '**/*.ts'));

        files.forEach(async (file) => {

            const controller = (await import(file)).default;

            const router = new KoaRouter();

            ControllerLoader.registerRoutes(router, controller);


            app.use(router.routes());
            app.use(router.allowedMethods());

        });
    }

    private static registerRoutes(router: KoaRouter, controller: any) {

        const controllerRoutes = Reflect.getMetadata('controllerInfo', controller);

        controllerRoutes.forEach((route: IControllerRoute) => {
            const { method, routePath, middlewares, functionName, params } = route;

            router[method](routePath, ...middlewares, async (ctx: Context, next: Next) => {

                const inst = new controller();

                if (params) {
                    const args = [];
                    args[params.index] = params.fn(ctx);
                    args.push(ctx, next);
                    return await inst[functionName](...args);
                }
                return await inst[functionName](ctx, next);
            });
        });
    }
}
