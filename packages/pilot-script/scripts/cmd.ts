import os from 'os';
import fs from 'fs';
import path from 'path';
import gitclone from 'git-clone';
import Log from './utils/log';
import process from 'process';
import { execSync } from 'child_process';

export interface ICmdOptions {
  targetPath: string;
  generateFolderName: string;
}

export default class CmdScript {
  private targetPath: string;
  private generateFolderName: string;
  private processList: number[];

  constructor(options: ICmdOptions) {
    this.processList = [];
    this.generateFolderName = options.generateFolderName ?? 'pilot';
    this.targetPath = this.getUserHomePath(options.generateFolderName);
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

  isPathExist(targetPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.stat(targetPath, (err, stats) => {
        if (err) {
          console.error('Folder does not exist');
          reject(false);
        } else {
          if (stats.isDirectory()) {
            console.log('Folder exists');
            resolve(true);
          } else {
            console.error('Path is not a folder');
            reject(false);
          }
        }
      });
    });
  }

  async changeDirectory(targetPath: string) {
    try {
      const isPathExist = await this.isPathExist(targetPath);
      if(isPathExist) {
        process.chdir(targetPath);
      }
    } catch (e) {
      console.log(e);
    }
  }

  getUserHomePath(targetPath: string) {
    const homeDir = os.homedir();
    const folderPath = path.resolve(
      homeDir,
      this.generateFolderName || targetPath
    );
    if (!this.isPathExist(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      return folderPath;
    }
    return folderPath;
  }

  private runCmd(command: string) {
    if(command) {
      execSync(command, );
    }
  }
}
