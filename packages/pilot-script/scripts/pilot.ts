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
    private client: Client = new Client();
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
            Log.success(`运行命令脚本目录是${localPath}`);
            if (localPath) {
                const commands = command.split(' ');
                this.cmd.changeDirectory(localPath);
                await this.cmd.switchToBranch(branch);
                await this.cmd.runCmd(tool, ['install']);
                await this.cmd.runCmd(tool, [...commands]);
                this.uploadFileToServer(data, dest);
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

    public uploadFileToServer(data: any, localDest: string) {
        try {
            const { address, account, serverPass } = data;
            const remotePath = `/root/${localDest}`;
            const localTarget = path.resolve(process.cwd(), localDest);
            if (fse.existsSync(localTarget)) {
                Log.success(`已经存在文件目录 ${localTarget}`);
                if (address && account && serverPass) {
                    Log.success('开始执行上传操作～');
                    this.client.on('ready', async () => {
                        Log.success('已经准备完毕');
                        this.sftpExec(`mkdir ${remotePath}`);
                        this.client.exec(`mkdir ${remotePath}`, (e) => {
                            console.log(e);
                        });
                        this.uploadDirectory(localDest, remotePath);
                    }).connect({
                        host: address,
                        port: 22,
                        username: account,
                        password: serverPass
                    });

                }
            }

        } catch (e) {
            Log.error(`上传文件到服务器失败${e}`);
        }

    }

    public sftpExec(command: string) {
        this.client.exec(command, (e, stream) => {
            if (e) {
                Log.error(`${command} exec error, ${e}`);
                return;
            }
            stream.on('close', (code: number, signal: number) => {
                this.client.end();
            }).on('data', (data: string) => {
                Log.success(`STDOUT: ${data}`);
            }).stderr.on('data', (data) => {
                Log.error(`${command} stdout error ${e}`);
            });
        });
    }

    public uploadDirectory(localPath: string, remotePath: string) {
        const files = fse.readdirSync(localPath);
        files.forEach((file) => {
            const stat = fse.statSync(`${localPath}/${file}`);
            if (stat.isFile()) {
                Log.success(`${file} -> ${remotePath}`);
            } else if (stat.isDirectory()) {
                Log.success(`${localPath}/${file} -> ${remotePath}/${file}`);
                this.uploadDirectory(`${localPath}/${file}`, `${remotePath}/${file}`);
            }
        });
    }
}

