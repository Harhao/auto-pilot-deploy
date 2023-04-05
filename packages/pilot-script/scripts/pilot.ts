import prompts from 'prompts';
import CmdScript from './cmd';
import { projectConfig, deployConfig } from '../config/index';
import Log from '../scripts/utils/log';
import path from 'path';
import fse from 'fs-extra';
import { Client } from 'ssh2';
import { ENVCONFIGNAME } from '../consts/index';

interface IEnvConfig {
    'address': string;
    'serverPass': string;
    'gitUser': string;
    'gitPass': string;
}

export default class Pilot {
    private cmd: CmdScript;
    private configPath: string;
    constructor() {
        this.cmd = new CmdScript({});
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

    public async downloadRepo(gitUrl: string, data: IEnvConfig) {
        if (data?.gitPass) {
            const isConfig = await this.cmd.updateGitConfigure({
                auth: data.gitPass,
                user: data.gitUser,
                url: gitUrl
            });
            return isConfig ? await this.cmd.cloneRepo(gitUrl) : null;
        }
        return null;
    }

    public async startDeployJob() {
        try {
            const { gitUrl, branch, command, tool, dest } = await prompts(projectConfig);
            const data = fse.readJsonSync(this.configPath);
            const localPath = await this.downloadRepo(gitUrl, data) as string;
            const localDest = path.resolve(localPath, dest);
            Log.success(`运行命令脚本目录是${localPath}`);
            if (localPath) {
                const commands = command.split(' ');
                this.cmd.changeDirectory(localPath);
                await this.cmd.switchToBranch(branch);
                await this.cmd.runCmd(tool, ['install']);
                await this.cmd.runCmd(tool, [...commands]);
                await this.uploadFileToServer(data, localDest);
            }
        } catch (e) {
            Log.error(`${e}`);
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
            flag: 'w+'
        });
    }

    public checkGitConfig(): boolean {
        return this.cmd.checkPathExists(this.configPath);
    }

    public uploadFileToServer(data: any, localDest: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const { address, account, serverPass } = data;
                const remotePath = '/root';
                if (address && account && serverPass) {
                    Log.success('开始执行上传操作～');
                    const client = new Client();
                    client.on('ready', () => {
                        Log.success('已经准备完毕');
                    }).connect({
                        host: address,
                        port: 22,
                        username: account,
                        password: serverPass
                    });

                }

            } catch (e) {
                Log.error(`上传文件到服务器失败${e}`);
            }
        });
    }
}