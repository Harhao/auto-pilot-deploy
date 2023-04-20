import { Context } from "koa";

interface ServiceClasses {
    [key: string]: new () => any;
}

export function Inject(data: ServiceClasses) {
    return function (target: any) {
        const services = target.prototype.ctx.state.services || {};
        let instance = null;
        for (let [key, serviceClass] of Object.entries(data)) {
            instance = getInstanceOfClass(services, serviceClass);

            target[key] = instance;
        }
        target.prototype.ctx.state.services = { ...services, key: instance };
    };

}


export function getInstanceOfClass(services: Record<string, any>, ServiceClass: new () => any) {

    if (Object.keys(services).length > 0) {
        for (let [_, instance] of Object.entries(services)) {
            if (instance instanceof ServiceClass) {
                return instance;
            }
        }
    }
    return new ServiceClass();

}