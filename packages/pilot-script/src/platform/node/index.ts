import path, { resolve } from 'path';
import Base from '../../common/base';
import ejs from 'ejs';
import fse from 'fs-extra';

import { Log, catchError } from '../../scripts/utils';
import { IProjectCofig, IPilotCofig, IDeployConfig, INginxConfig } from '../../consts';
import { BACKENDDIR, NGINXCONFIGPATH } from '../../config/index';

const options = {
    onStderr(chunk: Buffer) {
        process.stdout.write(`${chunk.toString('utf8')}`);
    }, onStdout(chunk: Buffer) {
        process.stderr.write(`${chunk.toString('utf8')}`);
    }
};

export class NodePlatform extends Base {

    @catchError()
    public async execute(config: IDeployConfig) {
        Log.success('✨ 开始部署node服务脚本 ～✨');
        const { projectConfig, pilotCofig, nginxConfig } = config;
        const localPath = await this.downloadRepo(projectConfig.gitUrl, pilotCofig);
        if (localPath) {
            await this.deployJob(localPath, projectConfig, pilotCofig, nginxConfig);
        }
        this.client.dispose();
    }

    @catchError()
    public async deployJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig, nginxConfig: INginxConfig) {
        const { branch, command, tool, dest } = projectConfig;
        const remoteRootFolder = (dest || this.git.getGitRepoName(projectConfig.gitUrl)) as string;
        const remoteDir = `${BACKENDDIR}/${remoteRootFolder}`;
        const localDir = path.resolve(process.cwd(), localPath);
        if (localPath) {
            const cmdConfig = {
                cwd: remoteDir,
                ...options
            };
            await this.git.switchToBranch(branch);
            !!projectConfig.rollNode && await this.git.resetGitRepo(projectConfig.rollNode);
            await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
            await this.client.execCommand(`${tool} install`, cmdConfig);
            await this.client.execCommand(`${tool} ${command}`, cmdConfig);
            console.log(`pm2 start ${dest} --name="${remoteRootFolder}"`);
            await this.client!.execCommand(`pm2 start ${dest} --name="${remoteRootFolder}" -f`, cmdConfig);
            await this.configNginxConf(remoteRootFolder, nginxConfig);
        }

    }

    @catchError()
    public async configNginxConf(remoteFolder: string, nginxConfig: INginxConfig) {
        
        const remoteConf = `${NGINXCONFIGPATH}/${remoteFolder}.conf`;
        const nginxEjsPath = resolve(__dirname, '../../ejs/backend_nginx.ejs');
        const ejsContent = fse.readFileSync(nginxEjsPath, 'utf8');
        const nginxConf = ejs.render(ejsContent, nginxConfig);
        Log.info('create backend nginx.conf file start');
        await this.client.execCommand(`echo "${nginxConf}" > ${remoteConf}`, options);
        Log.info('restart nginx');
        await this.client.execCommand('nginx -s reload', options);
    }
}