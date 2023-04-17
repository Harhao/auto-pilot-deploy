import CmdScript from './cmd';
import FileScript from './file';
import GitScript from './git';
import path from 'path';
import { NodeSSH } from 'node-ssh';
import { IPilotCofig } from '../consts/index';
import { Log, catchError } from '../scripts/utils';
import { Dirent } from 'fs-extra';



export default class Base {

    public cmd: CmdScript;
    public file: FileScript;
    public git: GitScript;
    public client: NodeSSH;

    constructor() {
        this.cmd = new CmdScript();
        this.git = new GitScript();
        this.file = new FileScript();
        this.client = new NodeSSH();
    }

    /**
     * 下载git仓库，返回本地路径
     * @param gitUrl git仓库地址
     * @param data 服务器/git权限信息
     * @returns 返回下载的git仓库本地地址
     */
    @catchError()
    public async downloadRepo(gitUrl: string, data: IPilotCofig) {
        if (data?.gitPass) {
            const isConfig = await this.git.updateGitConfigure({
                auth: data.gitPass,
                user: data.gitUser,
                url: gitUrl,
            });
            return isConfig ? await this.git.cloneRepo(gitUrl) : null;
        }
        return null;
    }
    /**
     * 上传文件夹到服务器
     * @param data 服务器密钥配置
     * @param localDir 本地需要上传的文件夹
     * @param remoteDir 需要上传到远程文件夹
     */
    @catchError()
    public async uploadFileToServer(data: IPilotCofig, localDir: string, remoteDir: string) {
        const { address, account, serverPass } = data;
        if (this.file.checkPathExists(localDir)) {
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

    }
    /**
     * 上传文件夹到远程
     * @param localDir 本地文件夹（需要上传）
     * @param remoteDir 远程服务目录
     */
    @catchError()
    public async uploadDirectory(localDir: string, remoteDir: string) {
        const files = await this.file.readDirectory(localDir) as Dirent[];

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

    /**
     * 判断远程文件是否存在
     * @param filePath 
     * @param fileName 
     * @returns 
     */
    @catchError()
    public async isFileExist(filePath: string, fileName: string) {
        const result = await this.client.execCommand(`ls -l ${filePath}`);
        if (result.stdout.includes(`${fileName}`)) {
            return true;
        }
        return false;
    }
}
