import os from 'os';
import path from 'path';
import fse from 'fs-extra';
import Log from './utils/log';
import loading from 'loading-cli';
import simpleGit, { SimpleGit } from 'simple-git';
import { SpawnSyncReturns, spawnSync } from 'child_process';
import { CREATEFOLDER } from '../consts/index';

export interface ICmdOptions {
  generateFolderName?: string;
}

export default class CmdScript {
  public targetPath: string;
  public generateFolderName: string;
  public processMap: Map<number, number | string>;
  private git: SimpleGit = simpleGit();

  constructor(options: ICmdOptions) {
    this.processMap = new Map();
    this.generateFolderName = options.generateFolderName ?? CREATEFOLDER;
    this.targetPath = this.getUserHomePath(this.generateFolderName);
  }

  async cloneRepo(repoUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        const folderName = this.getGitRepoName(repoUrl) as string;
        const gitFolder = path.resolve(this.targetPath, folderName);
        if (this.checkPathExists(gitFolder)) {
          this.deleteDirectory(gitFolder);
        }
        const load = this.showLoading('下载git仓库中');
        this.git.clone(repoUrl, gitFolder, ['--progress'], (e, result) => {
          if (e) {
            Log.error(`Error cloning repository: ${e}`);
            resolve(null);
            return;
          }
          load.succeed('下载成功');
          resolve(gitFolder);
        });
      } catch (e) {
        Log.error(`download git repo error ${e}`);
        reject(null);
      }
    });
  }

  deleteDirectory(directory: string) {
    if (this.checkPathExists(directory)) {
      fse.removeSync(directory); // 删除当前目录
    }
  }

  checkPathExists(targetPath: string): boolean {
    return fse.pathExistsSync(targetPath);
  }

  async changeDirectory(targetPath: string) {
    try {
      const checkPathExists = this.checkPathExists(targetPath);
      if (checkPathExists) {
        process.chdir(targetPath);
      }
    } catch (e) {
      Log.error(`${e}`);
    }
  }

  getUserHomePath(targetPath: string): string {
    try {
      const homeDir = os.homedir();
      const folderPath = path.resolve(
        homeDir,
        this.generateFolderName || targetPath
      );
      const isExist = this.checkPathExists(folderPath);
      if (!isExist) {
        fse.mkdirsSync(folderPath);
        return folderPath;
      }
      return folderPath;
    } catch (e) {
      Log.error(`${e}`);
      return '';
    }
  }

  public runCmd(
    command: string,
    args: string[] = []
  ): Promise<SpawnSyncReturns<Buffer> | null> {
    return new Promise((resolve) => {
      const cmdProcess: any = this.getChildProcess(command, args);
      if (cmdProcess) {
        if (!this.processMap.has(cmdProcess.pid)) {
          this.processMap.set(cmdProcess.pid, cmdProcess.pid);
        }
        resolve(cmdProcess);
        return;
      }
      resolve(null);
    });
  }

  public stopCmdRun(pid: number) {
    if (pid) {
      if (this.processMap.has(pid)) {
        this.processMap.delete(pid);
        process.kill(pid, 'SIGTERM');
      }
    }
  }

  private getChildProcess(
    command: string,
    args: string[]
  ): SpawnSyncReturns<Buffer> {
    return spawnSync(command, args, { stdio: 'inherit' });
  }

  public rollBack(commitHash: string) {
    const cmd = `git checkout ${commitHash}`;
    this.runCmd(cmd, []);
  }

  private showLoading(loadingText: string) {
    const load = loading({
      text: loadingText,
      color: 'green',
      interval: 100,
      stream: process.stdout,
      frames: [
        '🕐',
        '🕑',
        '🕒',
        '🕓',
        '🕔',
        '🕕',
        '🕖',
        '🕗',
        '🕘',
        '🕙',
        '🕚',
      ],
    }).start();
    return load;
  }

  getGitRepoName(repoUrl: string): string | null {
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
  async switchToBranch(branch: string): Promise<boolean> {
    try {
      const result = await this.git.checkout(branch);
      console.log('分支已经切换到：', result);
      return true;
    } catch (err) {
      console.log('切换分支失败：', err);
      return false;
    }
  }

  async updateGitConfigure(config: {
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
}
