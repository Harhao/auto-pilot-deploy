type classType = new (...args: any[]) => any;

class Container {

    private readonly providerMap: Map<classType, classType> = new Map();
    private readonly instanceMap: Map<classType, classType> = new Map();
    private static  instance: Container;

    public static getInstance() {
        if(!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    public setProvider(key: classType, value: classType) {
        if (!this.providerMap.has(key)) {
            this.providerMap.set(key, value);
        }
    }

    public getProvider(key: classType): classType {
        return this.providerMap.get(key);
    }

    public setInstance(key: classType, value: any) {
        if (!this.instanceMap.has(key)) {
            this.instanceMap.set(key, value);
        }
    }

    public getInstance(key: classType): any {

        return this.instanceMap.get(key);
    }

}

export default Container.getInstance();