import prompts from 'prompts';
import ClientPlaform from '../client';
import NodePlatform from '../node';
import FileScript from '../common/file';
import Pm2 from '../common/pm2';
import { Log, catchError } from './utils';
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


    @catchError()
    public async initConfigure() {
        const hasGitEnv = this.file.checkPathExists(this.pilotConfigPath);
        let answers = null;
        if (!hasGitEnv) {
            answers = await prompts(deployConfig);
            this.file.writeFileSync(this.pilotConfigPath, JSON.stringify(answers));
        } else {
            answers = this.file.readJsonFile(this.pilotConfigPath);
        }
        return answers;
    }

    @catchError()
    public async initProject() {
        return await prompts(projectConfig);
    }

    // pilot-script 运行入口
    @catchError()
    public async startWork() {

        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const projectConfig = await this.initProject() as IProjectCofig;
        await this.startDeploy({ pilotCofig, projectConfig });

    }
    // pilot-script 回退入口
    @catchError()
    public async rollBackWork() {

        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const projectConfig = await this.initProject() as IProjectCofig;
        const config = (await prompts(rollBackConfig));
        await this.startRollBackJob({ pilotCofig, projectConfig, rollBackConfig: config });

    }

    // pilot-script 回退入口
    @catchError()
    public async listServiceWork() {

        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const pm2 = new Pm2(pilotCofig);
        const json = await pm2.getServiceList();

    }

    // 终止进程
    @catchError()
    public async stopWork() {

        Log.info('stopWork');

    }

    @catchError()
    public async startDeploy(config: { pilotCofig: IPilotCofig, projectConfig: IProjectCofig }) {

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


    }

    @catchError()
    public async startRollBackJob(rollBackConfig: unknown) {

        console.log(rollBackConfig);

    }
}
