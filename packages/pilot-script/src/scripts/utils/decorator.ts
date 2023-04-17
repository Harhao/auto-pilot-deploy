import { Log } from './log';

export function RequireClient() {
    return function (target: any, propertyKey: string, descriptor: any) {
        const value = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if (!this.client) {
                this.client = await this.getClientHandle(this.pilotConfig);
                value.apply(this, args);
                return;
            }
            value.apply(this, args);
        };
        return descriptor;
    };
}

export function catchError() {
    return function (target: any, propertyKey: string, descriptor: any) {
        const value = descriptor.value;
        descriptor.value = function (...args: any[]) {
            try {
                value.apply(this, args);
            } catch (e) {
                Log.error(`${propertyKey} error ${e}`);
                return null;
            }
        };
        return descriptor;
    };
}