import prompts from 'prompts';
import { NodePlatform, ClientPlatform } from '../platform';
import FileScript from '../common/file';
import Pm2 from '../common/pm2';
import { Log, catchError } from './utils';
import { projectConfig, deployConfig, rollBackConfig } from '../config';
import { EProjectType, IPilotCofig, IProjectCofig } from '../consts/index';


export interface IPilotOptions {
    deployFolder: string;
}


type PilotPlatform = ClientPlatform | NodePlatform | undefined;
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
    // pilot-script 回滚入口
    @catchError()
    public async rollBackWork() {

        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const projectConfig = await this.initProject() as IProjectCofig;
        const config = (await prompts(rollBackConfig));
        await this.startRollBackJob({ pilotCofig, projectConfig, rollBackConfig: config });

    }

    //查询在跑服务
    @catchError()
    public async listServiceWork() {
        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const pm2 = new Pm2(pilotCofig);
        return await pm2.getServiceList();

    }

    @catchError()
    public async startDeploy(config: { pilotCofig: IPilotCofig, projectConfig: IProjectCofig }) {

        switch (config.projectConfig.type) {
            case EProjectType.FRONTEND:
                this.platform = new ClientPlatform();
                break;
            case EProjectType.BACKEND:
                this.platform = new NodePlatform();
                break;
            default: Log.warn('暂未支持其他服务类型项目');
        }
        await this.platform?.execute(config.pilotCofig, config.projectConfig);
        Log.success('部署成功～');

    }

    // 开始回滚
    @catchError()
    public async startRollBackJob(rollBackConfig: unknown) {

        console.log(rollBackConfig);

    }
}
