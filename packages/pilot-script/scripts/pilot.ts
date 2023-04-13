import prompts from 'prompts';
import path from 'path';
import fse from 'fs-extra';
import CmdScript from '../common/cmd';
import { Log } from './utils';
import ClientPlaform from '../client';
import NodePlatform from '../node';
import { projectConfig, deployConfig, ENVCONFIGNAME } from '../config';
import { EProjectType, IPilotCofig, IProjectCofig } from '../consts/index';

export interface IPilotOptions {
    deployFolder: string;
}

type PilotPlatform = ClientPlaform | NodePlatform | undefined;
export default class Pilot {
    // 本地配置密钥信息路径
    private configPath: string;
    private cmd: CmdScript;
    private platform: PilotPlatform;

    constructor() {
        this.cmd = new CmdScript({});
        this.configPath = this.getConfigPath();
    }

    public async initConfigure() {
        try {
            const hasGitEnv = this.checkGitConfig();
            let answers = null;
            if (!hasGitEnv) {
                answers = await prompts(deployConfig);
                this.createGitEnv(answers);
            } else {
                answers = fse.readJsonSync(this.configPath);
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

    public async execute() {
        try {
            const pilotCofig = (await this.initConfigure()) as IPilotCofig;
            const projectConfig = await this.initProject() as IProjectCofig;

            switch (projectConfig.type) {
                case EProjectType.FRONTEND:
                    this.platform = new ClientPlaform();
                    break;
                case EProjectType.BACKEND:
                    this.platform = new NodePlatform();
                    break;
                default: Log.warn('暂未支持其他服务类型项目');
            }
            await this.platform?.execute(pilotCofig, projectConfig);
            Log.success('部署成功～');

        } catch (e) {
            Log.error(`execute error ${e}`);
        }
    }

    public getConfigPath(): string {
        const rootDir = this.cmd.targetPath;
        return path.resolve(rootDir, ENVCONFIGNAME);
    }

    public createGitEnv(answers: Record<string, string>) {
        const data = JSON.stringify(answers);
        fse.writeFileSync(this.configPath, data, {
            encoding: 'utf8',
            mode: 0o644,
            flag: 'w+',
        });
    }

    public checkGitConfig(): boolean {
        return this.cmd.checkPathExists(this.configPath);
    }
}
