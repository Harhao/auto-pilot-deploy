import prompts from 'prompts';
import ClientPlaform from '../client';
import NodePlatform from '../node';
import FileScript from '../common/file';
import Pm2 from '../common/pm2';
import { Log } from './utils';
import { projectConfig, deployConfig, rollBackConfig } from '../config';
import { EProjectType, IPilotCofig, IProjectCofig } from '../consts/index';


export interface IPilotOptions {
    deployFolder: string;
}


type PilotPlatform = ClientPlaform | NodePlatform | undefined;
export default class Pilot {
    // 本地配置密钥信息路径
    private pilotConfigPath: string;
    private file: FileScript;
    private platform: PilotPlatform;

    constructor() {
        this.file = new FileScript();
        this.pilotConfigPath = this.file.getPilotConfigPath();
    }
    

    public async initConfigure() {
        try {
            const hasGitEnv = this.file.checkPathExists(this.pilotConfigPath);
            let answers = null;
            if (!hasGitEnv) {
                answers = await prompts(deployConfig);
                this.file.writeFileSync(this.pilotConfigPath, JSON.stringify(answers));
            } else {
                answers = this.file.readJsonFile(this.pilotConfigPath);
            }
            return answers;
        } catch (e) {
            Log.error(`initConfigure  error ${e}`);
        }
    }

    public async initProject() {
        try {
            return await prompts(projectConfig);
        } catch (e) {
            Log.error(`initConfigure  error ${e}`);
        }
    }

    // pilot-script 运行入口
    public async startWork() {
        try {
            const pilotCofig = (await this.initConfigure()) as IPilotCofig;
            const projectConfig = await this.initProject() as IProjectCofig;
            await this.startDeploy({ pilotCofig, projectConfig });
        } catch (e) {
            Log.error(`${e}`);
        }
    }
    // pilot-script 回退入口
    public async rollBackWork() {
        try {
            const pilotCofig = (await this.initConfigure()) as IPilotCofig;
            const projectConfig = await this.initProject() as IProjectCofig;
            const config = (await prompts(rollBackConfig));
            await this.startRollBackJob({ pilotCofig, projectConfig, rollBackConfig: config });
        } catch (e) {
            Log.error(`rollback error ${e}`);
        }
    }

    // pilot-script 回退入口
    public async listServiceWork() {
        try {
            const pilotCofig = (await this.initConfigure()) as IPilotCofig;
            const pm2 = new Pm2(pilotCofig);
            const json = await pm2.getServiceList();
        } catch (e) {
            Log.error(`rollback error ${e}`);
        }
    }

    // 终止进程
    public async stopWork() {
        try {
            Log.info('stopWork');
        } catch (e) {
            Log.error(`stopWork error ${e}`);
        }
    }

    public async startDeploy(config: { pilotCofig: IPilotCofig, projectConfig: IProjectCofig }) {
        try {
            switch (config.projectConfig.type) {
                case EProjectType.FRONTEND:
                    this.platform = new ClientPlaform();
                    break;
                case EProjectType.BACKEND:
                    this.platform = new NodePlatform();
                    break;
                default: Log.warn('暂未支持其他服务类型项目');
            }
            await this.platform?.execute(config.pilotCofig, config.projectConfig);
            Log.success('部署成功～');

        } catch (e) {
            Log.error(`execute error ${e}`);
        }
    }

    public async startRollBackJob(rollBackConfig: unknown) {
        try {
            console.log(rollBackConfig);
        } catch (e) {
            Log.error(`startRollBackJob error: ${e}`);
        }
    }
}
