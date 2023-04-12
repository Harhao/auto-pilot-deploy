import path from 'path';
import Base from './base';
import Log from './utils/log';
import fse from 'fs-extra';
import { IPilotCofig, IProjectCofig } from '../consts';
import { FROMTENDDIR, NGINXCONFIGPATH, NPMREGISTRY } from '../config';

export default class ClientPlatform extends Base {
    public async execute(pilotCofig: IPilotCofig, projectConfig: IProjectCofig) {
        try {
            Log.success('✨ 开始运行pilot脚本 ✨');
            const localPath = await this.downloadRepo(projectConfig.gitUrl, pilotCofig);
            if (localPath) {
                await this.deployJob(localPath, projectConfig, pilotCofig);
            }
        } catch (e) {
            Log.error(`execute error ${e}`);
        } finally {
            this.destroyRemoveHandle();
        }
    }
    public async deployJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig) {
        try {
            const { branch, command, tool, dest } = projectConfig;
            const folderName = this.cmd.getGitRepoName(projectConfig.gitUrl) as string;
            const remoteDir = `${FROMTENDDIR}/${folderName}`;
            const localDir = path.resolve(process.cwd(), dest);
            Log.success(`运行命令脚本目录是${localPath}`);
            if (localPath) {
                const commands = command.split(' ');
                this.cmd.changeDirectory(localPath);
                await this.cmd.switchToBranch(branch);
                await this.cmd.runCmd(`npm config set registry ${NPMREGISTRY}`,[]);
                await this.cmd.runCmd(tool, ['install']);
                await this.cmd.runCmd(tool, [...commands]);
                await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
                // await this.configNginxConf();
            }
        } catch (e) {
            Log.error(`${e}`);
        }
    }
    
    public async configNginxConf() {
        try {
            const remoteConf = `${NGINXCONFIGPATH}/frontend.conf`;
            const localNginx = path.resolve(__dirname, '../ejs/frontend_nginx.conf');
            const nginxConf = fse.readFileSync(localNginx, 'utf8');
            const isFileExist = await this.isFileExist(remoteConf, 'frontend.conf');
            Log.info(`fronend.conf is exist ${isFileExist}`);
            if(!isFileExist) {
                await this.client.execCommand(`echo "${nginxConf}" > ${remoteConf}`);
                await this.client.execCommand('nginx -s reload');
            }
        } catch (e) {
            Log.error(`restartNginx restart error ${e}`);
        }
    }
}
