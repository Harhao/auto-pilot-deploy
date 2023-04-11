import prompts from 'prompts';
import CmdScript from './cmd';
import { projectConfig, deployConfig } from '../config/index';
import Log from '../scripts/utils/log';
import path from 'path';
import fse from 'fs-extra';
import { NodeSSH } from 'node-ssh';
import { ENVCONFIGNAME, EProjectType } from '../consts/index';

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
    dest: string;
    type: string;
}

export interface IPilotOptions {
    deployFolder: string;
}

export default class Pilot {
    private cmd: CmdScript;
    // 本地配置密钥信息路径
    private configPath: string;
    private client: NodeSSH = new NodeSSH();

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
        if (localPath) {
            switch (projectConfig.type) {
                case EProjectType.FRONTEND: await this.deployFrontJob(localPath, projectConfig, pilotCofig); break;
                case EProjectType.BACKEND: await this.deployNodeJob(localPath, projectConfig, pilotCofig); break;
                default: Log.warn('暂未支持其他服务类型项目');
            }
            this.client.dispose();
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

    public async deployNodeJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig) {
        try {
            const { branch, command, tool, dest } = projectConfig;
            const remoteRootFolder = dest || this.cmd.getGitRepoName(projectConfig.gitUrl);
            const remoteDir = `/root/${remoteRootFolder}`;
            const localDir = path.resolve(process.cwd(), localPath);
            if (localPath) {
                const cmdConfig = {
                    cwd: remoteDir, onStderr(chunk: Buffer) {
                        Log.warn(`${chunk}`);
                    }, onStdout(chunk: Buffer) {
                        Log.info(`${chunk}`);
                    }
                };
                await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
                await this.client.execCommand(`${tool} install`, cmdConfig);
                await this.client.execCommand(`${tool} ${command}`, cmdConfig);
                await this.client.execCommand(`${tool} run serve`, cmdConfig);

                // await this.cmd.switchToBranch(branch);
                // this.cmd.changeDirectory(localDir);
                // Log.success(`开始执行部署脚本～ ${remoteRootFolder}`);
                // await this.cmd.runCmd(`docker`, ['build', '-t', `${remoteRootFolder}`, '.']);
                // await this.client.execCommand('');
            }
        } catch (e) {
            Log.error(`${e}`);
        }
    }

    public async deployFrontJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig) {
        try {
            const { branch, command, tool, dest } = projectConfig;
            const remoteDir = `/root/${dest}`;
            const localDir = path.resolve(process.cwd(), dest);
            Log.success(`运行命令脚本目录是${localPath}`);
            if (localPath) {
                const commands = command.split(' ');
                this.cmd.changeDirectory(localPath);
                await this.cmd.switchToBranch(branch);
                await this.cmd.runCmd(tool, ['install']);
                await this.cmd.runCmd(tool, [...commands]);
                await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
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

    public async uploadFileToServer(data: any, localDir: string, remoteDir: string) {
        try {
            const { address, account, serverPass } = data;
            if (fse.existsSync(localDir)) {
                Log.success(`已经存在文件目录 ${localDir}`);
                if (address && account && serverPass) {
                    Log.success('开始执行上传操作～');
                    this.client = await this.client.connect({
                        host: address,
                        port: 22,
                        username: account,
                        password: serverPass,
                    });
                    await this.uploadDirectory(localDir, remoteDir);
                    Log.success('上传成功～');
                }
            }
        } catch (e) {
            Log.error(`上传文件到服务器失败${e}`);
        }
    }

    async uploadDirectory(localDir: string, remoteDir: string) {
        const files = await fse.promises.readdir(localDir, { withFileTypes: true });

        for (const file of files) {
            const localFilePath = path.join(localDir, file.name);
            const remoteFilePath = path.join(remoteDir, file.name);

            if (file.isDirectory()) {
                // 如果是文件夹则递归调用uploadDirectory方法
                await this.client.mkdir(remoteFilePath, 'sftp');
                Log.success(`mkdir dir: ${localFilePath} -> ${remoteFilePath}`);
                await this.uploadDirectory(localFilePath, remoteFilePath);
            } else {
                // 如果是文件则使用putFile方法上传
                Log.success(`upload file: ${localFilePath} -> ${remoteFilePath}`);
                await this.client.putFile(localFilePath, remoteFilePath);
            }
        }
    }
}
