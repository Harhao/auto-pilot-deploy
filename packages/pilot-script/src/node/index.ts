import path, { resolve } from 'path';
import Base from '../common/base';
import { Log } from '../scripts/utils';
import prompts from 'prompts';
import ejs from 'ejs';
import fse from 'fs-extra';
import { IProjectCofig, IPilotCofig } from '../consts';
import { BACKENDDIR, NGINXCONFIGPATH, nginxConfig } from '../config/index';

const options = {
    onStderr(chunk: Buffer) {
        process.stdout.write(`${chunk.toString('utf8')}`);
    }, onStdout(chunk: Buffer) {
        process.stderr.write(`${chunk.toString('utf8')}`);
    }
};

export default class NodePlatform extends Base {
    public async execute(pilotCofig: IPilotCofig, projectConfig: IProjectCofig) {
        try {
            Log.success('✨ 开始部署啦 ～✨');
            const localPath = await this.downloadRepo(projectConfig.gitUrl, pilotCofig);
            if (localPath) {
                await this.deployJob(localPath, projectConfig, pilotCofig);
            }
        } catch (e) {
            Log.error(`execute error ${e}`);
        } finally {
            this.client.dispose();
        }
    }

    public async deployJob(localPath: string, projectConfig: IProjectCofig, pilotCofig: IPilotCofig) {
        try {
            const { branch, command, tool, dest, deploy } = projectConfig;
            const remoteRootFolder = (dest || this.git.getGitRepoName(projectConfig.gitUrl)) as string;
            const remoteDir = `${BACKENDDIR}/${remoteRootFolder}`;
            const localDir = path.resolve(process.cwd(), localPath);
            if (localPath) {
                const cmdConfig = {
                    cwd: remoteDir,
                    ...options
                };
                await this.git.switchToBranch(branch);
                await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
                await this.client.execCommand(`${tool} install`, cmdConfig);
                await this.client.execCommand(`${tool} ${command}`, cmdConfig);
                await this.client.execCommand(`${tool} ${deploy}`, cmdConfig);
                await this.configNginxConf(remoteRootFolder);
            }
        } catch (e) {
            Log.error(`${e}`);
        }
    }

    public async configNginxConf(remoteFolder: string) {
        try {
            const remoteConf = `${NGINXCONFIGPATH}/${remoteFolder}.conf`;
            const answers = await prompts(nginxConfig);
            const nginxEjsPath = resolve(__dirname, '../ejs/backend_nginx.ejs');
            const ejsContent = fse.readFileSync(nginxEjsPath, 'utf8');
            const nginxConf = ejs.render(ejsContent, answers);
            Log.info('create backend nginx.conf file start');
            await this.client.execCommand(`echo "${nginxConf}" > ${remoteConf}`, options);
            Log.info('restart nginx');
            await this.client.execCommand('nginx -s reload', options);
        } catch (e) {
            Log.error(`restartNginx restart error ${e}`);
        }
    }
}