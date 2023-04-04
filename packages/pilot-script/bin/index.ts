import prompts  from 'prompts';
import CmdScript from '../scripts/cmd';
import { projectConfig, deployConfig } from '../config/index';
import Log from '../scripts/utils/log';
import path from 'path';
import fs from 'fs';

const envConfigName = 'env.json';
class Pilot {
    private cmd: CmdScript;
    private configPath: string;
    private executePath: string;
    constructor() {
        this.cmd = new CmdScript({});
        this.executePath = path.resolve(__dirname, '../');
        this.configPath = this.getConfigPath();
    }

    public async execute() {
        Log.success('✨ 开始运行pilot脚本 ✨');
        const hasGitEnv = this.checkGitConfig();
        if (!hasGitEnv) {
            const answers = await prompts(deployConfig);
            this.createGitEnv(answers);
        }
        this.initDeployProject();
    }

    public async initDeployProject() {
        try {
            const { gitUrl, } = await prompts(projectConfig);
            const localPath = await this.cmd.cloneRepo(gitUrl);
            Log.success(`运行命令脚本目录是${localPath}`);
            if(localPath) {
                this.cmd.changeDirectory(localPath);
                this.cmd.runCmd('npm', ['install']);
            }
        } catch(e) {
            Log.error(`${e}`);
        }

    }   

    public getConfigPath(): string {
        const rootDir = this.cmd.targetPath;
        const configPath = path.resolve(rootDir, envConfigName);
        return configPath;
    }

    public createGitEnv(answers: Record<string, string>) {
        const data = JSON.stringify(answers);
        fs.writeFileSync(this.configPath, data, {
            encoding: 'utf8',
            mode: 0o644,
            flag: 'w+'
        });
    }

    public checkGitConfig(): boolean {
        return this.cmd.checkPathExists(this.configPath);
    }
}

const pilot = new Pilot();

pilot.execute();
