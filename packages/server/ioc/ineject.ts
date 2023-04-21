import "reflect-metadata";
import container from "./container";

export type classType = new (...args: any[]) => any;

export function Inject(target: any, propertyKey: string) {

    const propertyType = Reflect.getMetadata("design:type", target, propertyKey);

    let propertyInstance = container.getInstance(propertyType);

    if (!propertyInstance) {
        const propertyClass = container.getProvider(propertyType);
        propertyInstance = new propertyClass();
        container.setInstance(propertyType, propertyInstance);
    }

    target[propertyKey] = propertyInstance;

    return (target as any)[propertyKey];
}