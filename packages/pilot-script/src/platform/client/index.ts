import path, { resolve } from 'path';
import Base from '../../common/base';
import { Log, catchError } from '../../scripts/utils';
import fse from 'fs-extra';
import { IPilotCofig, IProjectCofig } from '../../consts';
import { FROMTENDDIR, NGINXCONFIGPATH, NPMREGISTRY } from '../../config';
import ejs from 'ejs';

export class ClientPlatform extends Base {

    @catchError()
    public async execute(pilotCofig: IPilotCofig, projectConfig: IProjectCofig) {
        Log.success('✨ 开始运行前端部署脚本 ✨');
        const localPath = await this.downloadRepo(projectConfig.gitUrl, pilotCofig);
        if (localPath) {
            await this.deployJob(localPath, projectConfig, pilotCofig);
        }

        this.client.dispose();

    }
    
    @catchError()
    public async deployJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig) {

        const { branch, command, tool, dest } = projectConfig;
        const folderName = this.git.getGitRepoName(projectConfig.gitUrl) as string;
        const remoteDir = `${FROMTENDDIR}/${folderName}`;
        const localDir = path.resolve(localPath, dest);
        Log.success(`运行命令脚本目录是${localPath}`);
        if (localPath) {
            const commands = command.split(' ');
            this.file.changeDirectory(localPath);
            await this.git.switchToBranch(branch);
            await this.cmd.runCmd(`npm config set registry ${NPMREGISTRY}`, []);
            await this.cmd.runCmd(tool, ['install']);
            await this.cmd.runCmd(tool, [...commands]);
            await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
            await this.configNginxConf();
        }
    }

    @catchError()
    public async configNginxConf() {
        const remoteConf = `${NGINXCONFIGPATH}/frontend.conf`;
        const nginxEjsPath = resolve(__dirname, '../ejs/frontend_nginx.ejs');
        const ejsContent = fse.readFileSync(nginxEjsPath, 'utf8');
        const nginxConf = ejs.render(ejsContent);
        const isFileExist = await this.isFileExist(remoteConf, 'frontend.conf');
        Log.info(`frontend.conf is exist ${isFileExist}`);
        if (!isFileExist) {
            await this.client.execCommand(`echo "${nginxConf}" > ${remoteConf}`);
            await this.client.execCommand('nginx -s reload');
        }
    }
}
