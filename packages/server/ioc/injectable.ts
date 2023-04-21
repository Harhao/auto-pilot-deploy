import container from './container';


export function Injectable (constructor: any) {
    container.setProvider(constructor, constructor);
    return constructor;
}