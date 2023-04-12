import path, { resolve } from 'path';
import Base from './base';
import Log from './utils/log';
import prompts from 'prompts';
import ejs from 'ejs';
import fse from 'fs-extra';
import { IProjectCofig, IPilotCofig } from '../consts';
import { SSHExecCommandOptions } from 'node-ssh';
import { nginxConfig } from '../config/index';

export default class NodePlatform extends Base {
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
            const remoteRootFolder = (dest || this.cmd.getGitRepoName(projectConfig.gitUrl)) as string;
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
                await this.cmd.switchToBranch(branch);
                await this.uploadFileToServer(pilotCofig, localDir, remoteDir);
                await this.client.execCommand(`${tool} install`, cmdConfig);
                await this.client.execCommand(`${tool} ${command}`, cmdConfig);
                await this.client.execCommand(`${tool} run serve`, cmdConfig);
                await this.configNginxConf({ cmdConfig: cmdConfig}, remoteRootFolder);

                // docker 部署方式
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

    public async configNginxConf(config: { cmdConfig: SSHExecCommandOptions}, remoteFolder:string) {
        try {
            const remoteConf = `/etc/nginx/conf.d/${remoteFolder}.conf`;
            const answers = await prompts(nginxConfig);
            const nginxEjsPath = resolve(__dirname, '../ejs/backend_nginx.ejs');
            const ejsContent = fse.readFileSync(nginxEjsPath, 'utf8');
            const nginxConf = ejs.render(ejsContent, answers);
            await this.client.execCommand(`echo "${nginxConf}" > ${remoteConf}`, config.cmdConfig);
            await this.client.execCommand('nginx -S reload', config.cmdConfig);
        } catch (e) {
            Log.error(`restartNginx restart error ${e}`);
        }
    }
}