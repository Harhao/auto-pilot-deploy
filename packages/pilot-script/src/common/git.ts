import path from 'path';
import { Log } from '../scripts/utils';
import simpleGit, { SimpleGit } from 'simple-git';
import FileScript from './file';

export default class GitScript {

    private git: SimpleGit = simpleGit();
    private file: FileScript = new FileScript();

    public async cloneRepo(repoUrl: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            try {
                const folderName = this.getGitRepoName(repoUrl) as string;
                const gitFolder = path.resolve(this.file.targetPath, folderName);
                if (this.file.checkPathExists(gitFolder)) {
                    this.file.deleteDirectory(gitFolder);
                }
                // 开启loading
                this.git.clone(repoUrl, gitFolder, ['--progress'], (e) => {
                    if (e) {
                        Log.error(`Error cloning repository: ${e}`);
                        resolve(null);
                        return;
                    }
                    //TODO 关闭loading
                    this.git.cwd({ path: gitFolder, root: true });
                    resolve(gitFolder);
                });
            } catch (e) {
                Log.error(`download git repo error ${e}`);
                reject(null);
            }
        });
    }

    public getGitRepoName(repoUrl: string): string | null {
        const pattern = /^.*?\/\/.*?\/([\w-]+)\/([\w-]+?)(\.git)?$/;
        const match = repoUrl.match(pattern);
        if (match) {
            const repository = match[2];
            return repository;
        } else {
            Log.error('Invalid Git repository URL');
            return null;
        }
    }

    public async switchToBranch(branch: string): Promise<boolean> {
        try {
            const result = await this.git.checkout(branch);
            console.log('分支已经切换到：', result);
            return true;
        } catch (err) {
            console.log('切换分支失败：', err);
            return false;
        }
    }

    public updateGitConfigure(config: {
        auth: string;
        url: string;
        user: string;
    }): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const { auth, user } = config;
                this.git = this.git
                    .env({
                        GIT_SSH_COMMAND:
                            'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no', // 可选：禁用 SSH 主机密钥检查
                        GIT_ASKPASS: 'echo', // 禁用默认身份验证
                        GIT_TERMINAL_PROMPT: '0', // 禁用终端提示
                        GIT_HTTP_USER_AGENT: 'pilot-script', // 可选：设置自定义 User-Agent 标头
                        GITHUB_TOKEN: auth, // 设置个人访问令牌
                    })
                    .addConfig('credential.helper', 'store') // 可选：存储凭据
                    .addConfig('user.name', `${user}`);
                resolve(true);
            } catch (e) {
                Log.error(`${e}`);
                resolve(false);
            }
        });
    }

    public resetGitRepo() {
        return new Promise((resolve, reject) => {
            this.git.reset();
        });
    }
}
