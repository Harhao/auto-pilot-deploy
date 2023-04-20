import Koa from 'koa';
import glob from "glob";
import path from "path";


export class ServiceLoader {

    public static async load(app: Koa, dir: string) {
        const files = glob.sync(path.join(dir, '**/*.ts'));

        for (const file of files) {
            const serviceClass = (await import(file)).default;
            const isNeedCtx = Reflect.getMetadata('isNeedCtx', serviceClass);
            if (isNeedCtx) {
                const { mongodbService, redisService, socketService } = app.context.state;
                serviceClass.service = { mongodbService, redisService, socketService };
            }
        }
    }
}
