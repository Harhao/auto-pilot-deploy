import { Log } from './log';

export function RequireClient() {
    return function (target: any, propertyKey: string, descriptor: any) {
        const value = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if (!this.client) {
                this.client = await this.getClientHandle(this.pilotConfig);
            }
            const result = value.apply(this, args);
            return result ?? null;

        };
        return descriptor;
    };
}

export function catchError() {
    return function (target: any, propertyKey: string, descriptor: any) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let result;
            try {
                result = originalMethod.apply(this, args);
            } catch (e) {
                Log.error(`${propertyKey} error ${e}`);
            }
            return result ?? null;
        };
        return descriptor;
    };
}
