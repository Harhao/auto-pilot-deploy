export function Injectable<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            Reflect.defineMetadata('isNeedCtx', true, constructor);
        }
    };
}