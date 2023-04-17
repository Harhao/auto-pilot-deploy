import { NodeSSH } from 'node-ssh';
import { IPilotCofig } from 'src/consts';
import { Log, RequireClient, catchError } from '../scripts/utils';


export type PidType = string | string;
export default class Pm2 {
    public client: NodeSSH | undefined;
    public pilotConfig: IPilotCofig;

    constructor(config: IPilotCofig) {
        this.pilotConfig = config;
    }
    
    public async getClientHandle(config: IPilotCofig) {
        let client = new NodeSSH();
        client = await client.connect({
            host: config.address,
            port: 22,
            username: config.account,
            password: config.serverPass,
        });
        return client;
    }

    @catchError()
    @RequireClient()
    public async getServiceList() {
        const result = await this.client!.execCommand('pm2 jlist');
        console.log(result);
        return result.stdout;

    }

    @catchError()
    @RequireClient()
    public async stopService(pid: PidType) {
        const result = await this.client!.execCommand(`pm2 stop ${pid}`);
        return result.stdout;
    }

    @catchError()
    @RequireClient()
    public async startService(pid: string | number) {

        const result = await this.client!.execCommand(`pm2 start ${pid}`);
        return result.stdout;
    }

    @catchError()
    @RequireClient()
    public async stopAllService(pid?: PidType) {
        const result = await this.client!.execCommand('pm2 stop all');
        return result.stdout;

    }
}