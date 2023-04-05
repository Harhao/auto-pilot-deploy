import prompts from 'prompts';
import CmdScript from '../scripts/cmd';
import { projectConfig, deployConfig } from '../config/index';
import Log from '../scripts/utils/log';
import path from 'path';
import fse from 'fs-extra';

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
        this.startDeployJob();
    }

    public async downloadRepo(gitUrl: string) {
        const data = fse.readJsonSync(this.configPath);
        if (data?.gitPass) {
            // const isConfig = await this.cmd.updateGitConfigure({
            //     auth: data.gitPass,
            //     url: gitUrl
            // });
            // if (isConfig) {
                return await this.cmd.cloneRepo(gitUrl);
            // }
        }
        return null;
    }

    public async startDeployJob() {
        try {
            const { gitUrl, branch, command, tool } = await prompts(projectConfig);
            const localPath = await this.downloadRepo(gitUrl);
            Log.success(`运行命令脚本目录是${localPath}`);
            if(localPath) {
                const commands = command.split(' ');
                this.cmd.changeDirectory(localPath);
                await this.cmd.switchToBranch(branch);
                await this.cmd.runCmd(tool, ['install']);
                await this.cmd.runCmd(tool, [...commands]);
                Log.success('开始执行上传操作～');
            }
        } catch (e) {
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
        fse.writeFileSync(this.configPath, data, {
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
