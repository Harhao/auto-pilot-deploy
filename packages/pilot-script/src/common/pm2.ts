import { NodeSSH } from 'node-ssh';
import { IPilotCofig } from 'src/consts';
import { Log } from '../scripts/utils';


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

    
    public async getServiceList() {
        try {
            if (!this.client) {
                this.client = await this.getClientHandle(this.pilotConfig);
            }
            const result = await this.client!.execCommand('pm2 jlist');
            return result.stdout;
        } catch (e) {
            Log.error(`getServiceList error: ${e}`);
        }
    }

    
    public async stopService(pid: string | number) {
        try {
            if (!this.client) {
                this.client = await this.getClientHandle(this.pilotConfig);
            }
            const result = await this.client.execCommand(`pm2 stop ${pid}`);
            return result.stdout;
        } catch (e) {
            Log.error(`stopService error: ${e}`);
        }
    }
    
    
    public async startService(pid: string | number) {
        try {
            if (!this.client) {
                this.client = await this.getClientHandle(this.pilotConfig);
            }
            const result = await this.client.execCommand(`pm2 start ${pid}`);
            return result.stdout;
        } catch (e) {
            Log.error(`startService error: ${e}`);
        }
    }

    
    public async stopAllService() {
        try {
            if (!this.client) {
                this.client = await this.getClientHandle(this.pilotConfig);
            }
            const result = await this.client.execCommand('pm2 start all');
            return result.stdout;
        } catch (e) {
            Log.error(`startService error: ${e}`);
        }
    }
}