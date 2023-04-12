import path from 'path';
import Base from './base';
import Log from './utils/log';
import { IPilotCofig, IProjectCofig } from '../consts';

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
   
}
