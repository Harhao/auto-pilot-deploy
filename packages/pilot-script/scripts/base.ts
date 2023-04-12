import CmdScript from './cmd';
import Log from '../scripts/utils/log';
import path from 'path';
import fse from 'fs-extra';
import { NodeSSH } from 'node-ssh';
import { ENVCONFIGNAME, IPilotCofig } from '../consts/index';


export default class Base {
    public cmd: CmdScript;
    // 本地配置密钥信息路径
    public configPath: string;
    public client: NodeSSH = new NodeSSH();

    constructor() {
        this.cmd = new CmdScript({});
        this.configPath = this.getConfigPath();
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

    public getConfigPath(): string {
        const rootDir = this.cmd.targetPath;
        return path.resolve(rootDir, ENVCONFIGNAME);
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

    public async uploadDirectory(localDir: string, remoteDir: string) {
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

    public async isFileExist(filePath: string, fileName: string) {
        const result = await this.client.execCommand(`ls -l ${filePath}`);
        if(result.stdout.includes(`${fileName}`)) {
            return true;
        }
        return false;
    }

    public destroyRemoveHandle() {
        this.client.dispose();
    }
}
