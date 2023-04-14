import { SpawnSyncReturns, spawnSync } from 'child_process';

export default class CmdScript {

  public runCmd(
    command: string,
    args: string[] = []
  ): Promise<SpawnSyncReturns<Buffer> | null> {
    return new Promise((resolve) => {
      const cmdProcess: any = this.getChildProcess(command, args);
      if (cmdProcess) {
        resolve(cmdProcess);
        return;
      }
      resolve(null);
    });
  }

  public stopCmdRun(pid: number) {
    if (pid) {
      process.kill(pid, 'SIGTERM');
    }
  }

  private getChildProcess(
    command: string,
    args: string[]
  ): SpawnSyncReturns<Buffer> {
    return spawnSync(command, args, { stdio: 'inherit' });
  }
}
