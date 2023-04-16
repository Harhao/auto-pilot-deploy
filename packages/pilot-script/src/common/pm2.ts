import { NodeSSH } from 'node-ssh';
import { IPilotCofig } from 'src/consts';

export default class Pm2 {
    public client: NodeSSH | undefined;

    constructor(config: IPilotCofig) {
        this.initClient(config);
    }

    public async initClient(config: IPilotCofig) {
        this.client = new NodeSSH();
        this.client = await this.client.connect({
            host: config.address,
            port: 22,
            username: config.account,
            password: config.serverPass,
        });
    }


    public async getServiceList() {
        const result =  await this.client!.execCommand('ls -al');
        console.log(result);
    }


}