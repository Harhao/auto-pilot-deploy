import prompts from 'prompts';
import FileScript from '../common/file';
import Pm2 from '../common/pm2';

import {
    deployConfig,
    frontNginxConfig,
    NodeNginxConfig,
    projectConfig,
    rollBackConfig,
} from '../config';

import {
    EProjectType,
    IDeployConfig,
    INginxConfig,
    IPilotCofig,
    IProjectCofig,
} from '../consts';

import { ClientPlatform, NodePlatform } from '../platform';
import { catchError, Log } from './utils';

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
    public async getCommonConfig() {
        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const projectConfig = (await this.initProject()) as IProjectCofig;
        const nginxConfig = (await this.initNginx(projectConfig)) as INginxConfig;

        return {
            pilotCofig,
            projectConfig,
            nginxConfig,
        };
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

    @catchError()
    public async initNginx(projectConfig: IProjectCofig) {
        const nginxConfig =
            projectConfig.type === EProjectType.FRONTEND
                ? frontNginxConfig
                : NodeNginxConfig;
        return await prompts(nginxConfig);
    }

    // pilot-script 单独部署入口
    @catchError()
    public async starDeploytWork() {
        const commonConfig = await this.getCommonConfig();
        await this.startDeploy(commonConfig);
    }
    // pilot-script 回滚入口
    @catchError()
    public async rollBackWork() {
        const commonConfig = await this.getCommonConfig();
        const config = await prompts(rollBackConfig);
        await this.startRollBackJob({ ...commonConfig, projectConfig: { ...commonConfig.projectConfig, ...config } });
    }

    //查询服务
    @catchError()
    public async getServiceWorks() {
        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        return await this.getServiceList(pilotCofig);
    }

    @catchError()
    public async getServiceList(pilotCofig: IPilotCofig) {
        const pm2 = new Pm2(pilotCofig);
        return await pm2.getServiceList();
    }

    // 部署服务
    @catchError()
    public async startDeploy(config: IDeployConfig) {
        switch (config.projectConfig.type) {
            case EProjectType.FRONTEND:
                this.platform = new ClientPlatform();
                break;
            case EProjectType.BACKEND:
                this.platform = new NodePlatform();
                break;
            default:
                Log.warn('暂未支持其他服务类型项目');
        }
        await this.platform?.execute(config);
        Log.success('部署成功～');
    }

    // 开始回滚
    @catchError()
    public async startRollBackJob(config: IDeployConfig) {
        if (config) {
            await this.startDeploy(config);
        }
    }

    @catchError()
    public async stopPm2Work(id: number) {
        const pilotConfig = await this.initConfigure();
        await this.stopPm2Service(pilotConfig, id);

    }

    @catchError()
    public async stopPm2Service(pilotConfig: IPilotCofig, id: number) {
        const pm2 = new Pm2(pilotConfig);
        const stdout =  await pm2.stopService(id);
        Log.success(stdout);
    }

    @catchError()
    public async startPm2Work(id: number) {
        const pilotConfig = await this.initConfigure();
        await this.startPm2Service(pilotConfig, id);

    }

    @catchError()
    public async startPm2Service(pilotConfig: IPilotCofig, id: number) {
        const pm2 = new Pm2(pilotConfig);
        const stdout = await pm2.startService(id);
        Log.success(stdout);
    }
}
