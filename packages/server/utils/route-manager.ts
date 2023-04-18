import "reflect-metadata";
import KoaRouter from 'koa-router';


class RouteManager {
    private static instance: RouteManager;
    private router: KoaRouter;

    private constructor() {
        this.router = new KoaRouter();
    }

    public static getInstance() {
        if (!RouteManager.instance) {
            RouteManager.instance = new RouteManager();
        }
        return RouteManager.instance;
    }

    public registerController(controllerClass: any) {

        const controllerInstance = new controllerClass();
        const prefix = Reflect.getMetadata('prefix', controllerClass);

        for (const property in controllerClass.prototype) {
            const routeHandler = controllerClass.prototype[property];
            const routePath = Reflect.getMetadata('path', controllerClass.prototype, property);
            const httpMethod = Reflect.getMetadata('httpMethod', controllerClass.prototype, property);

            if (routePath && httpMethod) {

                const fullPath = prefix ? `/${prefix}${routePath}` : routePath;
                const routeMiddleware = controllerClass[property].bind(controllerInstance);

                switch (httpMethod) {
                    case 'get':
                        this.router.get(fullPath, routeMiddleware, routeHandler);
                        break;
                    case 'post':
                        this.router.post(fullPath, routeMiddleware, routeHandler);
                        break;
                    case 'put':
                        this.router.put(fullPath, routeMiddleware, routeHandler);
                        break;
                    case 'delete':
                        this.router.delete(fullPath, routeMiddleware, routeHandler);
                        break;
                }
            }
        }

    }

    public getRouter(): KoaRouter {
        return this.router;
    }

}

export const routeManager = RouteManager.getInstance();