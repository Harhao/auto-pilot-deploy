import { spawn } from "child_process";


export interface ICmdService {
    pilotConfig: string;
}

export default class CmdService {
    public pilotConfig: any;

    constructor(props: ICmdService) {
        this.pilotConfig = props.pilotConfig;
    }
    //  获取服务列表
    public getServiceList(pilotConfig: string) {
        return new Promise((resolve) => {
            const child = spawn(`pilot-script`, ['service', '--pilotConfig', pilotConfig]);
            child.stdout.on('data', (data) => {
                const jsonData = JSON.parse(data.toString('utf-8'));
                resolve(jsonData);
            });
        });
    }
    // 部署服务
    public deployService(projectConfig: string, onData: Function, onErr: Function) {
        return new Promise((resolve) => {
            const child = spawn('pilot-script', ['deploy', '--pilotConfig', this.pilotConfig, '--projectConfig', projectConfig]);
            child.stdout.on('data', (data) => {
                onData?.(data);
            });
            child.stderr.on('data', (data) => {
                onErr?.(data);
            });
            child.stdout.on('close', () => {
                resolve(true);
            });
        });
    }
}