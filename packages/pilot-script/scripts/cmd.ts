import os from 'os';
import fs from 'fs';
import path from 'path';
import gitclone from 'git-clone';
import Log from './utils/log';
import { ChildProcess, spawn } from 'child_process';

export interface ICmdOptions {
  generateFolderName?: string;
}

export default class CmdScript {
  private targetPath: string;
  private generateFolderName: string;
  private processMap: Map<number, number | string>;

  constructor(options: ICmdOptions) {
    this.processMap = new Map();
    this.generateFolderName = options.generateFolderName ?? 'pilot';
    this.targetPath = this.getUserHomePath(this.generateFolderName);
  }

  async cloneRepo(gitUrl: string) {
    return new Promise((resolve, reject) => {
      try {
        gitclone(gitUrl, this.targetPath, {}, function (e) {
          if (e) {
            Log.error(e.message);
            reject(false);
            return;
          }
          Log.success(`download git repo success ${gitUrl}`);
          resolve(true);
        });
      } catch (e) {
        console.log('download git repo error', e);
        reject(false);
      }
    });
  }

  checkPathExists(targetPath: string): boolean {
    try {
      const stats = fs.statSync(targetPath);
      if(stats.isFile() || stats.isDirectory()) {
        return true;
      }
      return false;
    } catch (err) {
      Log.error('路径不存在');
      return false;
    }
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
        fs.mkdirSync(folderPath, { recursive: true });
        return folderPath;
      }
      return folderPath;
    } catch(e) {
      Log.error(`${e}`);
      return '';
    }
  }

  public runCmd(command: string, args: string[]  = []): ChildProcess | null {
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
    child.on('error', (e) => {  console.log(e); });
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
}
