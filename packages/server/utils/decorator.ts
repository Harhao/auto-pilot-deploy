import "reflect-metadata";

export function Controller(pathPrefix: string) {

    return function<T extends { new (...args: any[]): {}}>(target: T) {
        const methods = Object.getOwnPropertyNames(target.prototype);

        for(let i = 0; i < methods.length; i++) {
            const methodName = methods[i];
            const method = target.prototype[methodName];

            if(typeof method !== 'function' && methodName === 'constructor') {
                continue;
            }

            const route = Reflect.getMetadata("route", method);
            const methodType = Reflect.getMetadata("method", method);
            
        }
    }
}