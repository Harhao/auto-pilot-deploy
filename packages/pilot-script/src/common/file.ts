import os from 'os';
import path from 'path';
import fse from 'fs-extra';
import { catchError } from '../scripts/utils';
import { CREATEFOLDER, ENVCONFIGNAME } from '../config';

export default class FileScript {

    // 用户下运行目录路径
    public targetPath: string;
    // 本地运行根目录名称
    public generateFolderName: string;

    constructor() {
        this.generateFolderName = CREATEFOLDER;
        this.targetPath = this.getUserHomePath(this.generateFolderName);
    }

    /**
     * 删除文件夹
     * @param directory 本地文件夹
     */
    @catchError()
    public deleteDirectory(directory: string) {
        if (this.checkPathExists(directory)) {
            fse.removeSync(directory); // 删除当前目录
        }
    }

    /**
     * 读取文件夹
     * 
     */
    @catchError()
    public async readDirectory(directory: string) {
        return await fse.promises.readdir(directory, { withFileTypes: true });
    }

    /**
     * 判断文件夹是否存在
     * @param targetPath 
     * @returns 
     */
    @catchError()
    public checkPathExists(targetPath: string): boolean {
        return fse.pathExistsSync(targetPath);
    }

    @catchError()
    public getPilotConfigPath(): string {
        return path.resolve(this.targetPath, ENVCONFIGNAME);
    }

    /**
     * 切换程序文件夹上下文
     * @param targetPath 
     */
    @catchError()
    public async changeDirectory(targetPath: string) {

        const checkPathExists = this.checkPathExists(targetPath);
        if (checkPathExists) {
            process.chdir(targetPath);
        }
    }

    /**
     * 获取用户下路径
     * @param targetPath 
     * @returns 
     */
    @catchError()
    public getUserHomePath(targetPath: string): string {
        const homeDir = os.homedir();
        const folderPath = path.resolve(
            homeDir,
            this.generateFolderName || targetPath
        );
        if (!this.checkPathExists(folderPath)) {
            fse.mkdirsSync(folderPath);
        }
        return folderPath;

    }

    @catchError()
    public writeFileSync(filePath: string, data: string) {
        fse.writeFileSync(filePath, data, {
            encoding: 'utf8',
            mode: 0o644,
            flag: 'w+',
        });
    }

    @catchError()
    public readJsonFile(jsonFilePath: string) {
        return fse.readJsonSync(jsonFilePath);
    }
}
