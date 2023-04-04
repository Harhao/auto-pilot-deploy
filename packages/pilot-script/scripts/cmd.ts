import os from 'os';
import path from 'path';
import fse from 'fs-extra';
import Log from './utils/log';
import loading from 'loading-cli';
import simpleGit, { SimpleGit } from 'simple-git';
import { ChildProcess, spawn } from 'child_process';

export interface ICmdOptions {
  generateFolderName?: string;
}

export default class CmdScript {
  public targetPath: string;
  public generateFolderName: string;
  public processMap: Map<number, number | string>;

  constructor(options: ICmdOptions) {
    this.processMap = new Map();
    this.generateFolderName = options.generateFolderName ?? 'pilot';
    this.targetPath = this.getUserHomePath(this.generateFolderName);
  }

  async cloneRepo(repoUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        const git: SimpleGit = simpleGit();
        const folderName = this.getGitRepoName(repoUrl) as string;
        const gitFolder = path.resolve(this.targetPath, folderName);
        if (this.checkPathExists(gitFolder)) {
          this.deleteDirectory(gitFolder);
        }
        const load = this.showLoading('下载git仓库中');
        git.clone(repoUrl, gitFolder, ['--depth=1'], (e, result) => {
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
    if(this.checkPathExists(directory)) {
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

  public runCmd(command: string, args: string[] = []): ChildProcess | null {
    const cmdProcess: any = this.getChildProcess(command, args);
    if (cmdProcess) {
      if (!this.processMap.has(cmdProcess.pid)) {
        this.processMap.set(cmdProcess.pid, cmdProcess.pid);
      }
      return cmdProcess;
    }
    return null;
  }

  public stopCmdRun(pid: number) {
    if (pid) {
      if (this.processMap.has(pid)) {
        this.processMap.delete(pid);
        process.kill(pid, 'SIGTERM');
      }
    }
  }

  private getChildProcess(command: string, args: string[]): ChildProcess {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', (e) => {
      console.log(e);
    });
    child.on('exit', (code) => {
      if (!code) {
        process.exit(0);
      }
      process.exit(1);
    });
    return child;
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
      const [_, username, repository] = match;
      return repository;
    } else {
      Log.error('Invalid Git repository URL');
      return null;
    }
  }
}
