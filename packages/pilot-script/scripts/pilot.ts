import prompts from 'prompts';
import CmdScript from './cmd';
import { projectConfig, deployConfig } from '../config/index';
import Log from '../scripts/utils/log';
import path from 'path';
import fse from 'fs-extra';
import { Client } from 'ssh2';
import { ENVCONFIGNAME } from '../consts/index';

interface IPilotCofig {
    address: string;
    serverPass: string;
    gitUser: string;
    gitPass: string;
}

interface IProjectCofig {
    gitUrl: string;
    branch: string;
    tool: string;
    command: string;
    dest: string
}

export interface IPilotOptions {
    deployFolder: string;
}

export default class Pilot {
    private cmd: CmdScript;
    // 本地配置密钥信息路径
    private configPath: string;
    private client: Client = new Client();
    private fileSftp: any;

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
        Log.success('✨ 开始运行pilot脚本 ✨');
        const pilotCofig = (await this.initConfigure()) as IPilotCofig;
        const projectConfig = await this.initProject() as IProjectCofig;
        const localPath = await this.downloadRepo(projectConfig.gitUrl, pilotCofig);
        console.log(localPath);
        if (localPath) {
            this.deployJob(localPath, projectConfig, pilotCofig);
        }
    }

    public async downloadRepo(gitUrl: string, data: IPilotCofig) {
        if (data?.gitPass) {
            const isConfig = await this.cmd.updateGitConfigure({
                auth: data.gitPass,
                user: data.gitUser,
                url: gitUrl,
            });
            return isConfig ? await this.cmd.cloneRepo(gitUrl) : null;
        }
        return null;
    }

    public async deployJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig) {
        try {
            const { branch, command, tool, dest } = projectConfig;
            const data = fse.readJsonSync(this.configPath);
            Log.success(`运行命令脚本目录是${localPath}`);
            if (localPath) {
                const commands = command.split(' ');
                this.cmd.changeDirectory(localPath);
                await this.cmd.switchToBranch(branch);
                await this.cmd.runCmd(tool, ['install']);
                await this.cmd.runCmd(tool, [...commands]);
                this.uploadFileToServer(pilotCofig, dest);
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
            flag: 'w+',
        });
    }

    public checkGitConfig(): boolean {
        return this.cmd.checkPathExists(this.configPath);
    }

    public uploadFileToServer(data: any, localDest: string) {
        try {
            const { address, account, serverPass } = data;
            const remotePath = `/root/${localDest}`;
            const localTarget = path.resolve(process.cwd(), localDest);
            if (fse.existsSync(localTarget)) {
                Log.success(`已经存在文件目录 ${localTarget}`);
                if (address && account && serverPass) {
                    Log.success('开始执行上传操作～');
                    this.client
                        .on('ready', async () => {
                            Log.success('已经准备完毕');
                            await this.createRemoteDirectory(`${remotePath}`);
                            this.client.sftp(async (e, sftp) => {
                                if (e) {
                                    Log.error(`sftp error ${e}`);
                                    return;
                                }
                                this.fileSftp = sftp;
                                this.uploadDirectory(localTarget, remotePath);
                            });
                        })
                        .connect({
                            host: address,
                            port: 22,
                            username: account,
                            password: serverPass,
                        });
                }
            }
        } catch (e) {
            Log.error(`上传文件到服务器失败${e}`);
        }
    }

    public async createRemoteDirectory(remotePath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.exec(`sudo mkdir ${remotePath}`, (err, stream) => {
                if (err) {
                    Log.error(`mkdir ${remotePath} Error: ${err}`);
                    reject(false);
                } else {
                    Log.success(`mkdir ${remotePath} success`);
                    resolve(true);
                }
            });
        });
    }

    public uploadFile(localFile: string, remoteFile: string) {
        return new Promise((resolve, reject) => {
            this.fileSftp.fastPut(`${localFile}`, `${remoteFile}`, (err: Error) => {
                if (err) {
                    Log.error(`${err}`);
                    reject(false);
                    return;
                }
                resolve(true);
                Log.success(`${localFile} -> ${remoteFile}`);
            });
        });
    }

    public async uploadDirectory(localPath: string, remotePath: string) {
        return new Promise((resolve) => {
            const files = fse.readdirSync(localPath);
            files.forEach(async (file) => {
                const localActualPath = `${localPath}/${file}`;
                const remoteActualPath = `${remotePath}/${file}`;
                const stat = fse.statSync(localActualPath);
                if (stat.isFile()) {
                    await this.uploadFile(`${localActualPath}`, `${remoteActualPath}`);
                } else if (stat.isDirectory()) {
                    await this.createRemoteDirectory(`${remoteActualPath}`);
                    await this.uploadDirectory(`${localActualPath}`, `${remoteActualPath}`);
                }
            });
            resolve(true);
        });
    }
}
